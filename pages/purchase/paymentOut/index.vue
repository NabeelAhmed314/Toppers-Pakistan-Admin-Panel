<template>
  <PaymentOut />
</template>

<script>
import PaymentOut from '@/components/purchase/payment-out/payment-out'
export default {
  name: 'Index',
  components: { PaymentOut },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
