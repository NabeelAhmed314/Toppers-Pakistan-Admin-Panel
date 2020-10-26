<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      return
      :show-error="false"
      :endpoint="isUpdate ? '/branch/update/' + branch.id : '/branch/store'"
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
        <v-card style="padding: 0px 20px;margin-bottom: 30px;box-shadow: none">
          <v-card-title>Branch Information</v-card-title>
          <v-text-field
            v-model="branch.name"
            class="textfieldStyle"
            :rules="[required]"
            outlined
            label="Name"
            :value="branch.name"
            dense
          ></v-text-field>
          <v-text-field
            v-model="branch.email"
            class="textfieldStyle"
            :rules="[required, emailValidator]"
            outlined
            label="Email"
            :value="branch.email"
            dense
          ></v-text-field>
          <v-text-field
            v-model="branch.phone"
            v-mask="['### - #######', '#### - ########']"
            class="textfieldStyle"
            :rules="[required]"
            outlined
            label="Phone"
            :value="branch.phone"
            dense
          ></v-text-field>
          <v-text-field
            v-model="branch.address"
            class="textfieldStyle"
            :rules="[required]"
            outlined
            label="Address"
            :value="branch.address"
            dense
          ></v-text-field>
          <p class="textfieldStyle">Media</p>
          <p v-if="error" class="textfieldStyle" style="color:red">
            {{ error }}
          </p>
          <div class="textfieldStyle" style="margin-bottom: 20px">
            <ImageSelector
              v-model="imageFile"
              :image="branch"
              route="branch"
              @input="sendImage = $event"
            />
          </div>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import ImageSelector from '../misc/image-selector'
import { Branch } from '@/models/branch'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'BranchForm',
  components: {
    SimpleForm,
    ImageSelector
  },
  props: {
    branch: {
      type: [Object, Branch],
      default: () => new Branch()
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
  data: () => ({
    imageFile: null,
    sendImage: null,
    isLoading: false,
    error: null
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
      for (const key of Object.keys(this.branch)) {
        if (key === 'id') {
          continue
        } else if (key === 'image') {
          continue
        } else if (key === 'subCategory_id') {
          formData.append(key, this.branch[key])
        } else if (key === 'unit_id') {
          formData.append(key, this.branch[key])
        } else {
          formData.append(key, this.branch[key])
        }
      }
      if (this.sendImage) {
        formData.append('image', this.sendImage)
      } else if (!this.sendImage && !this.isUpdate) {
        this.error = 'Please Provide Image'
        return null
      }
      formData.append('restaurant', 1)
      // formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>

<style scoped>
.textfieldStyleSmall {
  width: 50%;
}
.textfieldStyle {
  margin: 0 20px;
}
</style>
