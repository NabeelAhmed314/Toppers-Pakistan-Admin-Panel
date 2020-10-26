<template>
  <PurchaseReturnForm />
</template>

<script>
import PurchaseReturnForm from '@/components/purchase/purchase-return/form'
export default {
  name: 'Add',
  components: { PurchaseReturnForm },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
