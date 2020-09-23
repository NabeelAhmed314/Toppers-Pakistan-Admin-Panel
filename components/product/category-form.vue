<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      return
      :endpoint="
        isUpdate ? '/category/update/' + category.id : '/category/store'
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
          <v-card-title>Category Information</v-card-title>
          <v-text-field
            v-model="category.name"
            :rules="[required]"
            style="align-items: center !important;"
            outlined
            label="Name"
            :value="category.name"
            dense
          ></v-text-field>
          <p>Media</p>
          <div style="margin-bottom: 20px">
            <ImageSelector
              v-model="imageFile"
              :image="category"
              route="category"
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
import { Category } from '../../models/category'
import ImageSelector from '../misc/image-selector'
import {
  emailValidator,
  required,
  phoneValidator
} from '../../common/lib/validator'
export default {
  name: 'CategoryForm',
  components: {
    SimpleForm,
    ImageSelector
  },
  props: {
    category: {
      type: [Object, Category],
      default: () => new Category()
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
    sendImage: null
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
      const image = false
      for (const key of Object.keys(this.category)) {
        if (key === 'id') {
          continue
        } else if (key === 'image') {
          continue
        } else {
          formData.append(key, this.category[key])
        }
      }
      if (!image) {
        if (this.sendImage) {
          formData.append('image', this.sendImage)
        }
      }
      // formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>
