<template>
  <b-container>
    <h1 class="mb-3 mt-4">Transplant List</h1>
    <b-row>
      <b-col>
      <b-form-select :options="locationOpt" v-model="selectedFarm">
      </b-form-select>
      </b-col>
      <b-col>
        <b-btn @click.prevent="getAllHarvest()" variant="success">Request Data</b-btn>
      </b-col>
    </b-row>
    <hr />
    <div v-if="allHarvest.length>0">
    <b-table
      responsive
      striped
      hover
      :items="allHarvest"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :busy.sync="isBusy"
    >
      <!-- :sort-by.sync="sortBy" 
      :sort-desc.sync="sortDesc"-->
      <template v-slot:table-busy>
        <div class="text-center text-warning my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(cultivar)="row">
        <b-btn variant="outline-dark" size="sm" @click="row.toggleDetails"
          >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-btn
        >
      </template>
      <template v-slot:cell(action)="row">
        <b-btn size="sm" @click.stop="details(row.item)" variant="warning">Edit</b-btn>
      </template>
      <template v-slot:row-details="row">
        <b-card class="text-center">
          <b-table :items="row.item.cultivar" :fields="cultivarFields"></b-table>
        </b-card>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      first-number
      last-number
      align="center"
    ></b-pagination>
    </div>
    <div v-else class="error text-center">{{noHarvestMsg}}</div>

  </b-container>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // sortDesc: false,
      // sortBy: 'harvestDate',
      locationOpt: [],
      perPage: 10,
      currentPage: 1,
      isBusy: false,
      // Note 'isActive' is left out and will not appear in the rendered table
      fields: [
        {
          key: 'location',
          sortable: true
        },
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'rackNo',
          sortable: true
        },
        {
          key: 'tier',
          sortable: true
        },
        {
          key: 'germinationDate',
          sortable: true
        },
        {
          key: 'transplantDate',
          sortable: true
        },
        {
          key: 'harvestDate',
          sortable: true
        },
        {
          key: 'cultivar',
          sortable: false
        },
        {
          key: 'Action',
          sortable: false
        }
      ],
      cultivarFields:[{
        key:'id',
        sortable: true,
        label: 'Cultivar ID'
      },
      {
        key:'name',
        sortable: true,
        label: 'Cultivar Name'
      },
      {
        key:'quantity',
        label: 'Transplant Quantity',
        sortable: true,
      },
      {
        key:'nonSaleable',
        sortable: true,
        label: 'Non Saleable Quantity'
      }],
      allHarvest: [],
      cultivar: [],
      selectedFarm: 0,
      noHarvestMsg:''
    }
  },
  methods: {
    async callAPI(){
      this.getLocation()
    },

    details(harvest) {
      this.$router.push({
        name: 'HarvestEdit',
        params: { id: harvest._id }
      })
    },

    async getAllHarvest(){
      this.isBusy = true
      this.allHarvest= []
      this.noHarvestMsg= ''
      
      const x= await axios.get(`${process.env.VUE_APP_ROOT_API}/harvest/transplant?location=${this.selectedFarm}`)
      try{
        if(x.data.msg){
          this.noHarvestMsg = x.data.msg
        }

        else if(x.data.data.length>0){
          this.allHarvest = x.data.data
        }

        this.isBusy = false
      }

    catch(err){
        console.log(err.message)
    }
    },

    async getLocation(){
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try{
        if (x.data.data.length>0){
          x.data.data.splice(0,2)
          this.locationOpt.push({text: 'Please select a farm.', value: 0})
          x.data.data.forEach(el => {
            this.locationOpt.push({text: el.location, value: el.id}
          )  
          });
      }
      }

      catch(err){
        console.log(err.message)
      }
      
    }
  },
  computed: {
    rows() {
      return this.allHarvest.length
    }
  },
  mounted(){
    this.callAPI()
  }
}
</script>

<style scoped></style>
