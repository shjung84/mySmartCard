<template lang="pug">
q-page(style="padding-top: 50px")
  q-page-sticky(position="top" expand class="bg-primary text-white")
    q-toolbar
      q-toolbar-title Default Board

  div.q-pa-md
    //- 게시물 추가/수정 폼
    div.q-mt-lg
      q-form()
        q-input(v-model="form.title" label="제목" filled required class="q-mb-md")
        q-input(v-model="form.content" label="내용" filled required class="q-mb-md")
      .q-gutter-sm
        q-btn(type="reset" label="목록" color="primary" @click="handleList")
        q-btn(type="submit" label="저장" color="primary" @click="handleSubmit")
</template>

<script>
import { createPost } from 'src/api/posts'

export default {
  name: 'IndexPage',
  components: {},
  watch: {},
  computed: {},
  filters: {},
  created() {},
  data() {
    return {
      // --------------------
      posts: [], // 게시물 목록
      form: {
        title: '',
        content: '',
      },
    }
  },
  methods: {
    // 저장
    handleList() {
      this.$router.push({ name: 'BoardList' })
    },
    handleSubmit() {
      console.log('onSubmit:', this.form)
      try {
        createPost({
          ...this.form,
          date: new Date(),
        })
        this.handleList()
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
