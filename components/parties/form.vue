<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      return
      :show-error="false"
      :endpoint="isUpdate ? route + 'update/' + party.id : route + 'store'"
    >
      <template v-slot:header>
        <v-row>
          <v-col
            style="display: flex ; align-items: center; justify-content: center"
            cols="12"
            md="1"
            sm="1"
          >
            <v-btn aria-hidden="true" icon @click="returnBack">
              <v-icon>mdi-keyboard-backspace</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="11" sm="11">
            <v-card-title>{{ title }}</v-card-title>
          </v-col>
        </v-row>
      </template>
      <div class="span-2">
        <ul v-if="errors.length" style="color: red;margin-bottom: 15px">
          <li v-for="(error, i) of errors" :key="i">
            {{ error }}
          </li>
        </ul>
        <v-card style="box-shadow: none">
          <v-text-field
            v-model="party.name"
            class="my-text"
            :rules="[required]"
            outlined
            label="Name *"
            :value="party.name"
            dense
          ></v-text-field>
          <v-text-field
            v-model="party.email"
            class="my-text"
            :rules="[
              password === '' ? true : required,
              password === '' ? true : emailValidator
            ]"
            outlined
            :label="password === '' ? 'Email' : 'Email *'"
            :value="party.email"
            dense
          ></v-text-field>
          <v-text-field
            v-model="party.phone"
            v-mask="['### - #######', '#### - #######']"
            class="my-text"
            outlined
            label="Phone"
            :value="party.phone"
            dense
          ></v-text-field>
          <v-text-field
            v-if="!isUpdate && !isSupplier"
            v-model="password"
            class="my-text"
            outlined
            label="Password"
            type="password"
            :value="password"
            dense
          ></v-text-field>
          <v-text-field
            v-if="!isUpdate & !isSupplier"
            v-model="confirmPassword"
            class="my-text"
            outlined
            type="password"
            label="Confirm Password"
            :value="confirmPassword"
            dense
          ></v-text-field>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import { Party } from '@/models/party'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'PartyForm',
  components: {
    SimpleForm
  },
  props: {
    party: {
      type: [Object, Party],
      default: () => new Party()
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    route: {
      type: String,
      default: '/path'
    },
    isSupplier: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Form'
    }
  },
  data: () => ({
    password: '',
    confirmPassword: '',
    errors: [],
    requiredBool: false
  }),
  methods: {
    emailValidator,
    required,
    phoneValidator,
    returnBack() {
      this.$router.back()
    },
    formData() {
      const formData = new FormData()
      this.errors = []
      formData.append('name', this.party.name)
      if (this.party.email) formData.append('email', this.party.email)
      if (this.party.phone) formData.append('phone', this.party.phone)
      if (this.password) {
        if (this.password === this.confirmPassword) {
          formData.append('password', this.password)
        } else {
          this.errors.push('Could not confirm password.')
          return null
        }
      }
      formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>

<style scoped>
.my-text {
  margin: 0 10px;
}
</style>
