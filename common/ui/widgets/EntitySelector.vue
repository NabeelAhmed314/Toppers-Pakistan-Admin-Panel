<template>
  <div class="entity-selector">
    <v-dialog v-model="selectorOpened" width="600">
      <v-card class="selector">
        <v-card-title class="selector__title">
          {{ titleSelector }}
        </v-card-title>

        <v-card-subtitle class="selector__actions">
          <v-text-field
            v-model="search"
            dense
            filled
            outlined
            placeholder="Search"
            class="selector__search"
          />
          <v-btn icon class="selector__reload" @click="load(mapData)">
            <v-icon>mdi-reload</v-icon>
          </v-btn>
        </v-card-subtitle>

        <v-data-table
          :items="data"
          dense
          disable-pagination
          hide-default-footer
          :headers="columnsSelector"
        >
          <template v-slot:item.action="{ item }">
            <v-icon @click="addItem(item)">mdi-plus</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>

    <div class="selected">
      <v-card elevation="2">
        <v-data-table
          dense
          disable-sort
          disable-filtering
          disable-pagination
          hide-default-footer
          :headers="columnsSelected"
          :items="_selection"
        >
          <template v-slot:item.consumption="{ item }">
            <slot name="consumption" :bind="item">
              <select aria-hidden="true" v-model="item.consumption" style="width: 100%">
                <option>od</option>
                <option>bd</option>
                <option>td</option>
              </select>
            </slot>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon color="red" @click="removeItem(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
        <v-text-field
          v-model="_selection"
          class="selector__rules"
          :rules="[checkRequired]"
        />
      </v-card>

      <div class="selected__actions">
        <slot name="actions" />
        <v-btn elevation="0" color="green" dark small @click="openSelector">
          <v-icon small>mdi-magnify</v-icon> Search
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import {
  toRefs,
  reactive,
  onMounted,
  defineComponent
} from '@vue/composition-api'
import { setupDataLoader } from '../../lib/data-loader'

/**
 * @displayName EntitySelector
 *
 * @version 1.0.0
 * @author Arish Khan <arishsultan104@gmail.com>
 */
export default defineComponent({
  name: 'EntitySelector',

  props: {
    required: {
      type: Boolean,
      default: false
    },
    titleSelected: {
      type: String,
      required: true
    },
    titleSelector: {
      type: String,
      required: true
    },
    columnsSelector: {
      type: Array,
      default: () => []
    },
    columnsSelected: {
      type: Array,
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false
    },
    selection: {
      type: [Object, Array],
      default: null
    },
    endpoint: {
      type: String,
      required: true
    },
    map: {
      type: Function
    }
  },

  setup(props, context) {
    const selectorState = reactive({
      /** @type {string} */
      search: '',
      /** @type {any[]} */
      _selection: props.selection,
      /** @type {boolean} */
      selectorOpened: false
    })
    const loader = setupDataLoader(context.root.$axios, props.endpoint)

    function checkRequired(value) {
      if (props.required) {
        if (value && value.length > 0) return true
        else return 'Please provide a value'
      } else return true
    }

    const actionColumn = {
      text: 'Action',
      align: 'right',
      value: 'action',
      sortable: false,
      filterable: false
    }

    if (
      props.columnsSelector[props.columnsSelector.length - 1]?.text !== 'Action'
    ) {
      props.columnsSelector.push(actionColumn)
    }

    if (
      props.columnsSelected[props.columnsSelector.length - 1]?.text !== 'Action'
    ) {
      props.columnsSelected.push(actionColumn)
    }

    if (props.selected) {
      if (Array.isArray(props.selected)) {
        selectorState.selected = props.selected
      } else {
        selectorState.selected = [props.selected]
      }
    }

    function openSelector() {
      selectorState.selectorOpened = true
    }

    function removeItem(item) {
      if (props.multiple) {
        for (let i = 0; i < selectorState._selection.length; ++i) {
          if (selectorState._selection[i]._id === item._id)
            selectorState._selection.splice(i, 1)
        }
        context.emit('selected', selectorState._selection)
      } else {
        selectorState._selection = []
        context.emit('selected', null)
      }
    }

    function addItem(item) {
      if (props.multiple) {
        let found = false
        for (const _item of selectorState._selection) {
          if (_item._id === item._id) {
            found = true
            break
          }
        }
        if (!found) {
          if (props.map) {
            selectorState._selection.push(props.map(item))
          } else selectorState._selection.push(item)
          context.emit('selected', selectorState._selection)
        }
      } else {
        selectorState.selectorOpened = false
        if (props.map) selectorState._selection = [props.map(item)]
        else selectorState._selection = [item]
        context.emit('selected', item)
      }
    }

    function mapData(data) {
      for (const item of data) item.action = ''
      return data
    }

    onMounted(() => loader.load(mapData))

    return {
      addItem,
      mapData,
      ...loader,
      removeItem,
      openSelector,
      checkRequired,
      options: ['od', 'bd', 'td'],
      ...toRefs(selectorState)
    }
  }
})
</script>

<style lang="sass">
.selected
  .v-input__slot
    display: none !important
</style>
<style lang="sass" scoped>
.selector
  height: 500px

  &__title
    display: flex !important
    font-size: 25px !important
    padding-bottom: 30px !important
    justify-content: center !important
    font-family: google-sans, sans-serif !important

  &__rules
    top: 48px !important
    position: absolute !important

  &__actions
    height: 60px !important
    display: flex !important
    position: relative !important

  &__reload
    margin-left: 10px !important

  &__content
    height: fit-content !important
    border-top: 1px solid rgba(black, 0.14) !important

.selected
  position: relative !important

  &__content
    border-radius: 8px
    border: 1px solid rgba(black, 0.14) !important

  &__actions
    display: flex !important
    padding: 10px 0 !important
    justify-content: flex-end !important
</style>
