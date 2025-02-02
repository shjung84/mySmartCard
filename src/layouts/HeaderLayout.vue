<template lang="pug">
  q-toolbar
    q-toolbar-title Header
    q-btn(flat @click="$emit('onToggleDrawer')" round dense icon="menu")
</template>

<script>
export default {
  name: 'HeaderLayout',
  emits: ['onToggleDrawer'],
  data() {
    return {
      //d
    }
  },
  methods: {
    //
  },
}
</script>
