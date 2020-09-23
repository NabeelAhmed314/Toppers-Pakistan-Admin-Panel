<template>
  <v-card class="data-viewer" elevation="8">
    <v-card-title class="data-viewer__title">
      <v-btn v-if="back" icon style="margin-right: 50px" @click="returnBack">
        <v-icon>mdi-keyboard-backspace</v-icon>
      </v-btn>
      <span>{{ title }}</span>
      <v-spacer />
      <v-btn
        v-if="this.data !== null && this.data.length !== 0"
        color="#FF974D"
        elevation="0"
        style="padding: 0 13px 0 7px !important; border-radius: 4px; margin-right: 10px"
        @click="generatePDF"
      >
        <v-icon small color="white">mdi-printer-eye</v-icon>
        <span style="margin-left: 10px;color:white">PDF</span>
      </v-btn>
    </v-card-title>

    <v-container
      style="padding: 20px;display: flex;align-items: start;justify-content: start"
    >
      <v-form ref="form" style="display: flex;align-items: start ">
        <v-text-field
          v-if="date"
          v-model="dateSend"
          style="margin-right: 10px"
          :rules="[required]"
          type="date"
          dense
          outlined
        />
        <v-text-field
          v-if="dateTo"
          v-model="dateToSend"
          style="margin-right: 10px"
          :rules="[required]"
          type="date"
          dense
          outlined
        />
        <v-text-field
          v-if="month"
          v-model="monthSend"
          style="margin-right: 10px"
          :rules="[required]"
          type="month"
          dense
          outlined
        />
        <v-text-field
          v-if="week"
          v-model="weekSend"
          style="margin-right: 10px"
          :rules="[required]"
          type="week"
          dense
          outlined
        />
        <v-text-field
          v-if="year"
          v-model="yearSend"
          style="margin-right: 10px"
          type="number"
          :rules="[yearValidator, required]"
          dense
          outlined
        />
        <v-btn
          v-if="date || week || year || month"
          color="primary"
          elevation="0"
          style="padding: 0 13px 0 7px !important; border-radius: 4px; margin-right: 10px"
          height="40"
          @click="generateSale"
        >
          <span>Generate</span>
        </v-btn>
      </v-form>
    </v-container>

    <v-data-table
      :headers="columns"
      :items="data"
      :dense="dense"
      disable-pagination
      hide-default-footer
      height="500"
      fixed-header
      class="data-table__content"
    >
      <template v-slot:item.createdAt="{ item }">
        <slot name="createdAt" :item="item" />
        {{ dateFormat(item.createdAt) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from 'moment'
import { yearValidator, required } from '../../utils/validators'
export default {
  name: 'DataViewerReportSale',
  props: {
    title: {
      type: String,
      required: true
    },
    dense: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    },
    back: {
      type: Boolean,
      default: false
    },
    endpoint: {
      type: String,
      required: true
    },
    all: {
      type: Boolean,
      default: false
    },
    date: {
      type: Boolean,
      default: false
    },
    dateTo: {
      type: Boolean,
      default: false
    },
    week: {
      type: Boolean,
      default: false
    },
    month: {
      type: Boolean,
      default: false
    },
    year: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    data: [],
    yearSend: new Date().getFullYear(),
    weekSend: '',
    dateSend: '',
    monthSend: '',
    dateToSend: ''
  }),
  mounted() {
    this.getProductWiseSaleReport()
    // if (this.all) {
    //   this.getAllOrdersReport()
    // } else if (this.date) {
    //   this.getDailyOrdersReport()
    // } else if (this.week) {
    //   this.getWeeklyOrdersReport()
    // } else if (this.month) {
    //   this.getMonthlyOrdersReport()
    // } else if (this.year) {
    //   this.getYearlyOrdersReport()
    // }
  },
  methods: {
    yearValidator,
    required,
    returnBack() {
      this.$router.back()
    },
    dateFormat: (date) => moment(date).format('MMMM Do YYYY'),
    generateSale() {
      if (this.$refs.form.validate()) {
        if (this.date && !this.dateToSend)
          this.getDailyOrdersReport(this.dateSend)
        else if (this.week) this.getWeeklyOrdersReport(this.weekSend)
        else if (this.month) this.getMonthlyOrdersReport(this.monthSend)
        else if (this.year) this.getYearlyOrdersReport(this.yearSend)
        else if (this.date && this.dateTo)
          this.getCustomOrdersReport(this.dateSend, this.dateToSend)
      } else {
        window.console.log('error')
      }
    },
    async getProductWiseSaleReport() {
      this.data = await this.$axios.$post('/reports/sales', {
        type: 'product',
        date: '08-23-2020',
        dateTo: '08-27-2020'
      })
      console.log(this.data)
    },
    async getDailyOrdersReport(dateSend) {
      if (dateSend) {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'daily',
          date: moment(dateSend).format('MM-DD-YYYY')
        })
      } else {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'daily',
          date: moment().format('MM-DD-YYYY')
        })
      }
    },
    async getWeeklyOrdersReport(weekSend) {
      if (weekSend) {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'weekly',
          date: moment(weekSend).week()
        })
      } else {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'weekly',
          date: moment().week()
        })
      }
    },
    async getMonthlyOrdersReport(monthSend) {
      if (monthSend) {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'monthly',
          date: moment(monthSend).month() + 1
        })
      } else {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'monthly',
          date: moment().month() + 1
        })
      }
    },
    async getYearlyOrdersReport(yearSend) {
      if (yearSend) {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'yearly',
          date: yearSend
        })
      } else {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'yearly',
          date: moment().year()
        })
      }
    },
    async getCustomOrdersReport(dateSend, dateToSend) {
      if (dateSend && dateToSend) {
        this.data = await this.$axios.$post('/reports/orders', {
          type: 'custom',
          date: moment(dateSend).format('MM-DD-YYYY'),
          dateTo: moment(dateToSend).format('MM-DD-YYYY')
        })
      }
    },
    generatePDF() {
      let win
      if (this.all) {
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=all',
          '_blank'
        )
      } else if (this.date && !this.dateTo) {
        const date = this.dateSend
          ? moment(this.dateSend).format('MM-DD-YYYY')
          : moment().format('MM-DD-YYYY')
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=daily&date=' +
            date,
          '_blank'
        )
      } else if (this.week) {
        const week = this.weekSend
          ? moment(this.weekSend).week()
          : moment().week()
        console.log(week)
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=weekly&date=' +
            week,
          '_blank'
        )
      } else if (this.month) {
        const month = this.monthSend
          ? moment(this.monthSend).month() + 1
          : moment().month() + 1
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=monthly&date=' +
            month,
          '_blank'
        )
      } else if (this.year) {
        const year = this.yearSend ? this.yearSend : moment().year()
        console.log(this.yearSend)
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=yearly&date=' +
            year,
          '_blank'
        )
      } else if (this.date && this.dateTo) {
        const date = this.dateSend
          ? moment(this.dateSend).format('MM-DD-YYYY')
          : moment().format('MM-DD-YYYY')
        const dateTo = this.dateToSend
          ? moment(this.dateToSend).format('MM-DD-YYYY')
          : moment().format('MM-DD-YYYY')
        win = window.open(
          'http://192.168.100.100:4000/reports/orders-report?type=custom&date=' +
            date +
            '&dateTo=' +
            dateTo,
          '_blank'
        )
      }
      win.focus()
    }
  }
}
</script>

<style lang="sass">
.date-picker
  padding-right: 10px
.data-viewer
  width: 100% !important
.theme--light.v-data-table tbody tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
  background: #fff !important
</style>
