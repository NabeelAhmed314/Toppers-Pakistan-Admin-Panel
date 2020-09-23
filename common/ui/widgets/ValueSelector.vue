<template>
  <v-select
    v-model="state.value"
    dense
    outlined
    :label="label"
    :items="state.data"
    :disabled="state.loading"
    :rules="[(v) => !!v || !required || 'Value is required']"
    @change="asd"
  >
    <template v-slot:append-item>
      <v-progress-circular
        v-if="state.loading"
        width="2"
        color="primary"
        indeterminate
        size="40"
      />
      <v-icon v-else> mdi-chevron-bottom</v-icon>
    </template>
    <template v-slot:selection="{ item }">
      <slot name="item" v-bind="item" />
    </template>
    <template v-slot:item="{ item }">
      <slot name="item" v-bind="item" />
    </template>
  </v-select>
</template>

<script>
import { defineComponent, watch, reactive } from '@vue/composition-api'

export default defineComponent({
  name: 'ValueSelector',

  props: {
    label: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      required: false
    }
  },

  setup(props, context) {
    const state = reactive({
      data: [],
      value: null,
      loading: true
    })

    async function load() {
      state.loading = true
      try {
        state.data = await context.root.$axios.$get(props.endpoint || '')
      } catch (e) {}
      state.loading = false
    }

    load()

    watch(
      () => props.endpoint,
      () => {
        state.value = null
        load()
      }
    )

    function asd(event) {
      context.emit('selected', event)
    }

    return { load, state, asd }
  }
})
</script>

<style scoped></style>
