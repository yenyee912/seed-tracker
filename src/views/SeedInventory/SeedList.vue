<template>
  <b-container>
    <h1 class="mt-4 mb-3">Seed List</h1>
    <div v-if="seeds.length">
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

    <b-table
      id="seed-table"
      :items="seeds"
      :fields="fields"
      :per-page="perPage"
      :current-page="currentPage"
      :filter="filter"
      responsive
      striped
      hover
      no-border-collapse
      class="text-center"
    >

      <template v-slot:cell(qr-code)="row">
        <div v-if="row.item.verify==true">
        <qrcode-vue :value="bindQR(row.item.seedId)" size="100" level="H"></qrcode-vue>
        <div>
          {{ row.item.displayCultivar }} <br />
          {{ row.item.seedId }}
        </div>
        </div>

        <div v-else>
            <b-badge variant="danger">New Seed</b-badge>
        </div>
      </template>

      <template v-slot:cell(show_details)="row">
        <b-btn size="sm" @click="row.toggleDetails" variant="success"
          >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-btn>
      </template>

      <!-- cards -->
      <template v-slot:row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Scientific Name:</b>
            </b-col>
            <b-col>{{ row.item.scientificName }}</b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Seed Packaging Size (Width/Height):</b>
            </b-col>
            <b-col> {{ row.item.height + ' / ' + row.item.width }} cm </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Seed Packaging:</b>
            </b-col>
            <b-col>
              <b-img
                class="image-seed"
                :src="prefix + row.item.imageName"
                v-if="row.item.imageName"
              />
              <p v-else>No image data</p>
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right">
              <b>Description:</b>
            </b-col>
            <b-col>{{ row.item.description }}</b-col>
          </b-row>

          <b-btn v-if="row.item.verify==false" size="sm" class="m-2" variant="success"
          @click="verifySeed(row.item)"
          >Verify</b-btn>

          <b-btn v-if="row.item.verify==false" size="sm" class="m-2" variant="warning"
          @click="editSeed(row.item.seedId)"
          >Edit</b-btn>

          <b-btn size="sm" variant="danger" @click="row.toggleDetails"
            >Hide Details</b-btn
          >
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
    <div v-else class="mt-2 error">No records found.</div>
    <b-overlay :show="busy == true" no-wrap></b-overlay>
  </b-container>
</template>

<script>
import axios from 'axios'
import QrcodeVue from 'qrcode.vue'

export default {
  components:{
    QrcodeVue
  },
  data() {
    return {
      // pagination
      perPage: 5,
      currentPage: 1,
      totalRow:0,

      filter: '',
      seeds: [],
      cultivars: [],
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
          key: 'brand',
          sortable: true
        },

        {
          key: 'quantity',
          label: 'Quantity per Packet (est)',
          sortable: true
        },

        {
          key: 'show_details'
        },

        {
          key: 'qr-code',
          label: 'QR Code',
          // sortable: true

        }
      ],

      busy: true,
      prefix: ''
    }
  },
  methods: {
    async callAPI() {
      this.busy = true
      await this.getCultivar()
      await this.getSeed()
      this.busy = false
    },

    async getCultivar() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try {
        this.cultivars = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

    async bindCultivarName(id){
      return this.cultivars.filter(obj => {
        return obj.id==id
      })[0].name

    },

    async getSeed() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seeds`
      )
      try {
        if(x.data.data.length>0){

          for(let i=0; i<x.data.data.length; i++){
            x.data.data[i].displayCultivar= await this.bindCultivarName(x.data.data[i].cultivarId)
          }

          this.seeds=x.data.data
          this.totalRow=this.seeds.length
        }

        
      } catch (err) {
        console.log(err.message)
      }
    },

    async verifySeed(seed){
      seed.verify= true
      
      const x = await axios.put(`${process.env.VUE_APP_ROOT_API}/seeds/${seed.seedId}`, seed)

      try{
        if(x.data.data.verify==true){
          this.$router.go()
        }
        else{
          seed.verify=false
        }

      }

      catch(err){
        console.log(err.message)
      }

    },

    async editSeed(seedId){
      this.$router.push({
        name: 'EditSeed',
        params: { id: seedId }
      })

    },

    bindQR(id) {
      let qrContent = {
          text: '',
          render: 'canvas',
          width: 100,
          height: 100,
          typeNumber: -1,
          correctLevel: 2,
          background: '#ffffff',
          foreground: '#000000'
        }
        this.seeds.forEach(element => {
          if (id == element.seedId) {
            let seedDetails = {
              id: element.seedId,
              brand: element.brand,
              cultivarId: element.cultivarId
            }
            qrContent.text = JSON.stringify(seedDetails)
            // console.log(qrContent.text)
          }
        })

      return qrContent.text
    }
  },

  computed:{


  },

  mounted() {
    this.prefix = `${process.env.VUE_APP_API_URL}/image/`
    this.callAPI()
  }
}
</script>

<style>
</style>
