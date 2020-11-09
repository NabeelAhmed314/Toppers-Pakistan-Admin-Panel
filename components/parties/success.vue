<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;flex-direction:column;justify-content: center;align-items: center;"
      >
        <img
          alt="toppers-logo"
          src="../../assets/images/checkHD.png"
          width="130px"
        />
        <p style="margin-top: 20px;text-align: center">
          Successfully changed password!
        </p>
        <p v-if="!admin" style="text-align: center">
          Head to our app to log in to your account.
        </p>
        <p v-else style="text-align: center">
          Login to your account <nuxt-link to="/">here</nuxt-link> .
        </p>
      </v-container>
    </v-card></v-container
  ></template
>

<script>
export default {
  name: 'ChangePasswordSuccess',
  props: {
    admin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
