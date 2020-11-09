<template>
  <v-container
    style="height: 100%;display: flex;align-items: center ;justify-content: center"
  >
    <v-card v-if="success === null" style="padding: 50px;width: 400px;">
      <v-container
        style="display: flex;justify-content: center;align-items: center;"
      >
        <img
          alt="toppers-logo"
          src="../../assets/images/ToppersPakistanLogo.png"
          width="130px"
        />
      </v-container>
      <v-container style="display: flex;justify-content: center;padding: 0">
        <v-card-title>Change Password</v-card-title>
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
          v-model="change.password"
          color="#313F53"
          outlined
          :rules="[required]"
          :type="type1"
          style="color: #313F53"
          label="Password"
          dense
          :append-icon="icon1"
          @click:append="togglePassword1"
        ></v-text-field>
        <v-text-field
          v-model="change.confirmPassword"
          color="#313F53"
          outlined
          :rules="[
            required,
            change.password
              ? (v) => v === change.password || 'Could Not Confirm Password'
              : true
          ]"
          :type="type2"
          style="color: #313F53"
          label="Confirm Password"
          dense
          :append-icon="icon2"
          @click:append="togglePassword2"
          @keypress.enter="userChangePassword"
        ></v-text-field>
        <v-btn
          width="100%"
          color="#FF974D"
          style="color:#494237"
          large
          elevation="0"
          :disabled="change.password !== change.confirmPassword"
          @click="userChangePassword"
        >
          Submit
        </v-btn>
      </v-form>
    </v-card>
    <ChangePasswordSuccess v-else-if="success === true" admin />
    <ChangePasswordError v-else admin />
  </v-container>
</template>

<script>
import { required, emailValidator } from '@/common/lib/validator'
import ChangePasswordSuccess from '@/components/parties/success'
import ChangePasswordError from '@/components/parties/error'
export default {
  name: 'ResetPasswordForm',
  components: { ChangePasswordError, ChangePasswordSuccess },
  layout(context) {
    return 'none'
  },
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data: () => ({
    loading: false,
    errors: [],
    change: {
      changePassword: '',
      password: '',
      id: ''
    },
    success: null,
    type1: 'password',
    type2: 'password',
    icon1: 'mdi-eye-off',
    icon2: 'mdi-eye-off',
    message: 'Your Password was changed!',
    messageCheck: false
  }),
  methods: {
    required,
    emailValidator,
    togglePassword1() {
      if (this.type1 === 'password') {
        this.type1 = 'text'
        this.icon1 = 'mdi-eye'
      } else {
        this.type1 = 'password'
        this.icon1 = 'mdi-eye-off'
      }
    },
    togglePassword2() {
      if (this.type2 === 'password') {
        this.type2 = 'text'
        this.icon2 = 'mdi-eye'
      } else {
        this.type2 = 'password'
        this.icon2 = 'mdi-eye-off'
      }
    },
    async userChangePassword() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          this.messageCheck = false
          this.change.id = this.id
          const response = await this.$axios.$post(
            'auth/user/reset-password',
            this.change
          )
          console.log('After Response')
          console.log(response)
          if (response === true) {
            this.success = true
          } else {
            this.success = false
          }
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
