<template>
  <div>
    <p style="text-align: center">
      A mail has been sent at your email to change your password.
    </p>
    <nuxt-link
      to="/auth/login"
      style="display: flex;justify-content: center;text-decoration: none"
    >
      <v-btn color="#FF974D" style="color:#ffffff">
        Login
      </v-btn>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'MailSent'
}
</script>

<style scoped></style>
