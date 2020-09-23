<template>
  <v-dialog v-model="localError" width="400">
    <v-card width="400" class="card">
      {{ error }}
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch, defineComponent } from '@vue/composition-api'

/**
 * @displayName ErrorDialog
 *
 * @version 1.0.0
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export default defineComponent({
  name: 'ErrorDialog',

  props: {
    /**
     * @since 1.0.0
     */
    error: {
      type: [Error, Object],
      default: null
    }
  },

  setup(props, context) {
    /** @type {Error | Object} */
    const localError = ref(null)

    watch(
      () => props.error,
      () => {
        localError.value = props.error
      }
    )

    watch(localError, () => {
      if (localError.value === null) {
        context.emit('close', false)
      }
    })

    return { localError }
  }
})
</script>

<style scoped>
.card {
  padding: 20px !important;
}
</style>
