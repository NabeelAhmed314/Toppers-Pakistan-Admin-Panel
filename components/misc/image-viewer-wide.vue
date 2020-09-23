<template>
  <div style="margin-bottom: 30px">
    <div style="display: flex;overflow: auto" class="scrollbar">
      <div v-for="(item, i) of image" :key="i" style="margin-left: 10px;">
        <img
          width="100%"
          height="100%"
          style=" display: block;
        width: 200px;
        height: 200px;
        cursor: pointer;"
          :src="$axios.defaults.baseURL + 'uploads/' + item.name"
          @click="viewImage(item.name, item.sort)"
        />
        <p>{{ item.sort.toUpperCase() }}</p>
      </div>
    </div>
    <v-dialog v-model="imageView" width="700px">
      <div
        style="display: flex;justify-content: center;align-items: center;width:700px;background-color: white"
      >
        <div v-if="name && title">
          <h3 style="text-align: center">{{ title.toUpperCase() }}</h3>
          <img
            style="object-fit: cover;width: 700px"
            :src="$axios.defaults.baseURL + 'uploads/' + name"
          />
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImageViewerWide',
  props: {
    image: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    imageView: false,
    name: null,
    title: null
  }),
  mounted() {
    window.console.log(this.image)
  },
  methods: {
    viewImage(name, title) {
      this.imageView = true
      this.name = name
      this.title = title
    }
  }
}
</script>

<style scoped></style>
