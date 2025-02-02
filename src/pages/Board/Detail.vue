<template lang="pug">
q-page(style="padding-top: 50px")
  q-page-sticky(position="top" expand class="bg-primary text-white")
    q-toolbar
      q-toolbar-title Default Board Detail

  div.q-pa-md
    //- 게시물 추가/수정 폼
    .row
      .col {{ form.title }}
      .col {{ $formatDate(form.date) }}
    .row
      .col {{ form.content }}

  div(class="q-pa-md q-gutter-sm")
    q-btn(@click="handleList" color="primary" label="목록")
    q-btn(@click="handleDelete" color="red" label="삭제")
</template>

<script>
import { getPostById, deletePost } from 'src/api/posts'

export default {
  name: 'IndexPage',
  components: {
    //
  },
  watch: {
    '$route.query': {
      immediate: true,
      handler(val) {
        if (val) {
          console.log('val:', val)
        }
      },
    },
  },

  created() {},
  mounted() {
    this.id = this.$route.params.id
    if (this.id) {
      this.fetchPost()
    } else {
      return
    }
  },
  data() {
    return {
      // --------------------
      id: null,
      posts: [], // 게시물 목록
      form: {
        id: null, // 수정 시 사용
        title: '',
        content: '',
      },
    }
  },
  methods: {
    // 서버에서 게시물 가져오기
    async fetchPost() {
      try {
        const { data } = await getPostById(this.id)
        // this.form = JSON.stringify(data, 0, 2)
        // this.form = data
        this.form = this.$_.cloneDeep(data)
      } catch (error) {
        console.error(error)
      }
    },

    async deletePost() {
      try {
        await deletePost(this.id)
      } catch (error) {
        console.error(error)
      }
    },

    // 게시물 삭제
    async handleDelete() {
      console.log('handleDelete')
      // alert
      this.$q
        .dialog({
          title: '게시물 삭제',
          message: '정말 삭제하시겠습니까?',
          ok: {
            label: '삭제',
            color: 'red',
          },
          cancel: {
            label: '취소',
            color: 'primary',
          },
        })
        .onOk(() => {
          this.deletePost()
          this.handleList()
        })
    },

    handleList() {
      console.log('handleList')
      this.$router.push({ name: 'BoardList' })
    },
  },
}
</script>
