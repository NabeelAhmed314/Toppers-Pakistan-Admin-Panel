<template>
  <CarouselForm title="Update Carousel Image" :carousel="carousel" is-update />
</template>

<script>
import CarouselForm from '@/components/carousel/form'
export default {
  name: 'Id',
  components: { CarouselForm },
  middleware: 'isAdmin',
  async asyncData({ $axios, route }) {
    return {
      carousel: await $axios.$get('carousel/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
