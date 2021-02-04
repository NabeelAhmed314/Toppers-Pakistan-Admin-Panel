<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;justify-content: center;align-items: center;"
      >
        <img
          alt="logo"
          src="../../assets/images/ApnaPos.png"
          width="130px"
          height="130px"
        />
      </v-container>
      <v-container style="display: flex;justify-content: center;padding: 0">
        <v-card-title>Reset Password</v-card-title>
      </v-container>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="#313F53"
        class="mb-0"
      ></v-progress-linear>
      <v-form v-if="!loading" ref="form">
        <ul v-if="errors.length" style="color: red;margin-bottom: 15px">
          <li v-for="(error, i) of errors" :key="i">
            {{ error }}
          </li>
        </ul>
        <v-text-field
          v-model="data.password"
          color="#313F53"
          outlined
          style="color: #313F53"
          :rules="[required, lengthValidator]"
          type="password"
          label="New Password"
          dense
        ></v-text-field>
        <v-text-field
          v-model="confirmPassword"
          color="#313F53"
          type="password"
          outlined
          style="color: #313F53"
          :rules="[required, lengthValidator]"
          label="Confirm Password"
          dense
          @keypress.enter="reset"
        ></v-text-field>
        <nuxt-link to="/auth/login" style="text-decoration: none">
          <p style="font-size: 12px;text-align: right;color:#313f53;">
            Have an Account? Login
          </p></nuxt-link
        >
        <v-btn
          width="100%"
          color="#4f6318"
          style="color:#494237"
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
import { required, lengthValidator } from '@/common/lib/validator'

export default {
  name: 'ResetPassword',
  layout(context) {
    return 'none'
  },
  auth: false,
  props: {
    getHash: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    loading: false,
    errors: [],
    confirmPassword: '',
    data: {
      password: '',
      hash: ''
    }
  }),
  mounted() {
    this.data.hash = this.getHash
  },
  methods: {
    required,
    lengthValidator,
    async reset() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          window.console.log(this.data)
          if (this.data.password === this.confirmPassword) {
            await this.$axios.post('persons/resetpassword', this.data)
            window.localStorage.setItem('messageCheck', true)
            await this.$router.push('/auth/login')
          } else {
            this.loading = false
            this.errors.push('Could not confirm password.')
          }
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
