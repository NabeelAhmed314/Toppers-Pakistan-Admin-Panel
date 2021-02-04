<template>
  <div
    style="width: 100%;height: 100%;background-color:#fff;border-top-left-radius:40px;padding: 10px"
  >
    <v-container
      style="height: 100%;display: flex;align-items: center ;justify-content: center"
    >
      <v-card style="padding: 20px;width: 400px;">
        <v-container style="display: flex;padding: 0;align-items: center">
          <v-btn aria-hidden="true" icon @click="returnBack">
            <v-icon>mdi-keyboard-backspace</v-icon>
          </v-btn>
          <v-card-title>Update Staff Account</v-card-title>
        </v-container>
        <p v-if="success" style="color: green">
          Successfully Updated Your Account
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
          <v-container>
            <ImageSelector
              v-model="imageFile"
              :image="user"
              route="user"
              @input="sendImage = $event"
            />
          </v-container>
          <v-text-field
            v-model="user.name"
            :value="user.name"
            color="#313F53"
            :rules="[required]"
            outlined
            style="color: #313F53"
            label="Name"
            dense
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :value="user.email"
            color="#313F53"
            :rules="[required, emailValidator]"
            outlined
            style="color: #313F53"
            label="Email"
            dense
          ></v-text-field>
          <v-select
            v-model="user.type"
            readonly
            style="color: #313F53"
            color="#313F53"
            :items="typeItems"
            :rules="[required]"
            outlined
            dense
            label="Admin Type"
          />
          <v-autocomplete
            v-if="user.type === 'Sub Admin' || user.type === 'Branch Manager'"
            readonly
            :rules="[required]"
            :items="branches"
            :value="user.branch_id"
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
                user.branch_id = item.id
              }
            "
          ></v-autocomplete>
          <v-btn
            width="100%"
            color="#4f6318"
            style="color:#fff"
            large
            elevation="0"
            @click="updateUser"
          >
            Update
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
import ImageSelector from '@/components/misc/image-selector'
import { User } from '@/models/user'
export default {
  components: { ImageSelector },
  props: {
    user: {
      type: User,
      default: () => new User()
    }
  },
  data: () => ({
    loading: false,
    success: false,
    typeItems: ['Main Admin', 'Sub Admin', 'Branch Manager'],
    branches: [],
    errors: [],
    isLoading: false,
    search: null,
    imageFile: null,
    sendImage: null
  }),
  mounted() {
    this.getBranches()
  },
  methods: {
    required,
    lengthValidator,
    phoneValidator,
    emailValidator,
    returnBack() {
      this.$router.back()
    },
    async getBranches() {
      this.branches = await this.$axios.$get('/branch')
    },
    async updateUser() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          this.errors = []
          const formData = new FormData()
          formData.append('name', this.user.name)
          formData.append('email', this.user.email)
          formData.append('type', this.user.type)
          if (
            this.user.type === 'Sub Admin' ||
            this.user.type === 'Branch Manager'
          ) {
            formData.append('branchId', this.user.branch_id)
          }
          if (this.sendImage) {
            formData.append('image', this.sendImage)
          } else {
            formData.append('image', null)
          }
          formData.forEach((item) => window.console.log(item))
          await this.$axios.post('auth/update/' + this.user.id, formData)
          this.loading = false
          this.sendImage = null
          this.returnBack()
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
