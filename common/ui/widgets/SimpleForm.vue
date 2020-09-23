<template>
  <div style="height: fit-content; margin: 0px 0">
    <v-form ref="myForm" v-model="valid" class="form">
      <slot name="header">
        <header class="form__header">
          <slot name="logo" />
          <span class="form__title">{{ title }}</span>
          <span class="form__message">{{ message }}</span>
        </header>
      </slot>

      <main class="form__body">
        <slot />
      </main>

      <slot name="actions">
        <footer class="form__actions">
          <v-btn
            color="primary"
            elevation="0"
            :disabled="!valid"
            @click="trigger"
          >
            Submit
          </v-btn>
        </footer>
      </slot>
      <error-dialog :error="error" />
      <v-dialog v-model="loading" width="400" persistent>
        <v-card width="400" style="padding: 20px" class="loading-dialog">
          <v-progress-circular
            style="margin-right: 20px"
            indeterminate
            color="primary"
          />
          <span class="loading-dialog__message">Loading...</span>
        </v-card>
      </v-dialog>
      <!--      <loading-dialog v-model="loading" />-->
    </v-form>
  </div>
</template>

<script>
import { ref, toRefs, reactive, defineComponent } from '@vue/composition-api'

import ErrorDialog from './ErrorDialog.vue'
import LoadingDialog from './LoadingDialog.vue'

/**
 * @displayName SimpleForm
 *
 * @version 1.0.0
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export default defineComponent({
  name: 'SimpleForm',

  components: {
    ErrorDialog,
    LoadingDialog
  },

  props: {
    /**
     * A Title to convey purpose of Form.
     * @since 1.0.0
     */
    title: {
      type: String,
      default: 'Form Title'
    },

    /**
     * A Message to explain the Title or to provide an
     * additional information (hint) to account related to
     * this Form.
     *
     * @since 1.0.0
     */
    message: {
      type: String,
      required: false
    },

    /**
     * @values post, patch
     * @since 1.0.0
     */
    method: {
      type: String,
      default: 'post'
    },

    /**
     * The Data that will be sent to REST API (Server)
     * through service.
     *
     * @since 1.0.0
     */
    data: {
      type: [Object, Function],
      required: true
    },

    /**
     * @since 1.0.0
     */
    endpoint: {
      type: String,
      required: true
    },

    /**
     * Whether to return to previous page on submit or not.
     * @since 1.0.0
     */
    return: {
      type: Boolean,
      default: false
    },
    clear: {
      type: Boolean,
      default: true
    },
    showError: {
      type: Boolean,
      default: true
    }
  },

  setup(props, context) {
    const myForm = ref(null)

    const state = reactive({
      /** @type {any} */
      error: null,
      /** @type {boolean} */
      valid: false,
      /** @type {boolean} */
      loading: false
    })

    async function trigger() {
      state.loading = true

      try {
        let data

        if (props.data instanceof Function) {
          data = await props.data()
        } else data = props.data

        if (data === null) {
          if (props.showError) {
            state.error = "Provide valid data 'null' was provided"
            this.valid = true
          }
          return
        }

        let res = null
        switch (props.method.toLowerCase()) {
          case 'post':
            this.valid = false
            if (data instanceof FormData) {
              res = await context.root.$axios.post(props.endpoint, data, {
                headers: {
                  'content-type': `multipart/form-data;`
                }
              })
            } else {
              res = await context.root.$axios.post(props.endpoint, data)
            }
            break
          case 'patch':
            this.valid = false
            if (data instanceof FormData) {
              res = await context.root.$axios.patch(props.endpoint, data, {
                headers: {
                  'content-type': `multipart/form-data;`
                }
              })
            } else {
              res = await context.root.$axios.patch(props.endpoint, data)
            }
            break
          default:
            state.error = 'Unknown METHOD was specified.'
            this.valid = false
            return
        }

        if (res) context.emit('response', res)

        if (props.return) {
          context.root.$router.back()
        } else {
          context.emit('reset')
          if (this.clear) {
            myForm.value.reset()
          }
        }
      } catch (error) {
        this.valid = true
        state.error = error
      } finally {
        this.valid = true
        state.loading = false
      }
    }

    return { myForm, ...toRefs(state), trigger }
  }
})
</script>

<style lang="sass">
.form
  width: 550px

  &__body
    @media (max-width: 525px)
      display: flex !important
      flex-direction: column

    grid-template-columns: calc(50% - 10px) calc(50% - 10px)

.span-2
  grid-column: 1 / 3 !important
</style>
<style lang="sass" scoped>
.form
  overflow: hidden !important
  background: white !important
  position: relative !important
  border-radius: 8px !important
  padding: 40px 40px 36px !important
  box-shadow: 0 3px 1px -2px rgba(black, 0.2), 0 2px 2px 0 rgba(black, 0.14), 0 1px 5px 0 rgba(black, 0.12) !important

  @media (max-width: 525px)
    box-shadow: none !important

  &__loading
    top: 0 !important
    left: 0 !important
    z-index: 5 !important
    width: 100% !important
    height: 100% !important
    position: absolute !important
    background: rgba(#fff, 0.8) !important

  &__header
    color: #202124 !important
    text-align: center !important

  &__title
    display: block !important
    font-size: 24px !important
    line-height: 32px !important
    font-weight: normal !important
    padding-bottom: 8px !important
    font-family: google-sans, sans-serif !important

  &__message
    display: block !important
    padding: 0 70px !important
    font-size: 16px !important
    line-height: 24px !important
    letter-spacing: .1px !important
    padding-bottom: 24px !important
    font-family: Roboto, sans-serif !important

  &__body
   display: grid
   grid-column-gap: 20px !important

  &__actions
    display: flex !important
    justify-content: flex-end !important
</style>
