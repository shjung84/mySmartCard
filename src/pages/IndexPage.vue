<template lang="pug">
q-page
  div.q-pa-md(style="max-width: 500px")
    q-form(
      :model="postForm"
      @submit="handleCalculate"
      @reset="handleReset"
      class="q-gutter-xs"
    )
      q-select(
        v-model="postForm.brand"
        label="카드사 선택"
        :options="brands"
        option-value="code"
        option-label="label"
        stack-label
        emit-value
        map-options
        @update:model-value="handleCards"
      )
        template(v-slot:prepend)
          q-icon(name="business")

      //- 카드 선택
      q-select(
        v-model="postForm.card"
        :options="cards"
        label="카드 선택"
        option-value="value"
        option-label="label"
        stack-label
        emit-value
        map-options
        @update:model-value="handleAnnualFee"
      )
        template(v-slot:prepend)
          q-icon(name="credit_card")

      //- 연회비(카드 종류 국내, 해외)
      q-select(
        v-model="postForm.annualFee"
        :options="annualFees.length ? annualFees : [{ label: '선택하세요.', value: '' }]"
        label="연회비 선택"
        option-value="value"
        option-label="label"
        stack-label
        emit-value
        map-options
      )
        template(v-slot:prepend)
          q-icon(name="event_repeat")

      //- 전월실절, 최소 사용 금액
      q-input(
        v-model="postForm.minUsage"
        label="전월실적, 최소 사용 금액"
        suffix="원"
        stack-label
        input-class="text-right"
        readonly
      )
        template(v-slot:prepend)
          q-icon(name="data_usage")

      //- 월 혜택 금액 (캐시백, 포인트)
      q-input(
        v-model="postForm.monthlyBenefit"
        label="월 혜택 금액"
        suffix="원"
        stack-label
        readonly
        input-class="text-right"
      )
        template(v-slot:prepend)
          q-icon(name="loyalty")
        template(v-slot:append)
          q-btn(
            icon="search"
            color="primary"
            size="sm"
            round
            glossy
            :disable="!stateBenefit"
            @click="handleBenefit"
          )


      //- 월 사용 금액
      q-input(
        v-model="postForm.monthlyUsage"
        label="월 사용 금액"
        suffix="원"
        stack-label
        input-class="text-right"
        @update:model-value="postForm.monthlyUsage = $func.formatCurrency($event)"
      )
        template(v-slot:prepend)
          q-icon(name="supervisor_account")

      .q-mt-lg.q-gutter-sm
      .row.justify-between
        q-btn(type="reset" label="초기화" color="info" :disable="stateReset")
        q-btn(type="submit" label="계산하기" color="primary" :disable="!stateCalculate")

      q-separator.q-mt-md.q-mb-md
      //- 계산된 피킹률
      q-card(class="my-card text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)")
        q-card-section(v-if="!pickingRate")
          div 피킹률을 계산해 주세요.
        q-card-section(v-else)
          div 피킹률 : {{ pickingRate }} %
          div.text-h6 {{ resultMessage }}

pop-check-benefit(
  :visible="visibleBenefit"
  :data="benefitData"
  @handleSubmit="handleMonthlyBenefit"
  @close="visibleBenefit = false"
)
</template>

<script>
import api from 'src/api/cards'

import popCheckBenefit from './_popups/checkBenefit.vue'

const defaultform = {
  brand: null,
  card: '',
  annualFee: null,
  monthlyBenefit: '',
  monthlyUsage: '',
  minUsage: null,
}

export default {
  name: 'IndexPage',
  components: {
    popCheckBenefit,
  },

  watch: {
    'postForm.brand': {
      handler(newVal, oldVal) {
        if (oldVal && newVal !== oldVal) {
          this.postForm.card = ''
        }
      },
      // immediate: true,
    },
    'postForm.card': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.postForm.annualFee = null
        }
      },
      // immediate: true,
    },
  },
  computed: {
    stateBenefit() {
      return this.postForm.brand && this.postForm.card && this.postForm.annualFee
    },
    stateCalculate() {
      return Object.values(this.postForm).every(item => item) && this.postForm.monthlyUsage !== '0'
    },
    stateReset() {
      return Object.values(this.postForm).every(item => !item)
    },
  },
  created() {
    this.fetchData()
  },
  data() {
    return {
      // --------------------
      pickingRate: 0,
      resultMessage: '',

      // 혜택팝업
      benefitData: {},
      visibleBenefit: false,

      //
      postForm: { ...defaultform },

      // 데이터
      brands: [],
      cards: [],
      annualFees: [],
    }
  },
  methods: {
    // new

    async fetchData() {
      try {
        const { data } = await api.getBrands()
        this.brands = data.sort((a, b) => a.seq - b.seq)
        // this.brands = data
      } catch (error) {
        this.$q.notify({
          color: 'negative',
          message: '데이터를 불러오는 중 오류가 발생했습니다.',
          position: 'top',
        })
      }
    },
    handleCards(val) {
      this.cards = this.brands.find(item => item.code === val).cards
    },
    handleAnnualFee(val) {
      const annualFees = this.cards.find(item => item.code === val.code).annualFee
      this.annualFees = annualFees.map(item => ({
        label: `${item.label} (${this.$func.formatCurrency(item.value)} 원)`,
        value: item.value,
      }))
      this.postForm.minUsage = this.remakeCurrency(this.cards.find(item => item.code === val.code).minUsage * 1000)
    },
    handleBenefit() {
      console.log('handleBenefit', this.cards[0])
      console.log('handleBenefit', this.postForm.card)

      // 1️⃣ 특정 카드 찾기
      const card = this.cards.find(item => item.code === this.postForm.card.code)

      console.log(card)

      // 2️⃣ 카드가 존재하지 않으면 실행 중단
      if (!card) {
        console.warn(`⚠️ 해당 코드(${this.postForm.card})를 가진 카드를 찾을 수 없습니다.`)
        this.benefitData = []
        return
      }

      // 3️⃣ benefit 변환 적용
      this.benefitData = card.benefit || [] // `undefined` 방지
      console.log(this.benefitData)

      // 4️⃣ 모달(또는 UI) 활성화
      this.visibleBenefit = true
    },
    handleMonthlyBenefit(val) {
      this.postForm.monthlyBenefit = val
    },
    handleReset() {
      this.postForm = { ...defaultform }
      this.cards = []
      this.annualFees = []
    },
    handleCalculate() {
      // (월 혜택금액 - (연회비 ÷ 12)) ÷ 월 사용 금액 ✕ 100
      const annualFee = parseFloat(this.postForm.annualFee) || 0
      const monthlyBenefit = parseFloat(this.postForm.monthlyBenefit?.replace(/,/g, '') || 0)
      const monthlyUsage = parseFloat(this.postForm.monthlyUsage?.replace(/,/g, '') || 0)

      if (monthlyUsage > 0) {
        const pickingRate = ((monthlyBenefit - annualFee / 12) / monthlyUsage) * 100
        this.pickingRate = pickingRate.toFixed(2)

        if (pickingRate < 2) {
          this.resultMessage = '혜택이 적어 해지 고려 가능'
        } else if (pickingRate < 5) {
          this.resultMessage = '평균적인 수준'
        } else {
          this.resultMessage = '혜택이 탁월한 카드'
        }
      }
    },

    remakeCurrency(value) {
      if (!value) return '0'
      return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
  },
}
</script>
