<template lang="pug">
q-dialog(:model-value="visible" ref="dialogRef" @hide="$emit('close')")
  q-card(:style="{ width: options.width }")
    q-card-section.dialog-header
      div.text-h5 {{ options.title }}
      q-btn(icon="close" flat round dense v-close-popup)

    q-card-section(style="max-height: 50vh" class="scroll")
      q-card.my-card.bg-secondary.text-white
        q-card-section.row.justify-between.items-center
          .text-h6 [{{ parent.code }}] {{ parent.label }}
          q-chip(color="primary" text-color="white" square) No. {{ postForm.no }}
      q-form(
        ref="postForm"
        :model="postForm"
        class="q-gutter-sx"
      )
        q-card.my-card.q-mt-md
          q-card-section.q-pt-none.q-pb-none
            .row
              q-input.col-6(v-model="postForm.code" stack-label label="카드코드")
              q-input.col-6(v-model="postForm.label" stack-label label="카드명")
            .row
              .col-6
                q-select(
                  v-model="postForm.category"
                  label="분류"
                  :options="categories"
                  option-value="value"
                  option-label="label"
                  stack-label
                  emit-value
                  map-options
                )
              q-input.col-6(
                v-model="postForm.minUsage"
                label="전월실적"
                suffix="만원"
                stack-label
                input-class="text-right"
                @update:model-value="postForm.minUsage = $func.formatCurrency($event)"
              )

        //- 연회비
        q-card.q-mt-sm
          q-card-section.q-pb-none
            .row.wrap.justify-between.items-center
              .text-h6 연회비
              q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem('annualFee')")
          q-card-section.q-pt-none
            q-list
              q-item(v-for="(item, tIndex) in postForm.annualFee" :key="tIndex" class="row items-end q-pa-none")
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
                  q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem('annualFee', tIndex)")

        //- 조건
        q-card.q-mt-sm
          q-card-section.q-pb-none
            .row.wrap.justify-between.items-center
              .text-h6 조건
              q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem('condition')")
          q-card-section.q-pt-none
            q-list
              q-item(v-for="(item, cIndex) in postForm.condition" :key="cIndex" class="row items-end q-pa-none")
                q-input.col-5(v-model="item.label" label="조건명")
                q-input.col-5(
                  v-model="item.value"
                  label="금액"
                  suffix="원"
                  stack-label
                  input-class="text-right"
                  @update:model-value="item.value = $func.formatCurrency($event)"
                )
                .col-2.flex.justify-end
                  q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem('condition', cIndex)")

        //- 혜택
        q-card.q-mt-sm
          q-card-section.q-pb-none
            .row.wrap.justify-between.items-center
              .text-h6 혜택
              q-btn(icon="add" color="amber" size="sm" text-color="black" round glossy @click="handleAddItem( 'benefit')")
          q-card-section.q-pt-none
            q-list
              q-item(v-for="(item, bIndex) in postForm.benefit" :key="bIndex" class="row items-end q-pa-none")
                q-input.col-5(v-model="item.label" label="혜택명")
                q-input.col-5(
                  v-model="item.value"
                  label="금액"
                  suffix="원"
                  stack-label
                  input-class="text-right"
                  @update:model-value="item.value = $func.formatCurrency($event)"
                )
                .col-2.flex.justify-end
                  q-btn(icon="delete" color="negative" size="sm" round glossy @click="handleRemoveItem('benefit', bIndex)")

    q-card-section.dialog-footer
      .btns
        q-btn(label="닫기" color="white" text-color="black" v-close-popup)
        q-btn(label="저장" color="primary" @click="handleSubmit")
</template>

<script>
import api from 'src/api/cards'
import categories from 'src/api/categories'

const defaultForm = {
  id: null,
  code: null,
  label: null,
  minUsage: null,
  annualFee: [],
  condition: [],
  benefit: [],
}

const defaultCard = () => ({
  value: null,
  label: '',
  minUsage: null,
  annualFee: [],
  condition: [],
  benefit: [],
})

export default {
  components: {
    // PopUp,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.initCurrent(this.data)
        }
      },
      immediate: true,
    },
  },
  computed: {},
  data() {
    return {
      options: {
        title: '카드 정보 수정',
        width: '500px',
      },

      postForm: { ...defaultForm },
      currency: {},
      annualFeeOptions: ['국내 전용', '해외 겸용'],
      categories: categories,

      cards: [],
      // cards: [defaultCard()],
    }
  },
  methods: {
    initCurrent(val) {
      this.postForm = this.$_.cloneDeep(val)
      this.postForm.annualFee.forEach(item => {
        item.value = this.$func.formatCurrency(item.value)
      })
      this.postForm.condition.forEach(item => {
        item.value = this.$func.formatCurrency(item.value)
      })
      this.postForm.benefit.forEach(item => {
        item.value = this.$func.formatCurrency(item.value)
      })
    },

    handleAddItem(key) {
      this.postForm[key].push({ value: null, label: '' })
    },
    handleRemoveItem(key, itemIndex) {
      // corrected this line to use postForm
      this.postForm[key].splice(itemIndex, 1)
    },

    normalize() {
      const cards = this.$_.cloneDeep(this.postForm)
      cards.annualFee.forEach(item => {
        item.value = this.$func.parseCurrency(item.value)
      })
      cards.condition.forEach(item => {
        item.value = this.$func.parseCurrency(item.value)
      })
      cards.benefit.forEach(item => {
        item.value = this.$func.parseCurrency(item.value)
      })
      return cards
    },

    async handleSubmit() {
      await api.updateCards(this.parent.id, this.postForm.id, this.normalize())
      this.$q.notify({
        message: '수정되었습니다.',
        color: 'secondary',
      })

      this.$emit('close')
      this.$emit('refresh')
    },
  },
}
</script>
