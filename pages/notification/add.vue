<template>
  <NotificationForm title="Send Notification" />
</template>

<script>
import NotificationForm from '@/components/notification/form'
export default {
  name: 'Add',
  components: { NotificationForm },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
