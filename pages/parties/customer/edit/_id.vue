<template>
  <party-form
    title="Update Customer"
    :party="party"
    is-update
    route="customer/"
  />
</template>

<script>
import PartyForm from '@/components/parties/form'
export default {
  name: 'Id',
  middleware: 'isAdminOrManager',
  components: { PartyForm },
  async asyncData({ $axios, route }) {
    return {
      party: await $axios.$get('customer/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
