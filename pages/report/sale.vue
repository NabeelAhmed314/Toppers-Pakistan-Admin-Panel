<template>
  <SaleReport />
</template>

<script>
import SaleReport from '@/components/report/sale'
export default {
  name: 'Sale',
  middleware: 'isAdmin',
  components: { SaleReport }
}
</script>

<style scoped></style>
