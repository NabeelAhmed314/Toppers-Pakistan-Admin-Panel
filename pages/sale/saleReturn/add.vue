<template>
  <sale-return-form />
</template>

<script>
import SaleReturnForm from '@/components/sale/sale-return/form'
export default {
  name: 'Add',
  middleware: 'isAdminOrManager',
  components: { SaleReturnForm }
}
</script>

<style scoped></style>
