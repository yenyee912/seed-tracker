<template>
  <div class="container">
    <h1 class="mt-4 mb-3">Farm Seed Inventory</h1>
    <b-form class="col-xs-12 col-lg-8 col-md-12">
      <b-form-group label="Farm" label-cols-lg="3">
        <b-form-select v-model="selectedFarm" :options="locationOptions" />
      </b-form-group>

      <div>
        <b-btn @click.prevent="getInventoryList" variant="success">Request Data</b-btn>
      </div>
    </b-form>

    <p v-if="invMsg" style="color:red" class="m-4 text-center">{{invMsg}}</p>

    <div v-if="invList.length>0">
    <b-row class="mt-3" >
      <b-col cols=7></b-col>
     <b-col><b-pagination v-model="currentPage"
      :total-rows="totalRow"
      :per-page="perPage"
      aria-controls="inventory-table"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last" /></b-col>
    </b-row>
      <b-form-group label="Filter" label-cols-sm="1" content-cols-sm="3" label-align-sm="left">
        <b-form-input col v-model="filter" type="search" placeholder="Search by keyword..."></b-form-input>
      </b-form-group>
    <b-table class="text-center" :fields="fields" id="inventory-table"
    :per-page="perPage" :current-page="currentPage" :filter="filter"
    :items="invList" responsive>
    <template v-slot:cell(quantity)="row">
      {{row.item.quantity}}
      <b-badge v-show="row.item.isLow==true" variant="danger">Low</b-badge>
    </template>
    </b-table>
    <b-row class="mt-3" >
     <b-col><b-pagination v-model="currentPage"
      :total-rows="totalRow"
      :per-page="perPage"
      aria-controls="inventory-table"
      first-text="First"
      prev-text="Prev"
      next-text="Next"
      last-text="Last" /></b-col>
    <b-col cols=7></b-col>
    </b-row>
    </div>
    <b-overlay :show="busy" no-wrap></b-overlay>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
        // pagination
        perPage: 5,
        currentPage: 1,
        totalRow:0,

        filter: '',

        // selections
        busy: true,
        selectedFarm:0,
        locationOptions: [],
        
        // data store
        locations:[],
        seedStatus:[],
        cultivars:[],

        invList: [],
        invMsg:'', // for no data
        fields: [
        {
          key: 'seedId',
          label: 'ID',
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
        },

        {
          key: 'displayStatus',
          label: 'Current Status',
          sortable: true
        },
      ]
    }
  },

  methods: {
    async callAPI(){
      this.busy=true
      await Promise.all([
        this.getLocation(),
        this.getCultivar(),
        this.getStatus()
      ]);
      this.busy=false
    },

    async getInventoryList() {
      this.invList=[]
      this.invMsg=''
      
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory?location=${this.selectedFarm}`
      )
      try {
        if (x.data.msg){
          this.invMsg=x.data.msg
        }

        else{
            this.invList= x.data.data.filter(item =>{
              return item.status >= 4
            })
            this.invList= await this.bindAll(this.invList)            
            this.totalRow=this.invList.length

            let selectedFarmAlert= await this.bindLocationDetails(this.selectedFarm)
            await this.checkInventory(selectedFarmAlert.alert, this.invList)
            

        }
      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

    async getLocation() {
    const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try {
        this.locations= x.data.data
        
        this.locationOptions.push({ value: 0, text: "Please select a farm location." })
        let formattedList = x.data.data.filter (obj =>{
          return obj.id >= 2
        })
        .map (item =>{
          return {
            id: item.id,
            location: item.location,
            alert: item.alert
          }
        })
        
        formattedList.forEach(element => {
          this.locationOptions.push({ value: element.id, text: element.location })
        });
      } 
      catch (err) {
        console.log(err.message)
        }
    },

    async getCultivar() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/cultivars`
      )
      try {
        this.cultivars = x.data.data
      } catch (err) {
        console.log(err.message)
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

    bindCultivarName(id){
      return this.cultivars.filter(cul =>{
        return cul.id==id
      })[0].name 
    },

    bindLocationName(id){
      return this.locations.filter(loc =>{
        return loc.id==id
      })[0].location 
    },

    // get full location
    bindLocationDetails(id){
      return this.locations.filter(loc =>{
        return loc.id==id
      })[0]
    },

    bindStatusName(id){
      return this.seedStatus.filter(state =>{
        return state.id==id
      })[0].status 
    },

    bindAll(arr){
        let formattedArr= arr.map(obj =>{
        return{
          seedId: obj.seedId,
          quantity: obj.quantity,
          displayCultivar: this.bindCultivarName(obj.cultivarId),
          displayStatus: this.bindStatusName(obj.status),
          isLow: obj.isLow
        }
      })
      
      return formattedArr
    },

    async checkInventory(minLevel, arr){
      arr.filter(({ quantity }) => quantity <= minLevel)
      .map((item) => item.isLow= true);    
    }
  },

  mounted() {
    this.callAPI()
  }
}
</script>

<style>
</style>