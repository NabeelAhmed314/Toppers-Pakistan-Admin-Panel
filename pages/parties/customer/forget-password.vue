<template>
  <change-password-form
    v-if="$route.query.token === token.token"
    :id="$route.query.id"
  />
  <change-password-error v-else token />
</template>

<script>
import ChangePasswordForm from '@/components/parties/change-password-form'
import ChangePasswordError from '@/components/parties/error'
export default {
  name: 'ForgetPassword',
  components: { ChangePasswordError, ChangePasswordForm },
  auth: false,
  layout: 'none',
  async asyncData({ $axios, route }) {
    return {
      token: await $axios.$get('forgetPassword/' + route.query.id)
    }
  },
  head: {
    title: 'Toppers Pakistan'
  }
}
</script>

<style scoped></style>
