<template>
  <unit-form is-update title="Update Unit" :unit="unit" />
</template>

<script>
import UnitForm from '../../../../components/product/unit-form'
export default {
  name: 'Id',
  middleware: 'isAdmin',
  components: { UnitForm },
  async asyncData({ $axios, route }) {
    return {
      unit: await $axios.$get('unit/' + route.params.id)
    }
  }
}
</script>

<style scoped></style>
