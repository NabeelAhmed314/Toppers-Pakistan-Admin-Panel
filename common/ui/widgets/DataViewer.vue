<template>
  <v-card class="data-viewer" elevation="8">
    <v-card-title class="data-viewer__title">
      <v-btn v-if="back" icon style="margin-right: 50px" @click="returnBack">
        <v-icon aria-hidden="true">mdi-keyboard-backspace</v-icon>
      </v-btn>
      <span>{{ title }}</span>
      <v-spacer />

      <v-btn
        aria-hidden="true"
        v-if="create"
        color="primary"
        elevation="0"
        style="padding: 0 13px 0 7px !important; border-radius: 4px; margin-right: 10px"
        @click="handleCreateEvent"
      >
        <v-icon small aria-hidden="true">mdi-plus</v-icon>

        <span>Add New</span>
      </v-btn>

      <!--      <v-bottom-sheet v-model="filter" persistent>-->
      <!--        <template v-slot:activator="{ on }">-->
      <!--          <v-btn icon v-on="on">-->
      <!--            <v-icon>mdi-filter</v-icon>-->
      <!--          </v-btn>-->
      <!--        </template>-->
      <!--        <v-sheet class="text-center" height="200px">-->
      <!--          <v-btn class="mt-6" flat color="error" @click="sheet = !sheet"-->
      <!--            >close</v-btn-->
      <!--          >-->
      <!--          <div class="py-3">-->
      <!--            This is a bottom sheet using the persistent prop-->
      <!--          </div>-->
      <!--        </v-sheet>-->
      <!--      </v-bottom-sheet>-->

      <v-btn aria-hidden="true" icon @click="load">
        <v-icon aria-hidden="true">mdi-reload</v-icon>
      </v-btn>
    </v-card-title>

    <div class="data-viewer__search">
      <div class="data-viewer__search--spacer" />
      <v-text-field
        v-model="search"
        placeholder="Search"
        dense
        filled
        outlined
        aria-hidden="true"
        style="margin-left: auto; width: 450px; margin-right: 20px"
        prepend-inner-icon="mdi-magnify"
      />
    </div>
    <v-data-table
      :headers="columns"
      :loading="loading"
      :search="search"
      :items="data"
      :dense="dense"
      height="500"
      fixed-header
      class="data-table__content"
    >
      <template v-slot:item.person.image="{ item }">
        <v-avatar
          v-if="item.person.image != null"
          style="margin: 5px;padding: 0px"
        >
          <img
            alt="person"
            style="object-fit: cover"
            :src="$axios.defaults.baseURL + 'uploads/' + item.person.image.name"
          />
        </v-avatar>
        <p v-if="item.person.image == null" style="margin: 0">
          No Image
        </p>
      </template>
      <template v-slot:item.profile.image="{ item }">
        <v-avatar
          v-if="item.profile.image != null"
          style="margin: 5px;padding: 0px"
        >
          <img
            alt="profile"
            style="object-fit: cover"
            :src="
              $axios.defaults.baseURL + 'uploads/' + item.profile.image.name
            "
          />
        </v-avatar>
        <p v-if="item.profile.image == null" style="margin: 0">
          No Image
        </p>
      </template>
      <template v-slot:item.driver.profile.image="{ item }">
        <v-avatar
          v-if="item.driver.profile.image != null"
          style="margin: 5px;padding: 0px"
        >
          <img
            alt="driver"
            style="object-fit: cover"
            :src="
              $axios.defaults.baseURL +
                'uploads/' +
                item.driver.profile.image.name
            "
          />
        </v-avatar>
        <p v-if="item.driver.profile.image == null" style="margin: 0">
          No Image
        </p>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar v-if="item.image != null" style="margin: 5px;padding: 0px">
          <img
            alt="image"
            style="object-fit: cover"
            :src="$axios.defaults.baseURL + 'uploads/' + item.image.name"
          />
        </v-avatar>
        <p v-if="item.image == null" style="margin: 0">
          No Image
        </p>
      </template>
      <template v-slot:item.imageCarousel="{ item }">
        <v-avatar v-if="item.image != null" style="margin: 5px;padding: 0px">
          <img
            alt="carousal"
            style="object-fit: cover"
            :src="
              $axios.defaults.baseURL.replace('api/', '') +
                'images/carousel/' +
                item.image
            "
          />
        </v-avatar>
        <p v-if="item.image == null" style="margin: 0">
          No Image
        </p>
      </template>
      <template v-slot:item.images="{ item }">
        <v-avatar
          v-if="item.images != null && item.images.length != 0"
          style="margin: 5px;padding: 0px"
        >
          <img
            alt="multiimage"
            style="object-fit: cover"
            :src="$axios.defaults.baseURL + 'uploads/' + item.images[0].name"
          />
        </v-avatar>
        <p
          v-if="item.images == null || item.images.length == 0"
          style="margin: 0"
        >
          No Image
        </p>
      </template>
      <template v-slot:item.suppliers.person.image="{ item }">
        <v-avatar
          v-if="
            item.suppliers.person.image != null &&
              item.suppliers.person.image.length != 0
          "
          style="margin: 5px;padding: 0px"
        >
          <img
            alt="supplier"
            style="object-fit: cover"
            :src="
              $axios.defaults.baseURL +
                'uploads/' +
                item.suppliers.person.image.name
            "
          />
        </v-avatar>
        <p
          v-if="
            item.suppliers.person.image == null ||
              item.suppliers.person.image.length == 0
          "
          style="margin: 0"
        >
          No Image
        </p>
      </template>
      <template v-slot:item.createdAt="{ item }">
        <slot name="createdAt" :item="item" />
        {{ date(item.createdAt) }}
      </template>
      <template v-slot:item.person="{ item }">
        <slot name="person" :item="item" />
        <div v-if="item.person.length">
          <span v-for="(person, i) of item.person" :key="i">
            <span v-if="i === item.person.length - 1">
              {{ person ? person.name : 'No Name' }}
            </span>
            <span v-else>
              {{ person ? person.name + ' -' : 'No Name' + ' -' }}
            </span>
          </span>
        </div>
      </template>
      <template v-slot:item.address="{ item }">
        <slot name="address" :item="item" />
        {{ item.description ? item.description + ',' : '' }}
        {{ item.house ? item.house + ',' : '' }}
        {{ item.street ? item.street + ',' : '' }}
        {{ item.area ? item.area + ',' : '' }}
        {{ item.city ? item.city + '' : '' }}
      </template>
      <template v-slot:item.action="{ item }">
        <slot name="actions" :item="item" />
        <v-icon
          v-if="detail"
          style="margin: 5px"
          size="20"
          color="green"
          aria-hidden="true"
          @click="detailItem(item)"
          >mdi-clipboard</v-icon
        >
        <v-icon
          v-if="approve"
          size="20"
          style="margin: 5px"
          color="green"
          aria-hidden="true"
          @click="approveItem(item)"
          >mdi-check-circle</v-icon
        >
        <v-icon
          v-if="reject"
          style="margin: 5px"
          size="20"
          color="red"
          aria-hidden="true"
          @click="rejectItem(item)"
          >mdi-close-circle</v-icon
        >
        <v-icon
          v-if="change"
          style="margin: 5px"
          size="20"
          color="green"
          aria-hidden="true"
          @click="changeItem(item)"
          >mdi-pencil</v-icon
        >
        <v-icon
          v-if="remove"
          style="margin: 5px"
          size="20"
          color="red"
          aria-hidden="true"
          @click="removeItem(item)"
          >mdi-delete</v-icon
        >
        <v-icon
          v-if="block"
          style="margin: 5px"
          size="20"
          color="red"
          aria-hidden="true"
          @click="blockItem(item)"
          >mdi-block-helper</v-icon
        >
        <v-icon
          v-if="unblock"
          style="margin: 5px"
          small
          color="green"
          aria-hidden="true"
          @click="unblockItem(item)"
          >mdi-check</v-icon
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment'
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { setupDataLoader } from '../../lib/data-loader'

/**
 * @displayName DataViewer
 *
 * @version 1.0.0
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export default defineComponent({
  name: 'DataViewer',

  props: {
    /**
     * Title of the Viewer, it determines the type
     * of data that is being displayed.
     *
     * @since 1.0.0
     */
    title: {
      type: String,
      required: true
    },

    /**
     * Material design related prop
     *
     * @since 1.0.0
     */
    dense: {
      type: Boolean,
      default: false
    },

    /**
     * List of columns that are required to be viewed.
     *
     * @since 1.0.0
     */
    columns: {
      type: Array,
      required: true
    },

    onBlock: Function,
    onUnblock: Function,
    onAccepted: Function,
    onRejected: Function,
    onDelete: Function,

    /**
     * Options or additional action that need to be
     * performed on the data such as, printing a summary
     * report etc.
     *
     * @since 1.0.0
     */
    options: {
      type: Array,
      required: false,
      default: () => []
    },

    /**
     * Determines if the account can create new items
     * or not.
     *
     * @since 1.0.0
     */
    create: {
      type: Boolean,
      default: false
    },

    /**
     * Determines if the account can change items or not.
     *
     * @since 1.0.0
     */
    change: {
      type: Boolean,
      default: false
    },

    detail: {
      type: Boolean,
      default: false
    },
    back: {
      type: Boolean,
      default: false
    },
    approve: {
      type: Boolean,
      default: false
    },
    reject: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    unblock: {
      type: Boolean,
      default: false
    },

    /**
     * Determines if the account can create remove items
     * or not.
     *
     * @since 1.0.0
     */
    remove: {
      type: Boolean,
      default: false
    },
    action: {
      type: Boolean,
      default: true
    },

    /**
     * It is the Service that will make the request to
     * server including the parsing of request data and
     * response data.
     *
     * @since 1.0.0
     */
    endpoint: {
      type: String,
      required: true
    },

    pagination: {
      type: Boolean,
      default: false
    },

    createRoute: {
      type: String,
      default: null,
      required: false
    },

    changeRoute: {
      type: String,
      default: null,
      required: false
    },

    detailRoute: {
      type: String,
      default: null,
      required: false
    },
    approveRoute: {
      type: String,
      default: null,
      required: false
    },
    rejectRoute: {
      type: String,
      default: null,
      required: false
    },

    removeRoute: {
      type: String,
      default: null,
      required: false
    },
    blockRoute: {
      type: String,
      default: null,
      required: false
    },
    unblockRoute: {
      type: String,
      default: null,
      required: false
    }
  },

  setup(props, context) {
    const loader = setupDataLoader(context.root.$axios, props.endpoint, true)

    onMounted(loader.load)

    const search = ref('')
    const filter = ref(false)

    if (
      props.columns[props.columns.length - 1].text !== 'Action' &&
      props.action
    )
      props.columns.push({
        text: 'Action',
        value: 'action',
        sortable: false,
        filterable: false,
        align: 'center',
        width: '150px'
      })

    function handleCreateEvent() {
      context.root.$options.router.push(props.createRoute)
    }

    async function removeItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        await context.root.$axios.$delete(
          props.removeRoute.replace('$id', item.id)
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onDelete() != null) {
          this.onDelete()
        }
      }
    }
    async function approveItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        await context.root.$axios.$patch(
          props.approveRoute.replace('$id', item.id)
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onAccepted() != null) {
          this.onAccepted()
        }
      }
    }
    async function rejectItem(item) {
      const result = prompt(
        'Please provide reason for rejection!',
        'Credential are not according to our policy!'
      )
      if (result != null && result !== '') {
        await context.root.$axios.$patch(
          props.rejectRoute.replace('$id', item.id),
          {
            message: result
          }
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onRejected() != null) {
          this.onRejected()
        }
      } else if (result === '') {
        await context.root.$axios.$patch(
          props.rejectRoute.replace('$id', item.id)
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onRejected() != null) {
          this.onRejected()
        }
      }
    }
    async function blockItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        await context.root.$axios.$patch(
          props.blockRoute.replace('$id', item.id)
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onBlock != null) {
          this.onBlock()
        }
      }
    }
    async function unblockItem(item) {
      window.console.log(item)
      if (confirm('Are you sure?')) {
        await context.root.$axios.$patch(
          props.unblockRoute.replace('$id', item.id)
        )
        loader.data.value.splice(loader.data.value.indexOf(item), 1)
        if (this.onUnblock != null) {
          this.onUnblock()
        }
      }
    }

    function returnBack() {
      this.$router.back()
    }
    function changeItem(item) {
      context.root.$options.router.push(
        props.changeRoute.replace('$id', item.id)
      )
    }
    function detailItem(item) {
      if (this.detail) {
        context.root.$options.router.push(
          props.detailRoute.replace('$id', item.id)
        )
      }
    }

    return {
      search,
      filter,
      ...loader,
      removeItem,
      unblockItem,
      returnBack,
      changeItem,
      detailItem,
      blockItem,
      approveItem,
      rejectItem,
      date: (date) => moment(date).format('MMMM Do YYYY'),
      handleCreateEvent
    }
  }
})
</script>

<style lang="sass">
.data-viewer
  width: 100% !important
.theme--light.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
 background: #fff !important
</style>
