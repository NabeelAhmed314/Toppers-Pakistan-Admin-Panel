<template>
  <ItemForm title="Add New Item" />
</template>

<script>
import ItemForm from '@/components/item/form'
export default {
  name: 'Add',
  components: { ItemForm },
  middleware: 'isAdmin'
}
</script>

<style scoped></style>
