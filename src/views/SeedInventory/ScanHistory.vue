<template>
  <b-overlay :show="busy==true" class="container">
    <h1 class="mt-4 mb-3">Scan History</h1>
    <p>Scan records.</p>
    
    <div v-if="scanHistory.length>0" class="mt-3">
    <b-row class="mt-3">
      <b-col cols=7></b-col>
     <b-col><b-pagination v-model="currentPage"
      :total-rows="totalRow"
      :per-page="perPage"
      aria-controls="seed-table"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last" /></b-col>
    </b-row>
    
    <b-form-group label="Filter" label-cols-sm="1" content-cols-sm="3" label-align-sm="left">
      <b-form-input col v-model="filter" type="search" placeholder="Search by keyword..."></b-form-input>
    </b-form-group>

    <b-table id="history-table" class="text-center" :filter="filter"
    :items="scanHistory" responsive :fields="fields" 
    :per-page="perPage"
    :current-page="currentPage"
    >
      <template v-slot:cell(scanItem)="row">
        <b-btn size="sm" @click="row.toggleDetails" class="btn btn-success"
          >{{ row.detailsShowing ? 'Hide' : 'Show' }} Scan List</b-btn
        >
      </template>

      <template v-slot:cell(scanStatus)="row">
        <span v-if="row.item.scanStatus=='SUCCESS'">
          <b-badge variant="success">{{row.item.scanStatus}}</b-badge>
        </span>
        <span v-if="row.item.scanStatus=='PENDING'">
          <b-badge variant="warning">{{row.item.scanStatus}}</b-badge>
        </span>
        <span v-if="row.item.scanStatus=='FAILED'">
          <b-badge variant="danger">{{row.item.scanStatus}}</b-badge>
        </span>
      </template>

      <template v-slot:row-details="row">
        <b-card class="text-left" title="Feedback Message">
          <li v-for="x in row.item.feedbackMessage.uniqueFeedbackMsg" 
          :key="x.uniqueFeedbackMsg">{{x}}</li>
        </b-card>
        <b-card>
          <b-table
            :items="row.item.scanList"
            :fields="cardFields"
            responsive
            striped
            size="xs"
          >
          </b-table> 
          </b-card>
      </template>
    </b-table>

    <b-row class="mt-3">
     <b-col><b-pagination v-model="currentPage"
      :total-rows="totalRow"
      :per-page="perPage"
      aria-controls="seed-table"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last" /></b-col>
      <b-col cols=7></b-col>
    </b-row>

  </div>

  <div v-else class="error">
    No records found.
  </div>

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
      totalRow:0,
      
      filter: '',
      busy: true,
      scanHistory: [],
      cultivars:[],
      actions:[],
      locations:[],

      //table
      fields: [
        {
          key: 'timestamp',
          label: 'Scan Date/Time',
          sortable: true
        },

        {
          key: 'scanStatus',
          label: 'Scan Status',
          sortable: true
        },

        {
          key: 'staffEmail',
          label: 'Staff Email',
          sortable: true
        },
        {
          key: 'staffName',
          label: 'Staff Name',
          sortable: true
        },

        {
          key: 'displayAction',
          label: 'Action',
          sortable: true
        },
        {
          key: 'displayLocation',
          label: 'Scan Location',
          sortable: true
        },

        {
          key: 'scanItem'
        }
      ],

      cardFields: [
        {
          key: 'seedId',
          label: 'Seed ID',
          sortable: true
        },

        {
          key: 'displayCultivar',
          label: 'Cultivar',
          sortable: true
        },

        {
          key: 'quantity',
          label: 'Quantity (pkts)',
          sortable: true
        }
      ]
    }
  },

  methods: {
    async callAPI() {
      this.busy=true
      await this.getCultivar()
      await this.getAction()
      await this.getLocation()
      await this.getScanHistory()
      this.busy=false
    },

    async getCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        this.cultivars = x.data.data
      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

    async getAction() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/seed_inventory/actions`)
      try {
        this.actions = x.data.data
      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

    async getLocation() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try {
        this.locations = x.data.data
      } 
      catch (err) {
        console.log(err.message)
      }
    },

    bindCultivar(cultivar){
      return this.cultivars.filter(cul =>{
        return cul.id==cultivar
      })[0].name 
    },

    bindAction(action){
      return this.actions.filter(obj =>{
        return obj.id==action
      })[0].action      
  
    },

    bindLocation(location){
      return this.locations.filter(loc =>{
        return loc.id==location
      })[0].location 
    },

    async getScanHistory() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/seed_inventory/scans`)
      try {
        this.scanHistory = x.data.data
        for (let i=0; i<this.scanHistory.length; i++){
          for (let j=0; j<this.scanHistory[i].scanList.length; j++){
              this.scanHistory[i].scanList[j].displayCultivar= this.bindCultivar(this.scanHistory[i].scanList[j].cultivarId)
          }
          this.scanHistory[i].displayAction= await this.bindAction(this.scanHistory[i].action)
          this.scanHistory[i].displayLocation= await this.bindLocation(this.scanHistory[i].scanLocation)
        }
      
      this.totalRow=this.scanHistory.length

      } 
      
      catch (err) {
        console.log(err.message)
      }
    }
  },

  mounted() {
    this.callAPI()
  }
}
</script>

<style>
</style>