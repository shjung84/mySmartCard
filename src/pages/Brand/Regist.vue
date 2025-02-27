<template lang="pug">
q-page
  h3.text-h4 카드회사: {{ brand.label }} ({{ brand.code }})
  q-separator.q-mb-md

  q-form(
    ref="postForm"
    :model="postForm"
    class="q-gutter-sx"
    @submit="handleSubmit"
  )
    .row.items-center.justify-between
      strong Total : {{ postForm.cards.length }}
      q-btn(label="새 카드 추가" color="secondary" glossy @click="handleAddCard")

    .row.items-start.q-gutter-md
      q-card.my-card(v-for="(card, index) in postForm.cards" :key="index")
        q-card-section
          .relative-position
            q-chip(color="primary" text-color="white" square) no :  {{ card.no }}
            q-btn.absolute-top-right(
              v-if="postForm.cards.length > 1 && index > 0"
              icon="delete"
              color="negative"
              size="sm"
              round
              glossy
              @click="handleRemoveCard(index)"
            )
          .row
            q-input.col-6(v-model="card.code" type="number" label="카드코드" stack-label)
            .col-6
              q-select(
                v-model="card.category"
                label="분류"
                :options="categories"
                option-value="value"
                option-label="label"
                stack-label
                emit-value
                map-options
              )
          q-input(v-model="card.label" label="카드명" stack-label)
          q-input(
            v-model="card.minUsage"
            label="전월실적"
            suffix="만원"
            stack-label
            input-class="text-right"
            @update:model-value="card.minUsage = $func.formatCurrency($event)"
          )

          //- 타입
          q-card.q-mt-sm
            q-card-section.q-pb-none
              .row.wrap.justify-between.items-center
                .text-h6 연회비
                q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem(index, 'annualFee')")
            q-card-section.q-pt-none
              q-list
                q-item(v-for="(item, aIndex) in card.annualFee" :key="aIndex" class="row items-end q-pa-none")
                  q-select.col-5(
                    v-model="item.label"
                    label="타입명"
                    stack-label
                    :options="annualFeeOptions"
                  )
                  q-input.col-5(
                    v-model="item.value"
                    label="금액"
                    suffix="원"
                    stack-label
                    input-class="text-right"
                    @update:model-value="item.value = $func.formatCurrency($event)"
                  )
                  .col-2.flex.justify-end
                    q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem(index, 'annualFee', aIndex)")
          //- 조건
          q-card.q-mt-sm
            q-card-section.q-pb-none
              .row.wrap.justify-between.items-center
                .text-h6 조건
                q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem(index, 'condition')")
            q-card-section.q-pt-none
              q-list
                q-item(v-for="(item, cIndex) in card.condition" :key="cIndex" class="row items-end q-pa-none")
                  q-input.col-5(v-model="item.label" label="조건명" stack-label)
                  q-input.col-5(
                    v-model="item.value"
                    label="금액"
                    suffix="원"
                    stack-label
                    input-class="text-right"
                    @update:model-value="item.value = $func.formatCurrency($event)"
                  )
                  .col-2.flex.justify-end
                    q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem(index, 'condition', cIndex)")

          //- 혜택
          q-card.q-mt-sm
            q-card-section.q-pb-none
              .row.wrap.justify-between.items-center
                .text-h6 혜택
                q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem(index, 'benefit')")
            q-card-section.q-pt-none
              q-list
                q-item(v-for="(item, bIndex) in card.benefit" :key="bIndex" class="row items-end q-pa-none")
                  q-input.col-5(v-model="item.label" label="혜택명" stack-label)
                  q-input.col-5(
                    v-model="item.value"
                    label="금액"
                    suffix="원"
                    stack-label
                    input-class="text-right"
                    @update:model-value="item.value = $func.formatCurrency($event)"
                  )
                  .col-2.flex.justify-end
                    q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem(index, 'benefit', bIndex)")

    .btns.bottom.btn-between.q-mt-sm
      q-btn(label="목록" color="primary" glossy @click="$router.push({ name: 'BrandList' })")
      q-btn(type="submit" label="저장" color="primary" glossy)
</template>

<script>
import api from 'src/api/cards'
import categories from 'src/api/categories'

const defaultCard = () => ({
  id: null,
  code: null,
  label: '',
  no: 1,
  minUsage: null,
  annualFee: [],
  condition: [],
  benefit: [],
})

export default {
  name: 'BrandRegist',
  components: {},

  mounted() {
    // this.fetchData()
  },
  created() {
    this.fetchData()
  },
  data() {
    return {
      brand: [], // 선택할 카드회사 목록
      no: 1,
      postForm: {
        cards: [],
      },
      annualFeeOptions: ['국내 전용', '해외 겸용'],
      categories: categories,
    }
  },
  methods: {
    async fetchData() {
      const res = await api.getBrandByCode(this.$route.params.id)
      if (res.data.length === 0) {
        alert('해당 카드회사를 찾을 수 없습니다.')
        return
      }
      this.brand = res.data
      this.no = this.brand.cards.length + 1

      if (!this.postForm.cards || this.postForm.cards.length === 0) {
        this.handleAddCard()
      }
    },
    handleAddCard() {
      const newCard = defaultCard()
      newCard.no = this.no++
      this.postForm.cards.push(newCard)
    },
    handleRemoveCard(index) {
      if (this.postForm.cards.length > 1) this.postForm.cards.splice(index, 1)
    },
    handleAddItem(key) {
      this.postForm.cards[0][key].push({ value: '', label: '' })
    },
    handleRemoveItem(cardIndex, key, itemIndex) {
      this.postForm.cards[cardIndex][key].splice(itemIndex, 1)
    },

    normalize() {
      const result = this.postForm.cards
      // parseCurrency로 변환
      result.forEach(cards => {
        cards.id = this.brand.code + '_' + cards.code
        cards.minUsage = this.$func.parseCurrency(cards.minUsage)
        cards.annualFee.forEach(item => {
          item.value = this.$func.parseCurrency(item.value)
        })
        cards.condition.forEach(item => {
          item.value = this.$func.parseCurrency(item.value)
        })
        cards.benefit.forEach(item => {
          item.value = this.$func.parseCurrency(item.value)
        })
      })
      return result
    },
    async handleSubmit() {
      await api.addCardsToBrand(this.brand.id, this.normalize())
      this.$q.dialog({
        message: '새로운 카드가 추가되었습니다.',
        color: 'positive',
        position: 'top',
      })
      this.$router.push({ name: 'BrandList' })
    },
  },
}
</script>

<style lang="scss" scoped>
.q-card.my-card {
  width: 400px;
  border: 1px solid $dark;
}
</style>
