<template lang="pug">
q-dialog(:model-value="visible" ref="dialogRef" @hide="$emit('close')")
  q-card(:style="{ width: options.width }")
    q-card-section(class="row items-center q-pb-none")
      div.text-h6 {{ options.title }} [ No : {{ postForm.no }} ]
      q-space
      q-btn(icon="close" flat round dense v-close-popup)
    q-card-section
      q-form(
        ref="postForm"
        :model="postForm"
        class="q-gutter-sx"
      )
      q-card-section.q-pt-none
        q-input(
          v-model="postForm.code"
          :readonly="isEdit"
          label="카드회사 코드"
        )
        q-input(
          v-model="postForm.label"
          label="카드회사 이름"
        )
    q-card-section.row.justify-center.q-pt-none.q-gutter-sm
      q-btn(label="저장" color="primary" @click="saveBrand")
      q-btn(label="닫기" color="primary" v-close-popup)
</template>

<script>
import api from 'src/api/cards'

const defaultForm = {
  label: null,
  code: null,
  no: null,
  cards: [],
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
    brands: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    no: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          console.log(this.no)
          if (!this.isEdit) {
            this.postForm.no = this.no
            console.log('isEdit', this.isEdit)
          } else {
            console.log('isEdit', this.isEdit)
          }
        } else {
          this.postForm = this.$_.cloneDeep(defaultForm)
        }
      },
      immediate: true,
    },
    isEdit: {
      handler(val) {
        if (val) {
          this.options.title = '카드회사 수정'
          this.postForm = {
            label: this.data.label,
            code: this.data.code,
            no: this.data.no,
          }
          console.log(this.postForm.no)
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      options: {
        title: '카드회사 추가',
        width: '450px',
      },
      postForm: this.$_.cloneDeep(defaultForm),
    }
  },
  methods: {
    async saveBrand() {
      if (Object.values(this.postForm).includes(null)) {
        this.$q.dialog({
          title: '경고',
          message: '정보를 모두 입력해 주세요.',
          ok: '확인',
        })
        return
      }

      // 중복검사
      if (!this.isEdit) {
        if (this.brands.some(c => c.code === this.postForm.code)) {
          return alert('코드 중복')
        }
      }
      if (this.brands.some(c => c.label === this.postForm.label)) {
        return alert('이름 중복')
      }
      if (!this.isEdit) {
        await api.createBrand(this.postForm)
      } else {
        await api.updateBrand(this.postForm.code, this.postForm.label)
        this.$q.dialog({
          message: '수정되었습니다.',
          color: 'positive',
          position: 'top',
        })
      }
      this.$emit('close')
      this.$emit('refresh')
    },
  },
}
</script>

<style lang="scss" scoped>
/*  */
</style>
