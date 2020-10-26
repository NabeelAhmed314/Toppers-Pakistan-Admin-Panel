<template>
  <div>
    <NotificationMain />
  </div>
</template>

<script>
import NotificationMain from '@/components/notification/main'
export default {
  name: 'Index',
  components: { NotificationMain },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
