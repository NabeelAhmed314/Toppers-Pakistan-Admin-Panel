<template>
  <v-dialog width="400" persistent>
    <v-card width="400" class="loading-dialog">
      <v-progress-circular indeterminate color="primary" />
      <span class="loading-dialog__message">{{ message }}</span>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

/**
 * @displayName LoadingDialog
 *
 * @version 1.0.0
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export default defineComponent({
  name: 'LoadingDialog',

  model: {
    prop: 'loading',
    event: 'loading'
  },

  props: {
    /**
     * @since 1.0.0
     */
    loading: {
      type: Boolean,
      default: false
    },
    /**
     * @since 1.0.0
     */
    message: {
      type: String,
      default: 'Loading ...'
    }
  }
})
</script>

<style lang="sass" scoped>
.loading-dialog
  padding: 20px !important

  &__message
    font-size: 18px !important
    padding-left: 15px !important
    display: inline-block !important
    font-family: google-sans, sans-serif !important
</style>
