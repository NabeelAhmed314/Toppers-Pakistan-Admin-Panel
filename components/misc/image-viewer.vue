<template>
  <div
    style="display: flex;justify-content: center;align-items: center;margin-bottom: 30px"
  >
    <v-avatar
      size="200"
      style="border: 1px solid #313F53;cursor: pointer;"
      @click="viewImage"
    >
      <img
        v-if="image"
        style="object-fit: cover"
        :src="$axios.defaults.baseURL + 'uploads/' + image.name"
      />
      <img
        v-else
        style="object-fit: cover"
        src="../../assets/images/placeholders/placeholder_person.jpg"
      />
    </v-avatar>
    <v-dialog v-model="imageView" width="700px">
      <div
        style="display: flex;justify-content: center;align-items: center;width:700px;"
      >
        <img
          v-if="image"
          style="object-fit: cover;width: 700px"
          :src="$axios.defaults.baseURL + 'uploads/' + image.name"
        />
        <img
          v-else
          style="object-fit: cover;width: 700px;height: 480px"
          src="../../assets/images/placeholders/placeholder_person.jpg"
        />
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageViewer',
  props: {
    image: {
      type: Object,
      default: null
    }
  },
  data: () => ({
    imageView: false
  }),
  methods: {
    viewImage() {
      this.imageView = true
      console.log(this.imageView)
    }
  }
}
</script>

<style scoped></style>
