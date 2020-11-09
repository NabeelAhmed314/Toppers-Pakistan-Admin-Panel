<template>
  <div style="padding: 25px">
    <div style="width: 50%">
      <v-form ref="form" class="my-range-picker-date">
        <v-text-field
          v-model="dates.from"
          :rules="[required]"
          dense
          type="date"
          aria-hidden="true"
          outlined
          label="From"
          @change="getCustom"
        />
        <v-text-field
          v-model="dates.to"
          :rules="[required]"
          aria-hidden="true"
          dense
          type="date"
          outlined
          label="To"
          @change="getCustom"
        >
          To
        </v-text-field>
      </v-form>
    </div>
    <div>Bottom</div>
  </div>
</template>

<script>
import { required } from '@/common/lib/validator'

export default {
  name: 'ProfitLossMain',
  data: () => {
    return {
      dates: {
        from: null,
        to: null
      },
      paid: 0,
      unpaid: 0
    }
  },
  methods: {
    required
  }
}
</script>

<style scoped>
.my-range-picker {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 70%;
  grid-column-gap: 15px;
}
.my-range-picker-date {
  display: flex;
  grid-column-gap: 15px;
}
.cards-payment {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  width: 70%;
  grid-column-gap: 15px;
}
@media (max-width: 799px) {
  .cards-payment {
    width: 100%;
  }
  .my-range-picker {
    width: 100%;
  }
}
</style>
