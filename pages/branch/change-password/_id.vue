<template>
  <change-password :id="id" />
</template>

<script>
import ChangePassword from '@/components/branch/change-password'
export default {
  name: 'Id',
  components: { ChangePassword },
  asyncData({ route }) {
    return {
      id: route.params.id
    }
  }
}
</script>

<style scoped></style>
