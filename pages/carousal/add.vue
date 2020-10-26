<template>
  <CarouselForm />
</template>

<script>
import CarouselForm from '@/components/carousel/form'
export default {
  name: 'Add',
  components: { CarouselForm },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
