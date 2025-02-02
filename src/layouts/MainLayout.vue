<template lang="pug">
  q-layout(
    view="lHh Lpr lff"
    class="shadow-2 rounded-borders"
  )
    q-header(elevated class="bg-cyan-8")
      HeaderLayout(@onToggleDrawer="toggleDrawer")

    LnbLayout(v-model="drawer")

    q-page-container
      router-view
</template>

<script>
import HeaderLayout from './HeaderLayout.vue'
import LnbLayout from './LnbLayout.vue'

export default {
  name: 'MainLayout',
  components: {
    HeaderLayout,
    LnbLayout,
  },
  data() {
    return {
      drawer: false,
      // leftDrawerOpen: true,
    }
  },
  methods: {
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
}
</script>
