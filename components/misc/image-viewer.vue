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
        alt="imageViewer"
        style="object-fit: cover"
        :src="$axios.defaults.baseURL + 'uploads/' + image.name"
      />
      <img
        v-else
        alt="elseImageViewer"
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
          alt="viewImage"
          style="object-fit: cover;width: 700px"
          :src="$axios.defaults.baseURL + 'uploads/' + image.name"
        />
        <img
          v-else
          alt="viewElseImage"
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
    }
  }
}
</script>

<style scoped></style>
