<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;flex-direction: column;justify-content: center;align-items: center;"
      >
        <img
          alt="error-img"
          src="../../assets/images/error.png"
          width="130px"
        />
        <p v-if="token" style="margin-top: 20px;text-align: center">
          Password Reset Token Expired!
        </p>
        <p v-else style="margin-top: 20px;text-align: center">
          Could not change password!!
        </p>
        <nuxt-link v-if="admin" to="/" style="text-decoration: none">
          <v-btn
            width="100%"
            color="#FF974D"
            style="color:#494237;text-decoration: none"
            large
            elevation="0"
          >
            Login
          </v-btn>
        </nuxt-link>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ChangePasswordError',
  props: {
    token: {
      type: Boolean,
      default: false
    },
    admin: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped></style>
