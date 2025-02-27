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
        :rows="brands"
        :columns="columns"
        row-key="no"
        data-testid="row"
        :rows-per-page-options="[0]"
        @row-click="rowClick"
      />
      <div class="q-mt-sm">
        <q-btn @click="handleSubmit" label="저장" color="primary" />
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
      brands: [],
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
          name: 'code',
          label: '코드',
          field: 'code',
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
      const res = await api.getBrands()
      if (res.status !== 200) return

      this.brands = res.data
        .sort((a, b) => a.no - b.no)
        .map(item => ({
          no: item.no,
          code: item.code,
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
      this.brands.splice(offset + to - 1, 0, this.brands.splice(offset + from - 1, 1)[0])
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
      const list = this.brands.map((brand, index) => ({
        code: brand.code,
        no: index + 1,
      }))

      try {
        await api.updateBrandNo(list)
      } catch (error) {
        console.error(error)
      }
      await this.fetchData()

      this.$q.notify({
        color: 'positive',
        message: '브랜드 순서가 성공적으로 업데이트되었습니다.',
        position: 'top',
      })
    },
    rowClick(event, row) {
      console.log('rowClick', row.code)
      this.$router.push({ name: 'SortCardList', params: { code: row.code } })
    },
  },
}
</script>
