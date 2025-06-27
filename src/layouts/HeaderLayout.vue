<template lang="pug">
  q-toolbar
    q-toolbar-title(style="height: 70px;")
      h1 My Smart Credit Card
      //- login 페이지로 이동
      q-btn.login(flat @click="$router.push({ name: 'Login' })" round dense icon="login")
    q-btn(flat @click="$emit('onToggleDrawer')" round dense icon="menu")
  q-toolbar-title.sub-title
    h2.text-h4 {{ title }}
</template>

<script>
export default {
  name: 'HeaderLayout',
  emits: ['onToggleDrawer'],
  computed: {
    title() {
      return this.$route.meta.title
    },
  },
  data() {
    return {
      //
    }
  },
}
</script>

<style lang="scss" scoped>
h1,
h2 {
  margin: 0;
}
.sub-title {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: $primary;
}
.login {
  position: absolute;
  top: 50%;
  right: 80px;
  transform: translateY(-50%);
}
</style>
