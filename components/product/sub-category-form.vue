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
          ? '/subcategory/update/' + subcategory.id
          : '/subcategory/store'
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
        <v-card style="padding: 20px;margin-bottom: 30px;box-shadow: none">
          <v-card-title>Sub Category Information</v-card-title>
          <v-text-field
            v-model="subcategory.name"
            :rules="[required]"
            style="align-items: center !important;"
            outlined
            label="Name"
            :value="subcategory.name"
            dense
          ></v-text-field>
          <v-autocomplete
            :rules="[required]"
            :items="categories"
            :loading="isLoading"
            :search-input.sync="search"
            item-text="name"
            outlined
            item-value="id"
            :value="subcategory.category_id"
            label="Category"
            placeholder="Search Category"
            return-object
            dense
            @change="
              (item) => {
                subcategory.category_id = item.id
              }
            "
          ></v-autocomplete>
          <p>Media</p>
          <p v-if="error" style="color:red">
            {{ error }}
          </p>
          <div style="margin-bottom: 20px">
            <ImageSelector
              v-model="imageFile"
              :image="subcategory"
              route="subcategory"
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
import { Subcategory } from '@/models/subcategory'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'CategoryForm',
  components: {
    SimpleForm,
    ImageSelector
  },
  props: {
    subcategory: {
      type: [Object, Subcategory],
      default: () => new Subcategory()
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
    search: null,
    categories: [],
    error: null
  }),
  mounted() {
    this.getCategories()
  },
  methods: {
    emailValidator,
    required,
    phoneValidator,
    returnBack() {
      this.$router.back()
    },
    async getCategories() {
      this.categories = await this.$axios.$get('/category')
    },
    formData() {
      const formData = new FormData()
      for (const key of Object.keys(this.subcategory)) {
        if (key === 'id') {
          continue
        } else if (key === 'image') {
          continue
        } else if (key === 'category_id') {
          formData.append(key, this.subcategory[key])
        } else {
          formData.append(key, this.subcategory[key])
        }
      }
      if (this.sendImage) {
        formData.append('image', this.sendImage)
      } else if (!this.sendImage && !this.isUpdate) {
        this.error = 'Please Provide Image'
        return null
      }
      formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>
