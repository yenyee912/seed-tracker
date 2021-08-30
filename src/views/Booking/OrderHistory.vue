<template>
  <b-container>
    <h1 class="mb-3 mt-4">Booking List</h1>
      <p>
        Please select the start <strong> delivery date</strong>  and end delivery date to view
        booking records.
      </p>

    <div class="m-2">
      <b-form>
        <b-form-group label-cols-lg="2" label="Start Date">
            <b-form-datepicker v-model="searchForm.startDate" class="col-4" />
            <p v-if="$v.searchForm.startDate.$error" class="error">Please select a start date.</p>
        </b-form-group>
        <b-form-group label-cols-lg="2" label="End Date">
            <b-form-datepicker v-model="searchForm.endDate" class="col-4" />
            <p v-if="$v.searchForm.endDate.$error" class="error">Please select a end date.</p>
        </b-form-group>
        <b-btn variant="success" @click="requestData">Request Data</b-btn>
      </b-form>
      <hr />
    </div>
    
    <div class="m-3">
      <b-table :items="booking" :fields="column" v-if="booking.length>0" hover responsive >
        <template v-slot:cell(show_details)="row">
          <b-btn size="sm" @click="row.toggleDetails" class="btn btn-success"
            >{{ row.detailsShowing ? 'Hide' : 'Show' }} Details</b-btn>
        </template>

        <template v-slot:row-details="row">
          <b-card class="text-center">
            <b-table :items="row.item.booking[0].itemOrdered" responsive :fields="cardFields"></b-table>
          </b-card>
        </template>

        <template v-slot:cell(action)="row">
          <b-btn size="sm" variant="warning" @click.stop="packOrder(row.item._id)">Fulfill</b-btn>
        </template>
      </b-table>
      <div v-else-if="booking" class="error text-center">{{msg}}</div>
    </div>

  </b-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      searchForm:{
        startDate: "",
        endDate: "",
      },
      booking: [],
      msg:'',
      column: [
        { key: 'DO', label: 'Reference Number(DO)', sortable: true },

        {
          key: 'orderDate',
          label: 'Order Date',
          sortable: true
        },

        {
          key: 'deliveryDate',
          label: 'Delivery Date',
          sortable: true
        },

        { key: 'remarks', label: 'Remarks' },

        {
          key: 'show_details'
        },

        {
          key: 'action',
          label: 'Action'
        }
      ],

      cardFields:[
        {key: 'id', label: 'Cultivar ID)'},
        {key: 'name'},
        {key: 'price', label: 'Price /kg'},
        {key: 'bookingWeight', label: 'Booking Weight (kg)'},
        {key: 'actualWeight', label: 'Fulfilled Weight (kg)'},
        {key: 'receivedWeight', label: 'Received Weight (kg)'}
      ],
      busy: false,
      loaded: false,
      showError: false,
      nodataError: false,
      errorMessage: 'Please enter field',
      nodataMessage: 'No data between this interval',
      farmIDSelected: '',
      farmLocation: [
        {
          id: 0,
          location: 'Langkawi'
        },
        {
          id: 1,
          location: 'Melawati'
        }
      ]
    }
  },

  validations:{
    searchForm:{
    startDate: { required },
    endDate: { required },
    }
  },

  methods: {
    async requestData() {
      this.nodataMessage= ''
      this.booking= []

      // this.$v.searchForm.$touch();

      if (this.$v.searchForm.$error) return; //no error
      // let qd1 = moment(this.searchForm.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
      // let qd2 = moment(this.searchForm.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')

      let qd1= "2020-08-15"
      let qd2= "2020-12-31"
      let query =`${process.env.VUE_APP_ROOT_API}/booking?startDate=${qd1}&endDate=${qd2}&location=3`


      const x = await axios.get(query)
      try {
        if(x.data.data.length>0){
          x.data.data.forEach(el => {
            el.orderDate= moment(el.orderDate, "MM-DD-YYYY").format("DD-MM-YYYY")
            el.deliveryDate= moment(el.booking[0].deliveryDate, "MM-DD-YYYY").format("DD-MM-YYYY")
          });
          this.booking = x.data.data

        }

        else
          this.msg='No record match the search.'
      } 
      
      catch (err) {
        this.errorMessage = err.response.data.error
        this.showError = true
        this.busy = false
      }
    },

    packOrder(orderId) {
      this.$router.push({
        name: 'OrderEdit',
        params: { id: orderId }
      })
    }
  },

  mounted() {}
}
</script>

<style scoped>
.no-margin {
  margin-left: 0px;
  margin-right: 0px;
}</style
>>
