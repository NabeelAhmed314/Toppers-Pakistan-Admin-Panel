<template>
  <party-form
    title="Update Supplier"
    :party="party"
    is-update
    route="supplier/"
  />
</template>

<script>
import PartyForm from '@/components/parties/form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { PartyForm },
  async asyncData({ $axios, route }) {
    return {
      party: await $axios.$get('supplier/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
