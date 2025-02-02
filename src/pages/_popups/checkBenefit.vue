<template lang="pug">
q-dialog(:model-value="visible" ref="dialogRef" @hide="$emit('close')")
  q-card(:style="{ width: options.width }")
    q-card-section(class="row items-center q-pb-none")
      div.text-h6 {{ options.title }}
      q-space
      q-btn(icon="close" flat round dense v-close-popup)
    q-card-section
      q-form(
        ref="postForm"
        :model="postForm"
        class="q-gutter-sx"
      )
        dl(
          v-for="(item, key) in data"
          :key="key"
        )
          dt {{ item.label }} ({{ item.value.toLocaleString() }}원)
          dd.q-gutter-sm
            q-radio(
              v-model="postForm[key]"
              :val='0'
              label="미적용"
            )
            q-radio(
              v-model="postForm[key]"
              :val="item.value"
              label="적용"
            )
    q-card-section.q-pt-none
      q-input(
        v-model="totalAmount"
        readonly
        label="총 금액"
      )

    q-card-section.row.justify-center.q-pt-none.q-gutter-sm
      q-btn(label="모두 선택" color="primary" @click="handleAllSelect")
      q-btn(label="적용" color="primary" @click="handleSubmit")
      q-btn(label="닫기" color="primary" v-close-popup)

    //- 네이버 현대카드
      el-form-item(label="네이버플러스 멤버십 무료 제공(4,900원)")
        el-radio-group(v-model="postForm.benefit_01")
          el-radio(value="0" label="미적용") 미적용
          el-radio(value="1" label="적용") 적용
      el-form-item(label="네이버플러스 가맹점 구매(최대 20만원 구매 금액까지 적용)(10,000원)")
        el-radio-group(v-model="postForm.benefit_02")
          el-radio(value="0" label="미적용") 미적용
          el-radio(value="1" label="적용") 적용
      el-form-item(label="넷플릭스 무료 제공(5,500원)")
        el-radio-group(v-model="postForm.benefit_03")
          el-radio(value="0" label="미적용") 미적용
          el-radio(value="1" label="적용") 적용
      el-form-item(label="총 금액")
        el-input(v-model="postForm.totalAmount" readonly)

  q-dialog(
    v-model="visibleAlert"
    type="warning"
    dense
    class="q-mt-md"
    @ok="visibleAlert = false"
  )
    q-card(style="min-width: 350px")
      q-card-section
        div.text-h6 경고
      q-card-section.q-pt-none
        div 정보를 모두 입력해 주세요.

      q-card-actions(align="right")
        //- q-btn(label="확인" color="primary" @click="visibleAlert = false")
        q-btn(flat label="확인" color="primary" v-close-popup)
</template>

<script>
// import PopUp from '@/components/PopUp/index.vue'

const defaultForm = {
  ben_01: 0,
}
export default {
  components: {
    // PopUp,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.setBenefitData()
        }
      },
      immediate: true,
    },
    postForm: {
      // immediate: true,
      handler(val) {
        if (val) {
          this.handleTotalAmount()
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      options: {
        title: '혜택금액 확인',
        width: '400px',
      },

      postForm: this.$_.cloneDeep(defaultForm),

      totalAmount: null,
      benefitData: {},

      // alert
      visibleAlert: false,
    }
  },
  methods: {
    setBenefitData() {
      this.postForm = Object.keys(this.data).reduce((acc, cur) => {
        acc[cur] = null
        return acc
      }, {})
    },
    handleAllSelect() {
      Object.keys(this.data).forEach(key => {
        this.postForm[key] = this.data[key].value
      })
    },
    handleTotalAmount() {
      let totalAmount = Object.values(this.postForm).reduce((acc, cur) => acc + cur, 0)
      this.totalAmount = totalAmount.toLocaleString()
    },
    handleSubmit() {
      if (Object.values(this.postForm).includes(null)) {
        this.visibleAlert = true
        return
      }
      this.$emit('handleSubmit', this.totalAmount)
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
/*  */
</style>
