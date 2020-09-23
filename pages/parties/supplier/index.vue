<template>
  <SupplierMain />
</template>

<script>
import SupplierMain from '@/components/parties/supplier-main'
export default {
  name: 'Index',
  middleware: 'isAdmin',
  components: { SupplierMain }
}
</script>

<style scoped></style>
