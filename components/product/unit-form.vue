<template>
  <v-container style="display: flex;justify-content: center">
    <SimpleForm
      style="margin: 30px 0"
      method="post"
      :data="formData"
      return
      :endpoint="isUpdate ? '/unit/update/' + unit.id : '/unit/store'"
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
          <v-card-title>Unit Information</v-card-title>
          <v-text-field
            v-model="unit.name"
            :rules="[required]"
            style="align-items: center !important;"
            outlined
            label="Name"
            :value="unit.name"
            dense
          ></v-text-field>
        </v-card>
      </div>
    </SimpleForm>
  </v-container>
</template>

<script>
import SimpleForm from '../../common/ui/widgets/SimpleForm'
import { Unit } from '@/models/unit'
import {
  emailValidator,
  required,
  phoneValidator
} from '@/common/lib/validator'
export default {
  name: 'UnitForm',
  components: {
    SimpleForm
  },
  props: {
    unit: {
      type: [Object, Unit],
      default: () => new Unit()
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
      for (const key of Object.keys(this.unit)) {
        if (key === 'id') {
        } else {
          formData.append(key, this.unit[key])
        }
      }
      formData.forEach((item) => window.console.log(item))
      return formData
    }
  }
}
</script>
