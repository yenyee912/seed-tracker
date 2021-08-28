<template>
  <b-container>
    <h1 class="mb-3 mt-4">Edit Location Entry 
      <b-btn variant="info" class="m-2" to="/locationList">Location List</b-btn>
    </h1>  
    <hr>
    <b-form class="col-xs-12 col-lg-8 col-md-12">
      <b-form-group label="*Location" label-cols-lg="3">
        <b-form-input v-model="currentLocation.location"></b-form-input>
        <p v-if="!$v.currentLocation.location.required" class="error">Location name is required.</p>      
      </b-form-group>
      
      <b-form-group label="*Alert Subscription" label-cols-lg="3">
        <b-form-radio-group
          :options="options"
          v-model="currentLocation.isSubscribe">        
        </b-form-radio-group>
        <p v-if="$v.currentLocation.isSubscribe.$error" class="error">Please select an option.</p>      
        </b-form-group>
      
      <b-form-group label="*Minimum Seed Packet Quantity" description="To trigger alert email" label-cols-lg="3">
        <b-form-input
          v-model="currentLocation.alert"
          type="number"
        ></b-form-input>
      <p v-if="!$v.currentLocation.alert.required" class="error">Minimum quantity is required.</p>      
      <p v-if="!$v.currentLocation.alert.minQuantity" class="error">At least 1 packet.</p>      
      </b-form-group>
      
      <b-form-group label="*Subscription Mail" label-cols-lg="3">
        <b-form-input v-model="currentLocation.subscriptionMail"></b-form-input>
      </b-form-group>
    </b-form>
    <b-btn variant="success" @click.prevent="submitData">Submit</b-btn>
  </b-container>
</template>

<script>
import axios from 'axios'
import { required, minValue } from "vuelidate/lib/validators";


export default {
  data() {
    return {
      currentLocation: [],
      options: [
        { text: 'Subscribe', value: true },
        { text: 'Unsubscribe', value: false },
      ],
    }
  },

  validations: {
    currentLocation: {
      location: { required },
      alert: { required, minQuantity: minValue(1) },
      isSubscribe: { required },
      subscriptionMail: { required },
    }
  },

  methods: {
    async getCurrentLocation(id) {
      const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/locations/${id}`
      )

      this.currentLocation = x.data.data

    },

    async submitData(){
      let updateId= this.$route.params.id
      
      this.$v.currentLocation.$touch();

      if (this.$v.currentLocation.$error) return; //no error
      const x= await axios.put(`${process.env.VUE_APP_ROOT_API}/locations/${updateId}`, this.currentLocation)

      try{
          if (x.data){
            this.$router.push({
            name:'EditedLocationEntry',
            params: {msg: x.data.msg, data:x.data.data}
          })

          }
      }

      catch(err){
        console.log(err.message)

      }
    }
  },

  mounted() {
    this.getCurrentLocation(this.$route.params.id)
  },
}
</script>

<style>

.error{
  color: red;
  margin-top: 10px
}
</style>