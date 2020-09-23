<template>
  <branch-form title="Add Branch" />
</template>

<script>
import BranchForm from '@/components/branch/form'
export default {
  name: 'Add',
  middleware: 'isAdmin',
  components: { BranchForm }
}
</script>

<style scoped></style>
