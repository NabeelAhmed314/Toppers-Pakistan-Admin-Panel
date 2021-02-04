<template>
  <FormPurchaseOrder />
</template>

<script>
import FormPurchaseOrder from '@/components/purchase/purchase-order/form-purchase-order'
export default {
  name: 'Add',
  components: { FormPurchaseOrder },
  middleware: 'isAdminOrManager'
}
</script>

<style scoped></style>
