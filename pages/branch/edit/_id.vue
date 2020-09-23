<template>
  <BranchForm is-update title="Update Branch" :branch="branch" />
</template>

<script>
import BranchForm from '@/components/branch/form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { BranchForm },
  async asyncData({ $axios, route }) {
    return {
      branch: await $axios.$get('branch/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
