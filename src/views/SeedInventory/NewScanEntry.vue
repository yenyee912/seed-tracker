<template>
  <b-overlay :show="busy==true" class="container">
    <h1 class="mt-4 subheading-font">New Scan Entry</h1>
    <p>Please verify your scan details.</p>
    <hr>
    <p >Scan status:
      <b-badge variant="success" v-if="record.scanStatus=='SUCCESS'">{{ record.scanStatus }}</b-badge>      
      <b-badge variant="warning" v-else-if="record.scanStatus=='PENDING'"> {{ record.scanStatus }}</b-badge>
      <b-badge variant="danger" v-else-if="record.scanStatus=='FAILED'"> {{ record.scanStatus }}</b-badge>
    </p>
    <!-- <p>Record ID: {{ record._id }}</p> -->
    <p>Staff in Charged: {{ record.staffName }} - {{ record.staffEmail }}</p>
    <p>Action: {{ record.action }}</p>
    <p>Scan location: {{ record.scanLocation }}</p>
    <p>Scan destination: {{ record.scanDestination}}</p>

    <h5 class="subheading-font">Scan List Entry</h5>
    <p>Items scanned.</p>
    <b-table :items="record.scanList" fixed :fields="fields" class="text-center">
    </b-table>

  </b-overlay>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      busy: true,
      fields: [
        {
          key: 'seedId',
          label: 'SeedId',
          sortable: true
        },

        {
          key: 'quantity',
          label: 'Quantity',
          sortable: true
        },

        {
          key: 'displayCultivar',
          label: 'Cultivar',
          sortable: true
        },

        {
          key: 'uniqueStatus',
          label: 'Item Status',
          sortable: true

        },


      ],
      record: {},
      seeds:[],
      cultivars:[],
      locations:[],
      actions:[],
      msg: this.$route.params.msg,
        // {scanMsg: this.$route.params.msg.scanMsg,}
      
    }
  },
  methods: {
    async callAPI(){
      this.busy=true
      await this.getCultivar();
      await this.getLocation();
      await this.getAction();

      await this.getScanEntry(this.$route.params.id)
      this.busy=false
    },

    async getScanEntry(recId) {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory/scans/${recId}`
      )
      try {
        // scan API id not returning in data:{} format --> too much parameters
        this.record = x.data
        if (this.record.feedbackMessage)             
          await this.bindUniqueStatus()
   
        this.record.scanList= await this.bindSeedDetails(this.record.scanList);
        
        await this.bindActionAndLocation(this.record.action, this.record.scanLocation, this.record.scanDestination)
      } 
      
      catch (err) {
        console.log(err.message)
      }
    },

     async getSeed() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seeds`
      )
      try {
        this.seeds = x.data.data
      } catch (err) {
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

    async getAction() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory/actions`
      )
      try {
        this.actions = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

    async getLocation() {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/locations`
      )
      try {
        this.locations = x.data.data
      } catch (err) {
        console.log(err.message)
      }
    },

     bindSeedDetails(arr){
      for (let i=0; i< arr.length; i++){
        for (let j=0; j<this.cultivars.length; j++){
          if (arr[i].cultivarId ==this.cultivars[j].id ){
              arr[i].displayCultivar= this.cultivars[j].name       
          }
        }
      }
      return arr
    },

    async bindUniqueStatus(){
      // console.log(this.record.feedbackMessage.successRecord)
      if (this.record.scanStatus=='FAILED'){
        this.record.scanList.forEach(element => {
          element.uniqueStatus='FAILED'
        });
      }

      else if (this.record.scanStatus=='SUCCESS'){
        this.record.scanList.forEach(element => {
          element.uniqueStatus='SUCCESS'
        });
      }

      else if (this.record.scanStatus=='PENDING'){
        for (let i=0; i< this.record.feedbackMessage.successRecord.length; i++){
        for (let j=0; j< this.record.scanList.length; j++){
          if (this.record.scanList[j].seedId==this.record.feedbackMessage.successRecord[i].seedId){
            this.record.scanList[j].uniqueStatus='SUCCESS'
          }

          else{
            this.record.scanList[j].uniqueStatus='FAILED'
          }
        }
      } 
     }
     
    },

    bindActionAndLocation(action, location, destination){
      this.actions.forEach(element => {
        if( action==element.id)
          this.record.action= element.action
      })

      this.locations.forEach(element => {
        if( location==element.id)
          this.record.scanLocation= element.location

          if(destination==element.id)
          this.record.scanDestination= element.location
      })
    },

  },

  mounted() {
   this.callAPI()

  }
}
</script>

<style>

.subheading-font {
  font-family: 'Nunito', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2bb573;
  margin-top: 40px;
}

.subheading-font2 {
  font-family: 'Nunito', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: red;
  margin-top: 40px;
}

</style>