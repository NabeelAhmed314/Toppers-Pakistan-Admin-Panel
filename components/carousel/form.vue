<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      :show-error="false"
      return
      :endpoint="
        isUpdate ? '/carousel/update/' + carousel.id : '/carousel/store'
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
          <p>Media</p>
          <p v-if="error" style="color:red">
            {{ error }}
          </p>
          <div style="margin-bottom: 20px">
            <ImageSelector
              v-model="imageFile"
              :image="carousel"
              route="carousel"
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
import { Carousel } from '@/models/carousel'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'CarouselForm',
  components: {
    SimpleForm,
    ImageSelector
  },
  props: {
    carousel: {
      type: [Object, Carousel],
      default: () => new Carousel()
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
      for (const key of Object.keys(this.carousel)) {
        if (key === 'id') {
          continue
        } else if (key === 'image') {
          continue
        } else {
          formData.append(key, this.carousel[key])
        }
      }
      if (this.sendImage) {
        formData.append('image', this.sendImage)
      } else if (!this.sendImage && !this.isUpdate) {
        this.error = 'Please Provide Image'
        return null
      }
      // formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>
