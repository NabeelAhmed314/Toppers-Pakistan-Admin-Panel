<template>
  <Main />
</template>

<script>
import Main from '@/components/branch/main'
export default {
  name: 'Index',
  components: { Main },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
