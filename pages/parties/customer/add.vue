<template>
  <PartyForm title="Add Customer" route="/customer/" />
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
