<template>
  <ResetPasswordForm
    v-if="$route.query.token === token.token"
    :id="$route.query.id"
  />
  <change-password-error v-else token admin />
</template>

<script>
import ResetPasswordForm from '@/components/admin/reset-password-form'
import ChangePasswordError from '@/components/parties/error'
export default {
  layout(context) {
    return 'none'
  },
  auth: false,
  components: { ResetPasswordForm, ChangePasswordError },
  data: () => ({
    hash: ''
  }),
  async asyncData({ $axios, route }) {
    return {
      token: await $axios.$get('auth/user/token/' + route.query.id)
    }
  }
}
</script>

<style scoped></style>
