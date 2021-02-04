<template>
  <CustomerAddresses :customer-id="customerId" />
</template>

<script>
import CustomerAddresses from '@/components/parties/customer-addresses'
export default {
  name: 'Id',
  middleware: 'isAdminOrManager',
  components: { CustomerAddresses },
  asyncData({ route }) {
    return {
      customerId: route.params.id
    }
  }
}
</script>

<style scoped></style>
