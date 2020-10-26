<template>
  <div style="padding: 20px">
    <DataViewer
      title="Notifications"
      endpoint="/notification/new"
      :columns="columns"
      create
      create-route="/notification/add"
      remove
      remove-route="/notification/new/$id"
      :on-delete="onDelete"
    />
    <v-snackbar
      v-model="snackbar"
      bottom
      :color="snackbarColor"
      :timeout="1500"
    >
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script>
import DataViewer from '@/common/ui/widgets/DataViewer'
export default {
  name: 'NotificationMain',
  components: { DataViewer },
  data: () => {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'green',
      columns: [
        { text: 'ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Message', value: 'message' }
      ]
    }
  },
  methods: {
    onDelete() {
      this.snackbarColor = 'green'
      this.snackbarText = 'Deleted Notification Successfully'
      this.snackbar = true
    }
  }
}
</script>

<style scoped></style>
