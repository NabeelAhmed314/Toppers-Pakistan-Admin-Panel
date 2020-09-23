<template>
  <PartyForm title="Add Supplier" route="/supplier/" is-supplier />
</template>

<script>
import PartyForm from '@/components/parties/form'
export default {
  name: 'Add',
  components: { PartyForm },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
