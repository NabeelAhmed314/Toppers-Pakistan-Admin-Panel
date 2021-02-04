<template>
  <PaymentOutForm />
</template>

<script>
import PaymentOutForm from '@/components/purchase/payment-out/form'
export default {
  name: 'Add',
  components: { PaymentOutForm },
  middleware: 'isAdminOrManager'
}
</script>

<style scoped></style>
