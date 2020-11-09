<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;justify-content: center;align-items: center;"
      >
        <img
          src="../../assets/images/ToppersPakistanLogo.png"
          alt="logo"
          width="130px"
          height="130px"
        />
      </v-container>
      <v-container style="display: flex;justify-content: center;padding: 0">
        <v-card-title>Forgot Password</v-card-title>
      </v-container>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="#313F53"
        class="mb-0"
      ></v-progress-linear>
      <MailSent v-if="mail" />
      <v-form v-if="!loading && !mail" ref="form">
        <ul v-if="errors.length" style="color: red;margin-bottom: 15px">
          <li v-for="(error, i) of errors" :key="i">
            {{ error }}
          </li>
        </ul>
        <v-text-field
          v-model="data.email"
          color="#313F53"
          outlined
          style="color: #313F53"
          :rules="[required, emailValidator]"
          label="Email"
          dense
        ></v-text-field>
        <nuxt-link to="/auth/login" style="text-decoration: none">
          <p style="font-size: 12px;text-align: right;color:#313f53;">
            Have an Account? Login
          </p></nuxt-link
        >
        <v-btn
          width="100%"
          color="#FF974D"
          style="color:#ffffff"
          large
          elevation="0"
          @click="reset"
        >
          Submit
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import MailSent from '../../components/misc/mail-sent'
import { emailValidator, required } from '@/common/lib/validator'

export default {
  components: { MailSent },
  layout(context) {
    return 'none'
  },
  auth: false,
  data: () => ({
    mail: false,
    loading: false,
    errors: [],
    data: {
      email: ''
    }
  }),
  methods: {
    required,
    emailValidator,
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          window.console.log(this.data)
          await this.$axios.post('auth/user/forgotpassword', this.data)
          this.mail = true
          this.loading = false
        } catch (err) {
          this.loading = false
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

<style scoped></style>
