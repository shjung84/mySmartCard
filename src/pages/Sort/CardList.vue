<template>
  <q-page>
    <div class="q-pa-md">
      <q-table
        v-draggable-table="{
          options: {
            mode: 'row',
            onlyBody: true,
          },
          onDrop: onDropRow,
          onDrag,
          onShadowMove,
          onOut,
        }"
        :rows="cards"
        :columns="columns"
        row-key="no"
        data-testid="row"
      />
      <div class="row justify-between q-mt-sm">
        <q-btn @click="handleSubmit" label="저장" color="primary" />
        <!-- 목록 -->
        <q-btn @click="handleList" label="목록" color="primary" />
      </div>
    </div>
  </q-page>
</template>

<script>
import api from 'src/api/cards'

export default {
  name: 'BrandListSort',
  components: {},
  watch: {},
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      // list
      code: this.$route.params.code,
      cards: [],
      columns: [
        {
          name: 'no',
          label: '순서',
          field: 'no',
          align: 'left',
          sortable: true,
          style: 'width: 50px',
        },
        {
          name: 'value',
          label: 'Value',
          field: 'value',
          align: 'left',
          style: 'width: 250px',
        },
        {
          name: 'label',
          label: '이름',
          field: 'label',
          align: 'left',
        },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
    }
  },
  methods: {
    refresh() {
      this.fetchData()
    },
    async fetchData() {
      const res = await api.getBrandByCode(this.code)
      if (res.status !== 200) return

      this.cards = res.data[0].cards
        .sort((a, b) => a.no - b.no)
        .map(item => ({
          no: item.no,
          value: item.value,
          label: item.label,
        }))
    },

    onDrop(from, to, table, mode) {
      if (mode === 'column') {
        this.onDropColumn(from, to)
      } else {
        this.onDropRow(from, to)
      }
    },
    onDropColumn(from, to) {
      this.columns.splice(to, 0, this.columns.splice(from, 1)[0])
    },
    onDropRow(from, to) {
      const offset = (this.pagination.page - 1) * this.pagination.rowsPerPage
      this.cards.splice(offset + to - 1, 0, this.cards.splice(offset + from - 1, 1)[0])
    },
    onDrag(...params) {
      // console.log('onDrag', params)
    },
    onShadowMove(...params) {
      // console.log('onShadowMove', params)
    },
    onOut(...params) {
      // console.log('onOut', params)
    },
    async handleSubmit() {
      const list = this.cards.map((card, index) => ({
        value: card.value,
        no: index + 1,
      }))

      try {
        await api.updateCardNo(this.code, list)
      } catch (error) {
        console.error(error)
      }
      await this.fetchData()

      this.$q.notify({
        color: 'positive',
        message: '카드 순서가 성공적으로 업데이트되었습니다.',
        position: 'top',
      })
    },
    handleList() {
      this.$router.push({ name: 'SortBrandList' })
    },
  },
}
</script>
