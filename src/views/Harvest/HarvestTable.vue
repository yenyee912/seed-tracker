<template>
  <div class="content container">
    <h1 class="mb-3 mt-4">Crops</h1>
    <div>    
      <!-- {{form}}     -->
      <b-row class="mb-3">
          <b-col cols=3>
            Date
            <b-form-datepicker
              v-model="form.startDate"
              placeholder="Date"
            ></b-form-datepicker>
          </b-col>
          <b-col cols=3>
            Type of Date
          <b-form-select :options="typeOfDate" v-model="form.typeOfDateSelected"></b-form-select>
          </b-col>
          <b-col cols=3>
            Farm Location
          <b-form-select :options="farmOpt" v-model="form.selectedFarm"></b-form-select>
          </b-col>
          <b-col cols=3>
            <b-btn class="mt-3" variant="success" @click="requestData">Request Data</b-btn>
          </b-col>
        </b-row>
    </div>

    <div v-if="harvest.length>0">
        <!-- <h5>{{this.form.typeOfDateSelected}} List on {{form.startDate}}</h5> -->
        <b-table class="text-center" hover responsive :items="harvest"></b-table>
    </div>

    <p class="error text-center mt-4">{{noDataMsg}}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form:{
        startDate: '',
        typeOfDateSelected: '',
        selectedFarm: '',

      },      
      harvest: [],
      noDataMsg: '',

      busy: false,
      
      loaded: false,
      showError: false,
      nodataError: false,
      errorMessage: 'Please enter field',
      typeOfDate: [
        {
          value: '',
          text: 'Please select type of date.'
        },
        {
          value: 0,
          text: 'Germination'
        },
        {
          value: 1,
          text: 'Transplant'
        },
        {
          value: 2,
          text: 'Harvest'
        }
      ],
      farmOpt: []
    }
  },
  methods: {
    resetState() {
      this.loaded = false
      this.showError = false
    },

    async getLocation(){
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try{
        if (x.data.data.length>0){
          x.data.data.splice(0,2)
          this.farmOpt.push({text: 'Please select a farm.', value: ''})
          x.data.data.forEach(el => {
            this.farmOpt.push({
              text: el.location,
              value: el.id
            })  
          });
      }
      }

      catch(err){
        this.errors.push(err.message)
      }
      
    },

    async requestData() {
      this.busy = true

      this.harvest=[]
      this.noDataMsg=''
      // if (
      //   this.startDate === null ||
      //   this.endDate === '' ||
      //   this.typeOfDateSelected === '' ||
      //   this.farmIDSelected === ''
      // ) {
      //   this.showError = true
      //   this.busy = false
      //   return
      // }
      // let startDate = moment(this.startDate, 'YYYY-MM-DD').format("MM-DD-YYYY")
      // this.resetState()
      const x= await axios.get(
          `${process.env.VUE_APP_ROOT_API}/harvest?startDate=${this.form.startDate}&endDate=${this.form.startDate}&typeOfDate=${this.form.typeOfDateSelected}&farmLocation=${this.form.selectedFarm}`
        )

      try{
        if(x.data.msg){
            this.noDataMsg= x.data.msg
        }

        else{
            this.harvest = x.data.data
        }
      }  
      catch(err) {
        console.log(err.message)
      }
    },

    toggleBusy() {
      this.isBusy = !this.isBusy
    }
  },

  mounted(){
    this.getLocation()
  }
}
</script>

<style>
.Chart__container {
  margin-bottom: 100px;
}
</style>
