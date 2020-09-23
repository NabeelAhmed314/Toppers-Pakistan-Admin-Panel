<template>
  <CustomerMain />
</template>

<script>
import CustomerMain from '@/components/parties/customer-main'
export default {
  name: 'Index',
  middleware: 'isAdmin',
  components: { CustomerMain }
}
</script>

<style scoped></style>
