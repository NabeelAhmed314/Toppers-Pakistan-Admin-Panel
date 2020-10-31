<template>
  <sale-return />
</template>

<script>
import SaleReturn from '@/components/sale/sale-return/sale-return'
export default {
  name: 'Index',
  middleware: 'isAdmin',
  components: { SaleReturn }
}
</script>

<style scoped></style>
