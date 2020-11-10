<template>
  <PurchaseReport />
</template>

<script>
import PurchaseReport from '@/components/report/purchase'
export default {
  name: 'Purchase',
  middleware: 'isAdmin',
  components: { PurchaseReport }
}
</script>

<style scoped></style>
