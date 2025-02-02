<template lang="pug">
q-page(style="padding-top: 50px")
  q-page-sticky(position="top" expand class="bg-primary text-white")
    q-toolbar
      q-toolbar-title Default Board

  div.q-pa-md
    //- 게시물 목록
    q-table(
      :rows="posts"
      :columns="columns"
      row-key="id"
      flat
      bordered
    )
      //- template(v-slot:body-cell-actions="props")
      template(v-slot:body-cell-title="props")
        q-td(:props="props")
          a(href="javascript:;" @click="handleDetail(props.row)") {{ props.row.title }}
      template(v-slot:body-cell-date="props")
        q-td(:props="props")
          p {{ $formatDate(form.date) }}
    //- q-td
      q-btn(color="primary" size="sm" @click="editPost(props.row)") 수정
      q-btn(color="negative" size="sm" @click="deletePost(props.row.id)") 삭제

    .q-gutter-sm
      //- q-btn(type="reset" label="목록" color="primary" @click="handleList")
      q-btn( @click="handleRegist" label="등록" color="primary")




</template>

<script>
// import { toRaw } from 'vue'
// import cardCompanies from 'src/data/cardLists'

import { getPosts } from 'src/api/posts'

export default {
  name: 'IndexPage',
  components: {
    //
  },

  watch: {
    //
  },
  computed: {
    // c
  },
  filters: {
    // c
  },
  created() {
    this.fetchPost() // 컴포넌트가 로드되면 게시물 가져오기
  },
  data() {
    return {
      // --------------------
      posts: [], // 게시물 목록
      form: {
        id: null, // 수정 시 사용
        title: '',
        content: '',
      },
      columns: [
        {
          name: 'id',
          label: 'ID',
          field: 'id',
          align: 'center',
          style: 'width: 200px',
        },
        {
          name: 'title',
          label: '제목',
          field: 'title',
          align: 'left',
        },
        {
          name: 'date',
          label: '날짜',
          field: 'date',
          align: 'center',
          style: 'width: 200px',
        },
      ],
    }
  },
  methods: {
    handleRegist() {
      this.$router.push({ name: 'BoardRegist' })
    },
    handleDetail(val) {
      console.log('handleDetail:', val)
      this.$router.push({ name: 'BoardDetail', params: { id: val.id } })
    },
    // 서버에서 게시물 가져오기
    async fetchPost() {
      try {
        const { data } = await getPosts()
        this.posts = data
        console.log('fetchPost:', data)
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
