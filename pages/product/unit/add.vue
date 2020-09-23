<template>
  <unit-form />
</template>

<script>
import UnitForm from '../../../components/product/unit-form'
export default {
  name: 'Add',
  middleware: 'isAdmin',
  components: { UnitForm }
}
</script>

<style scoped></style>
