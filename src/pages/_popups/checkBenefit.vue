<template lang="pug">
q-dialog(:model-value="visible" ref="dialogRef" @hide="$emit('close')")
  q-card(:style="{ width: options.width }")
    q-card-section.dialog-header
      //- .header-inner
      div.text-h6 {{ options.title }}
      q-btn(
        label="모두 선택"
        color="white"
        text-color="black"
        glossy
        size="sm"
        class="q-pr-sm q-pl-sm"
        @click="handleAllSelect"
      )
      q-btn.close(icon="close" flat round dense v-close-popup)

    q-card-section(style="max-height: 50vh" class="scroll")
      q-form(
        ref="postForm"
        :model="postForm"
        class="q-gutter-sx"
      )
        dl.item(
          v-for="(item, index) in data"
          :key="index"
        )
          dt [{{ index }}] {{ item.label }}
          dd ({{ item.value.toLocaleString() }}원)
          dd.q-gutter-sm
            q-radio(
              v-model="postForm[index]"
              label="미적용"
              :val='0'
            )
            q-radio(
              v-model="postForm[index]"
              label="적용"
              :val="item.value"
            )

    q-card-section.dialog-footer
      .row.items-center.justify-between
        .total-amount
          strong 총 혜택금액 :
          span {{ totalAmount }}

        q-btn(
          label="적용"
          color="primary"
          glossy
          @click="handleSubmit"
        )


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

</template>

<script>
// import PopUp from '@/components/PopUp/index.vue'

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
        width: '450px',
      },

      // postForm: this.$_.cloneDeep(defaultForm),
      postForm: {},

      totalAmount: null,
      benefitData: {},
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
        this.$q.dialog({
          title: '경고',
          message: '정보를 모두 입력해 주세요.',
          ok: '확인',
        })
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
.item {
  position: relative;
  &:not(:first-child) {
    margin-top: 5px;
    padding-top: 5px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-image: linear-gradient(to right, $dark 50%, transparent 50%);
      background-size: 7px 1px;
    }
  }
}
.total-amount {
  text-align: right;
  strong {
    margin-right: 10px;
  }
}

.total-amount::after {
  margin-left: 3px;
  content: '원'; /* Add currency symbol if needed */
}
</style>
