import { reactive, toRefs } from '@vue/composition-api'

export function setupDataLoader(axios, endpoint, addAction = false) {
  const state = reactive({
    data: [],
    error: null,
    loading: false
  })

  async function load() {
    state.loading = true

    try {
      const items = await axios.$get(endpoint)

      if (addAction) {
        for (const item of items) {
          item.action = ''
        }
      }
      state.data = items || []
    } catch (error) {
      state.error = error
    } finally {
      state.loading = false
    }
  }

  return { ...toRefs(state), load }
}
