<template>
  <div style="padding: 20px">
    <DataViewer
      endpoint="/carousel"
      :columns="column"
      title="Carousel"
      create
      change
      remove
      create-route="/carousal/add"
      change-route="/carousal/edit/$id"
      remove-route="/carousel/delete/$id"
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
  name: 'Index',
  components: { DataViewer },
  middleware: 'isAdmin',
  data: () => {
    return {
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'green',
      column: [
        { text: 'ID', value: 'id' },
        { text: 'Image', value: 'imageCarousel' }
      ]
    }
  },
  methods: {
    onDelete() {
      this.snackbarColor = 'green'
      this.snackbarText = 'Deleted Carousel Image Successfully'
      this.snackbar = true
    }
  }
}
</script>

<style scoped></style>
