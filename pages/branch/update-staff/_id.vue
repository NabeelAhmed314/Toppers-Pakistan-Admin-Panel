<template>
  <edit-manager :user="user" />
</template>

<script>
import EditManager from '@/components/branch/edit-manager'
export default {
  name: 'Id',
  components: { EditManager },
  async asyncData({ $axios, route }) {
    return {
      user: await $axios.$get('user/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
