<template>
  <div
    style="width: 100%;height: 100%;background-color:#fff;border-top-left-radius:40px;padding: 10px"
  >
    <v-container
      style="height: 100%;display: flex;align-items: center ;justify-content: center"
    >
      <v-card style="padding: 20px;width: 400px;">
        <v-container style="display: flex;justify-content: center;padding: 0">
          <v-card-title>Change Password</v-card-title>
        </v-container>
        <p v-if="success" style="color: green">
          Successfully Changed Password
        </p>
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
            v-model="change.password"
            :rules="[required]"
            color="#313F53"
            outlined
            style="color: #313F53"
            type="password"
            label="Old Password"
            dense
          ></v-text-field>
          <v-text-field
            v-model="change.newPassword"
            :rules="[required, lengthValidator]"
            color="#313F53"
            outlined
            style="color: #313F53"
            type="password"
            label="New Password"
            dense
          ></v-text-field>
          <v-text-field
            v-model="change.confirmPassword"
            color="#313F53"
            :rules="[required, lengthValidator]"
            outlined
            type="password"
            style="color: #313F53"
            label="Confirm Password"
            dense
            @keypress.enter="changePassword"
          ></v-text-field>
          <v-btn
            width="100%"
            color="#FF974D"
            style="color:#494237"
            large
            elevation="0"
            @click="changePassword"
          >
            Submit
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import {
  required,
  emailValidator,
  lengthValidator,
  phoneValidator
} from '@/common/lib/validator'
export default {
  data: () => ({
    loading: false,
    success: false,
    errors: [],
    change: {
      password: '',
      confirmPassword: '',
      newPassword: ''
    }
  }),
  methods: {
    required,
    lengthValidator,
    phoneValidator,
    emailValidator,
    returnBack() {
      this.$router.back()
    },
    async changePassword() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          if (this.change.newPassword !== this.change.confirmPassword) {
            this.loading = false
            this.errors.push('Could not confirm password.')
            return
          }
          const formData = new FormData()
          formData.append('oldPassword', this.change.password)
          formData.append('newPassword', this.change.newPassword)
          formData.forEach((item) => window.console.log(item))
          await this.$axios.post(
            'auth/change-password/' + this.$auth.user.id,
            formData
          )
          this.loading = false
          this.change.password = ''
          this.change.newPassword = ''
          this.change.confirmPassword = ''
          this.success = true
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

<style>
.base-image-input {
  width: 300px !important;
}
</style>
