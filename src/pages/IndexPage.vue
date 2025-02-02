<template lang="pug">
q-page(style="padding-top: 50px")
  q-page-sticky(position="top" expand class="bg-primary text-white")
    q-toolbar
      q-toolbar-title Picking


  q-separator
  div.q-pa-md(style="max-width: 500px")
    q-form(:model="postForm" @submit="handleCalculate" @reset="handleReset" class="q-gutter-xs")
      q-select(
        v-model="postForm.company"
        label="카드사 선택"
        stack-label
        :options="cardCompanies"
        option-value="code"
        option-label="label"
        emit-value
        map-options
        @update:model-value="handleCards"
      )
        template(v-slot:prepend)
          q-icon(name="business")

      //- 카드 선택
      q-select(
        v-model="postForm.card"
        label="카드 선택"
        stack-label
        :options="cards"
        option-value="value"
        option-label="label"
        emit-value
        map-options
        @update:model-value="handleType"
      )
        template(v-slot:prepend)
          q-icon(name="credit_card")

      //- 연회비(카드 종류 국내, 해외)
      q-option-group(
        v-if="postForm.card"
        v-model="postForm.anualFee"
        type="radio"
        :options="cardTypes"
        option-value="value"
        option-label="label"
        stack-label
        inline
      )
        template(v-slot:label="opt")
          span {{ opt.label }} ({{ (opt.value).toLocaleString() }}원)

      //- 월 혜택 금액 (캐시백, 포인트)
      q-input(
        v-model="postForm.monthlyBenefit"
        label="월 혜택 금액"
        stack-label
        suffix="원"
        readonly
        input-class="text-right"
      )
        template(v-slot:prepend)
          q-icon(name="attach_money")
        template(v-slot:append)
          q-btn(
            class="glossy" round color="primary" icon="search"
            :disable="!stateBenefit"
            @click="handleBenefit"
          )

      //- 전월실절, 최소 사용 금액
      q-input(
        v-model="postForm.minimumUsage"
        label="전월실절, 최소 사용 금액"
        stack-label
        suffix="원"
        input-class="text-right"
        readonly
      )
        template(v-slot:prepend)
          q-icon(name="attach_money")

      //- 월 사용 금액
      q-input(
        v-model="postForm.monthlyUsage"
        label="월 사용 금액"
        stack-label
        suffix="원"
        input-class="text-right"
        @update:model-value="formatNumber"
      )
        template(v-slot:prepend)
          q-icon(name="attach_money")

      .q-mt-lg.q-gutter-sm
        q-btn(type="submit" label="계산하기" color="primary" :disable="!stateCalculate")
        q-btn(type="reset" label="초기화" color="primary")

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
  @handleSubmit="handleMomthlyBenefit"
  @close="visibleBenefit = false"
)
</template>

<script>
// import data from 'src/data/cardLists'
import data from 'src/api/cardLists'

import popCheckBenefit from './_popups/checkBenefit.vue'

const defaultform = {
  company: null,
  card: '',
  anualFee: null,
  monthlyBenefit: '',
  monthlyUsage: '',
  minimumUsage: '0',
}

export default {
  name: 'IndexPage',
  components: {
    popCheckBenefit,
  },

  watch: {
    'postForm.company': {
      handler(newVal) {
        if (newVal) {
          console.log(newVal)
        } else {
          this.handleReset()
        }
      },
      // immediate: true,
    },
    stateBenefit(newVal) {
      console.log('stateBenefit', newVal)
    },
  },
  computed: {
    stateBenefit() {
      return this.postForm.company && this.postForm.card && this.postForm.anualFee
    },
    stateCalculate() {
      return Object.values(this.postForm).every(item => item) && this.postForm.monthlyUsage !== '0'
    },
  },
  data() {
    return {
      // --------------------
      dense: false,
      pickingRate: 0,
      resultMessage: '',

      // 혜택팝업
      benefitData: {},
      visibleBenefit: false,

      //
      postForm: { ...defaultform },

      // 데이터
      cardCompanies: data,
      cards: [],
      cardData: {},
      cardTypes: [],
    }
  },

  methods: {
    handleCards(val) {
      this.cards = data.find(item => item.code === val).cards
    },
    handleType(val) {
      this.cardTypes = this.cards.find(item => item.value === val).type
    },
    handleBenefit() {
      this.benefitData = this.cards.find(item => item.value === this.postForm.card).benefit
      this.visibleBenefit = true
    },
    handleMomthlyBenefit(val) {
      this.postForm.monthlyBenefit = val
    },

    handleReset() {
      console.log('reset')
      this.postForm = { ...defaultform }
      this.cards = []
      this.types = []
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

    // 소수점
    formatNumber(value) {
      // 숫자만 남기기 (정수 및 소수점 허용)
      let numericValue = value.replace(/[^0-9.]/g, '')
      // 소수점이 여러 개 입력되지 않도록 제한
      let parts = numericValue.split('.')
      if (parts.length > 2) {
        numericValue = parts[0] + '.' + parts.slice(1).join('')
      }

      let formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.postForm.monthlyUsage = formattedValue
    },
  },
}
</script>
