<template>
  <CustomerMain />
</template>

<script>
import CustomerMain from '@/components/parties/customer-main'
export default {
  name: 'Index',
  middleware: 'isAdminOrManager',
  components: { CustomerMain }
}
</script>

<style scoped></style>
