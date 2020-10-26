<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;justify-content: center;align-items: center;"
      >
        <img
          alt="toppers-logo"
          src="../../assets/images/ToppersPakistanLogo.png"
          width="130px"
          height="130px"
        />
      </v-container>
      <v-container style="display: flex;justify-content: center;padding: 0">
        <v-card-title>Login</v-card-title>
      </v-container>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="#313F53"
        class="mb-0"
      ></v-progress-linear>
      <v-form v-if="!loading" ref="form">
        <ul v-if="messageCheck" style="color: green;margin-bottom: 15px">
          <li>
            {{ message }}
          </li>
        </ul>
        <ul v-if="errors.length" style="color: red;margin-bottom: 15px">
          <li v-for="(error, i) of errors" :key="i">
            {{ error }}
          </li>
        </ul>
        <v-text-field
          v-model="login.email"
          color="#313F53"
          outlined
          style="color: #313F53"
          :rules="[required]"
          label="Email"
          dense
        ></v-text-field>
        <v-text-field
          v-model="login.password"
          color="#313F53"
          outlined
          :rules="[required]"
          :type="type"
          style="color: #313F53"
          label="Password"
          dense
          :append-icon="icon"
          @click:append="togglePassword"
          @keypress.enter="userLogin"
        ></v-text-field>
        <nuxt-link to="/auth/forgot-password" style="text-decoration: none">
          <p style="font-size: 12px;text-align: right;color:#313f53;">
            Forgot Password?
          </p></nuxt-link
        >
        <v-btn
          width="100%"
          color="#FF974D"
          style="color:#ffffff"
          large
          elevation="0"
          @click="userLogin"
        >
          Log In
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { required, emailValidator } from '@/common/lib/validator'
export default {
  layout(context) {
    return 'none'
  },
  data: () => ({
    loading: false,
    errors: [],
    login: {
      email: '',
      password: ''
    },
    type: 'password',
    icon: 'mdi-eye-off',
    message: 'Your Password was changed!',
    messageCheck: false
  }),
  mounted() {
    this.messageCheck = window.localStorage.getItem('messageCheck')
  },
  methods: {
    required,
    emailValidator,
    togglePassword() {
      if (this.type === 'password') {
        this.type = 'text'
        this.icon = 'mdi-eye'
      } else {
        this.type = 'password'
        this.icon = 'mdi-eye-off'
      }
    },
    async gotoReset() {
      await this.$router.push('/auth/reset-password')
    },
    async userLogin() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          this.messageCheck = false
          window.localStorage.removeItem('messageCheck')
          await this.$auth.loginWith('local', {
            data: this.login
          })
        } catch (err) {
          this.loading = false
          window.console.log(err)
          if (err.response) {
            this.errors.push(err.response.data.message)
          } else {
            this.errors.push('Unable to process, Try again later')
          }
        }
      }
    }
  }
}
</script>
