<template>
  <div
    style="width: 100%;height: 100%;background-color:#fff;border-top-left-radius:40px;padding: 10px"
  >
    <v-container
      style="height: 100%;display: flex;align-items: center ;justify-content: center"
    >
      <v-card style="padding: 20px;width: 400px;">
        <v-container style="display: flex;justify-content: center;padding: 0">
          <v-card-title>Register Admin</v-card-title>
        </v-container>
        <p v-if="success" style="color: green">
          Successfully Registered New Admin Account
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
            v-model="signup.name"
            :value="signup.name"
            color="#313F53"
            :rules="[required]"
            outlined
            style="color: #313F53"
            label="Name"
            dense
          ></v-text-field>
          <v-text-field
            v-model="signup.email"
            :value="signup.email"
            color="#313F53"
            :rules="[required, emailValidator]"
            outlined
            style="color: #313F53"
            label="Email"
            dense
          ></v-text-field>
          <v-select
            v-model="signup.type"
            style="color: #313F53"
            color="#313F53"
            :items="typeItems"
            :rules="[required]"
            outlined
            dense
            label="Admin Type"
          />
          <v-autocomplete
            v-if="signup.type === 'Sub Admin' || 'Branch Manager'"
            :rules="[required]"
            :items="branches"
            :value="signup.branchId"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="name"
            outlined
            item-value="id"
            label="Branch"
            return-object
            dense
            @change="
              (item) => {
                signup.branchId = item.id
              }
            "
          ></v-autocomplete>
          <v-text-field
            v-model="signup.password"
            :value="signup.password"
            :rules="[required, lengthValidator]"
            color="#313F53"
            outlined
            style="color: #313F53"
            type="password"
            label="Password"
            dense
          ></v-text-field>
          <v-text-field
            v-model="signup.confirmPassword"
            :value="signup.confirmPassword"
            color="#313F53"
            :rules="[required, lengthValidator]"
            outlined
            type="password"
            style="color: #313F53"
            label="Confirm Password"
            dense
            @keypress.enter="createUser"
          ></v-text-field>
          <v-btn
            width="100%"
            color="#4f6318"
            style="color:#fff"
            large
            elevation="0"
            @click="createUser"
          >
            Sign Up
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
  middleware: 'isAdmin',
  data: () => ({
    loading: false,
    success: false,
    typeItems: ['Main Admin', 'Sub Admin', 'Branch Manager'],
    branches: [],
    errors: [],
    isLoading: false,
    search: null,
    type: 'password',
    icon: 'mdi-eye',
    signup: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      contact: '',
      type: null,
      branchId: null
    }
  }),
  mounted() {
    this.getBranches()
  },
  methods: {
    required,
    lengthValidator,
    phoneValidator,
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
    returnBack() {
      this.$router.back()
    },
    async getBranches() {
      this.branches = await this.$axios.$get('/branch')
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          if (this.signup.password !== this.signup.confirmPassword) {
            this.loading = false
            this.errors.push('Could not confirm password.')
            return
          }
          const formData = new FormData()
          formData.append('name', this.signup.name)
          formData.append('email', this.signup.email)
          formData.append('password', this.signup.password)
          formData.append('image', null)
          formData.append('restaurant-branch', this.signup.branchId)
          formData.append('type', this.signup.type)
          formData.forEach((item) => window.console.log(item))
          await this.$axios.post('auth/sign-up', formData)
          this.loading = false
          this.signup.name = ''
          this.signup.email = ''
          this.signup.password = ''
          this.signup.branchId = ''
          this.signup.confirmPassword = ''
          this.signup.type = ''
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
