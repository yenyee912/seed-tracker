<template>
  <div class="content container">
    <h1 class="mb-3 mt-4">Cultivar Borrow Form</h1>
    <p>This form is to record the data of early harvest.</p>
    <div class="container-fluid">
      <b-row class="mb-3">
        <b-col cols="12" md="auto">
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Order Number"
            description="Order which borrow cultivar."
          >
            <b-form-input v-model="form.orderNumber"></b-form-input>

            <p
              v-if="
                !$v.form.orderNumber.required ||
                  !$v.form.orderNumber.maxLength ||
                  !$v.form.orderNumber.integer ||
                  !$v.form.orderNumber.minLength
              "
              class="error"
            >
              Please enter 4 digits only.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Farm Location"
          >
            <b-form-select
              v-model="form.farmLocation"
              :options="farmOpt"
            ></b-form-select>
            <p v-if="!$v.form.farmLocation.required" class="error">
              Please select a farm location.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Cultivar"
          >
            <b-form-select
              v-model="form.cultivarId"
              :options="cultivarOptions"
            ></b-form-select>
            <p v-if="!$v.form.cultivarId.required" class="error">
              Please select a cultivar.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Quantity"
          >
            <b-form-spinbutton
              id="sb-inline"
              v-model="form.quantity"
              inline
            ></b-form-spinbutton>
            <p v-if="!$v.form.quantity.required" class="error">
              Minimum quantity is required.
            </p>
            <p v-if="!$v.form.quantity.minQuantity" class="error">
              At least 1 head.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Rack No"
          >
            <b-form-input v-model="form.rackNo"></b-form-input>
            <p
              v-if="!$v.form.rackNo.integer || !$v.form.rackNo.required"
              class="error"
            >
              Please enter rack number.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Tier No"
          >
            <b-form-input v-model="form.tierNo"></b-form-input>
            <p
              v-if="!$v.form.tierNo.integer || !$v.form.tierNo.required"
              class="error"
            >
              Please enter tier number.
            </p>
          </b-form-group>

          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Original Harvest Date"
          >
            <b-form-datepicker
              v-model="form.originalDate"
              placeholder="Original Harvest Date"
              local="en"
            ></b-form-datepicker>
            <p v-if="!$v.form.originalDate.required" class="error">
              Please select the original harvest date.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Enter Modified Harvest Date"
          >
            <b-form-datepicker
              v-model="form.modifiedDate"
              placeholder="Modified Harvest Date"
              local="en"
            ></b-form-datepicker>
            <p v-if="!$v.form.modifiedDate.required" class="error">
              Please select the modified harvest date.
            </p>
          </b-form-group>
          <b-form-group
            id="fieldsetHorizontal"
            horizontal
            breakpoint="md"
            label="Person In Charge email (optional)"
          >
            <b-form-input v-model="form.consentTo"></b-form-input>

            <p v-if="!$v.form.consentTo.email" class="error">
              Invalid email format
            </p>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="mb-3">
        <form @submit.prevent="onSubmit">
          <b-btn @click="onSubmit" variant="warning">Submit</b-btn>
        </form>
      </b-row>
      <b-row class="mb-3">
        <div class="text-center" variant="danger">
          <b-alert
            v-for="(error, index) in errors"
            :key="index"
            :show="dismissCountDown"
            fade
            variant="danger"
            dismissible
            >{{ error.msg }}</b-alert
          >
        </div>
        <b-alert
          v-if="success"
          :show="dismissCountDown"
          fade
          variant="success"
          dismissible
          >{{ success }}</b-alert
        >
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

import {
  required,
  minValue,
  minLength,
  maxLength,
  integer,
  email
} from 'vuelidate/lib/validators'

export default {
  name: 'BorrowForm',
  data() {
    return {
      dismissCountDown: 5,
      success: '',
      errors: [],
      cultivarOptions: [],
      farmOpt: [],
      form: {
        cultivarId: '',
        name: '',
        quantity: 0,
        farmLocation: '',
        orderNumber: '',
        originalDate: '',
        modifiedDate: '',
        borrowedBy: localStorage.username,
        consentTo: '',
        rackNo: '',
        tierNo: ''
      }
    }
  },
 
  validations: {
    form: {
      cultivarId: { required },
      rackNo: { required, integer },
      tierNo: { required, integer },
      orderNumber: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(4),
        integer
      },
      farmLocation: { required },
      quantity: { required, minQuantity: minValue(1) },
      consentTo: { email },
      originalDate: { required },
      modifiedDate: { required }
    }
  },
  methods: {
    async callAPI(){
      this.getLocation()
      this.getCultivar()

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
              value: el.location
            })  
          });
      }
      }

      catch(err){
        this.errors.push(err.message)
      }
      
    },

    async getCultivar(){
      const x= await axios.get(`${process.env.VUE_APP_ROOT_API}/cultivars`)
      try{
        x.data.data.splice(0, 1, { id: '', name: 'Please select a cultivar.' })
        x.data.data.forEach(element => {
          this.cultivarOptions.push({ value: element.id, text: element.name })
        })
      }
      catch(e){
        this.errors.push(e)
      }

    },
    showAlert() {
      this.dismissCountDown = 6
    },

    // bindCultivar(id){
    //   console.log(id)
    //   return this.cultivarOptions.filter(el =>{
    //     return el.value==id
    //   })[0]

    // },

    async onSubmit() {
      // this.$v.form.$touch()
      if (this.$v.form.$error) return //no error
      console.log("failed: ",this.form)

      this.form.name= this.cultivarOptions.filter(el =>{
        return el.value==this.form.cultivarId
      })[0].text

      let ori= moment(this.form.originalDate, "YYYY-MM-DD").format("MM-DD-YYYY")
      let mod= moment(this.form.modifiedDate, "YYYY-MM-DD").format("MM-DD-YYYY")
      this.form.originalDate= ori
      this.form.modifiedDate= mod

      const x= await axios.post(`${process.env.VUE_APP_ROOT_API}/cultivars/borrow`, this.form)
      try  {
          this.success = x.data.msg
          setTimeout(function() {
            location.reload()
          }, 1500)
        }
        catch(err){
          if (err.response) {
            this.errors.push({ msg: x.data.msg })
          } 
          
          else if (err.request) {
            this.errors.push({ msg: err.request })
          } 
          
          else {
            this.errors.push({ msg: err.message })
          }
          // this.errors.push(error)
        }
    }
  }, 
  created() {
    this.callAPI()
  },
}
</script>

<style>
.Chart__container {
  margin-bottom: 100px;
}
</style>
