<template>
  <PurchaseReturnForm
    title="Update Purchase Return"
    :purchase-return="purchaseReturn"
    is-update
  />
</template>

<script>
import PurchaseReturnForm from '@/components/purchase/purchase-return/form'
export default {
  name: 'Id',
  components: { PurchaseReturnForm },
  middleware: 'isAdminOrManager',
  async asyncData({ $axios, route }) {
    return {
      purchaseReturn: await $axios.$get('purchaseReturn/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
