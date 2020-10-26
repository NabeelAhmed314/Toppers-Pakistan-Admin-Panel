<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      :show-error="false"
      return
      :endpoint="
        isUpdate
          ? '/notification/update/' + notification.id
          : '/notification/new'
      "
    >
      <template v-slot:header>
        <v-row>
          <v-col
            style="display: flex ; align-items: center; justify-content: center"
            cols="12"
            md="1"
            sm="1"
          >
            <v-btn icon @click="returnBack">
              <v-icon>mdi-keyboard-backspace</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="11" sm="11">
            <v-card-title>{{ title }}</v-card-title>
          </v-col>
        </v-row>
      </template>
      <div class="span-2">
        <v-card style="padding: 20px;margin-bottom: 30px;box-shadow: none">
          <v-text-field
            v-model="notification.title"
            :rules="[required]"
            style="align-items: center !important;"
            outlined
            label="Title"
            dense
          ></v-text-field>
          <v-textarea
            v-model="notification.message"
            :rules="[required]"
            style="align-items: center !important;"
            outlined
            label="Message"
            dense
          ></v-textarea>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import { Notification } from '@/models/notification'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'NotificationForm',
  components: {
    SimpleForm
  },
  props: {
    notification: {
      type: [Object, Notification],
      default: () => new Notification()
    },
    isUpdate: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Form'
    }
  },
  methods: {
    emailValidator,
    required,
    phoneValidator,
    returnBack() {
      this.$router.back()
    },
    formData() {
      const formData = new FormData()
      for (const key of Object.keys(this.notification)) {
        if (key === 'id') {
        } else {
          formData.append(key, this.notification[key])
        }
      }
      formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>
