<template>
  <b-overlay :show="busy == true" class="container">
    <h1 class="mt-4 mb-3">HQ Seed Inventory</h1>
    <p>Inventory level of seeds in HQ.</p>

    <div v-if="invList.length > 0">
      <b-row class="mt-3">
        <b-col cols="7"></b-col>
        <b-col
          ><b-pagination
            v-model="currentPage"
            :total-rows="totalRow"
            :per-page="perPage"
            aria-controls="hqInv-table"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
        /></b-col>
      </b-row>
      <b-form-group
        label="Filter"
        label-cols-sm="1"
        content-cols-sm="3"
        label-align-sm="left"
      >
        <b-form-input
          col
          v-model="filter"
          type="search"
          placeholder="Search by keyword..."
        ></b-form-input>
      </b-form-group>
      <b-table
        id="hqInv-table"
        :per-page="perPage"
        :current-page="currentPage"
        :filter="filter"
        class="text-center"
        :fields="fields"
        :items="invList"
        responsive
        v-show="invList.length"
      >
        <template v-slot:cell(quantity)="row">
          {{ row.item.quantity }}
          <b-badge v-show="row.item.isLow == true" variant="danger"
            >Low</b-badge
          >
        </template>
      </b-table>

      <b-row class="mt-3">
        <b-col cols="7"></b-col>
        <b-col
          ><b-pagination
            v-model="currentPage"
            :total-rows="totalRow"
            :per-page="perPage"
            aria-controls="hqInv-table"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
        /></b-col>
      </b-row>
    </div>

    <div v-else class="error">No records found.</div>
  </b-overlay>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      // pagination
      perPage: 8,
      currentPage: 1,
      totalRow: 0,

      filter: '',

      busy: true,
      locations: [],
      cultivars: [],
      seedStatus: [],
      invList: [],
      fields: [
        {
          key: 'seedId',
          label: 'ID',
          sortable: true,
        },

        {
          key: 'displayCultivar',
          label: 'Cultivar',
          sortable: true,
        },

        {
          key: 'quantity',
          label: 'Quantity (pkts)',
          sortable: true,
        },

        {
          key: 'displayDestination',
          label: 'Current Destination',
          sortable: true,
        },

        {
          key: 'displayStatus',
          label: 'Status',
          sortable: true,
        },
      ],
    }
  },

  methods: {
    async callAPI() {
      this.busy = true
      await this.getLocation()
      await this.getCultivar()
      await this.getStatus()
      await this.getInventoryList()
      this.busy = false
    },

    // main caller
    async getInventoryList() {
      // hq id==1
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory?location=1`
      )
      try {
        // only show in office--> in-transit
        this.invList = x.data.data.filter((item) => {
          return item.status >= 4
        })
        await this.checkInventory(this.locations[1].alert, this.invList)
        console.log(this.invList)
        this.invList = await this.bindAll(this.invList)

        this.totalRow = this.invList.length
      } catch (err) {
        console.log(err.message, x)
      }
    },

    async getStatus() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory/status`
      )
      try {
        this.seedStatus = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

    async getLocation() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try {
        this.locations = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

    async getCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        this.cultivars = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

    bindCultivarName(id) {
      return this.cultivars.filter((cul) => {
        return cul.id == id
      })[0].name
    },

    bindLocationName(id) {
      return this.locations.filter((loc) => {
        return loc.id == id
      })[0].location
    },

    bindStatusName(id) {
      return this.seedStatus.filter((state) => {
        return state.id == id
      })[0].status
    },

    async bindAll(arr) {
      let formattedArr = arr.map((obj) => {
        return {
          seedId: obj.seedId,
          quantity: obj.quantity,
          displayCultivar: this.bindCultivarName(obj.cultivarId),
          displayDestination: this.bindLocationName(obj.currentDestination),
          displayStatus: this.bindStatusName(obj.status),
          isLow: obj.isLow,
        }
      })

      return formattedArr
    },

    async checkInventory(minLevel, arr) {
      arr
        .filter(({ quantity }) => quantity <= minLevel)
        .map((item) => (item.isLow = true))

      // return completeList
    },
  },

  mounted() {
    this.callAPI()
  },
}
</script>

<style>
</style>