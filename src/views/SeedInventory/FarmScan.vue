<template>
  <b-overlay :show="busy==true" class="container">
    <h1 class="subheading-font">Farm Seed Inventory</h1>
    
    <b-form class="details-font">
      <p class="date">Date</p>
      <p class="date-details">{{ formatDate() }}</p>
      <p class="staff">Staff Email</p>
      <p class="staff-details">{{ scan.staffEmail }}</p>
      <p class="staff">Staff Name</p>
      <p class="staff-details">{{ scan.staffName  }}</p>

      <b-form-group class="location" label="Farm Location*">
      <b-form-select
      :disabled="result.length>0"
      class="col-lg-4 drop-style"
      style="border-radius: 20px; padding-left: 15px; width: 300px;"
        v-model="scan.scanLocation"
        :options="locationOptions" size="md"
      ></b-form-select>
       <p v-if="$v.scan.scanLocation.$error" style="color:red">
          Farm location required.
        </p>    
      </b-form-group>

      <b-form-group class="location" label="Action*" >
      <b-form-select class="col-lg-4" :disabled="result.length>0"
      style="border-radius: 20px; padding-left: 15px; width: 300px;"
      :options="actionOptions" v-model="scan.action" size="md"></b-form-select>
      <p v-if="$v.scan.action.$error" style="color:red">
          Scan action required.
      </p>
      </b-form-group>

      <div style="text-align: center;" class="mt-2">
      <b-btn variant="info" class="mr-3" @click.prevent="getInventoryList">Request Data</b-btn> 
      <b-btn variant="warning"  @click.prevent="resetRequestData">Reset</b-btn> 
      </div>
    </b-form>

    <h3 class="subheading-font">Scan List</h3>
    <p class="" style="color:red">{{emptyAlert}}</p>
    <p class="mt-4 text-center" style="color:red">{{resultMsg}}</p>
    <b-table class="text-center" :fields="fields" :items="result" responsive v-show="result.length"> 
        
      <template v-slot:cell(addToList)="row">
       <b-form-checkbox :value="true" :unchecked-value="false" 
         v-model="cartList[row.index].addToCart"/>
        </template>

        <template v-slot:cell(scanItemQuantity)="row">
        <b-form-input v-model="cartList[row.index].quantity" type="number" step="1" 
         min=0 :max="row.item.quantity" v-show="cartList[row.index].addToCart==true && scan.action==3"  />
         <p v-show="cartList[row.index].addToCart==true && scan.action==4">1</p>
         <p style="color:red" v-show="cartList[row.index].addToCart==true && cartList[row.index].quantity<=0">{{itemAlert}}</p>
        </template>
    </b-table>

     <div style="text-align: center;" v-if="cartList.length>0">
      <b-btn variant="success" class="xs mt-2" @click.prevent="pushCartList">SUBMIT</b-btn> 
    </div>

    <b-alert v-show="scanFailAlert!=''" dismissible variant="danger">
      {{scanFailAlert}}
    </b-alert>
  </b-overlay>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import { required, minValue } from "vuelidate/lib/validators";

export default {
  data() {
    return {
       // GET
        busy: false,
        cultivars:[],
        result: [],
        resultMsg:'',
        fields: [
        {
          key: 'seedId',
          label: 'ID',
        },

        {
          key: 'displayCultivar',
          label: 'Cultivar',
        },

        {
          key: 'quantity',
          label: 'Quantity (pkts)',
        },

         {
          key: 'addToList',
          label: 'Add to List',
        },

        {
          key: 'scanItemQuantity',
          label: 'Scan Quantity (pkts)',
        },

      ], 
      
      // POST
        itemAlert:'', //for each item
        locationOptions:[],
        actionOptions: [],
        scanFailAlert:'',
        emptyAlert:'', //appear when items scanned has no quantity
        cartList:[],
        scan: {
            staffEmail: localStorage.email,
            staffName: localStorage.email,
            scanLocation:0,
            scanDestination:0,
            action:0,
            scanList: []
        },
    }
  },

  validations: {
    scan: {
      scanDestination:{required},
      scanLocation: {required, minValue: minValue(2) },
      action: {required, minValue: minValue(3) }, 
      scanList: {required, 
      //   $each: {
      //       seedId: {required},
      //       cultivarId: {required, minValue: 1},
      //       quantity: {required, minValue: 1}
      // }
      }
    }
   },

  methods: {
    async callAPI(){
        this.busy=true
        await Promise.all([
            this.getLocation(),
            this.getAction(),
            this.getCultivar()
        ]);
        this.busy = false
    },

    async getInventoryList() {
        let invFilter={
            status: 0,
            location:0,
            destination:0,
            action:0
        }
        this.result = []
        this.resultMsg = ''
        this.cartList = []

        if (this.scan.action==3){
// if farm-in, request seed data which is status=in-transit, location=remains in hq, destination=scanLocation
          invFilter.status=3        
          invFilter.location= 1
          invFilter.destination= this.scan.scanLocation

        }

        else if (this.scan.action==4){
// if farm-in, request seed data which is status=in-transit, location=remains in hq, destination=scanLocation
          invFilter.status=5 // or 6        
          invFilter.destination= 0  
          invFilter.location= this.scan.scanLocation

        }

        // console.log(this.invFilter)
        const x = await axios.get(
        `${process.env.VUE_APP_ROOT_API}/seed_inventory?status=${invFilter.status}&&location=${invFilter.location}&&destination=${invFilter.destination}`
        )
        try {                
            let tempArr = x.data.data
            if (tempArr.msg){
                this.resultMsg=tempArr.msg
            }

            else{
                this.result= await this.bindLocationAndCultivar(tempArr)
                for (let k=0; k<this.result.length; k++){
                    this.cartList.push({
                        seedId:this.result[k].seedId,
                        cultivarId: this.result[k].cultivarId,
                        quantity: 0,
                        addToCart: false
                        })
                }
            }
         
        } 
      
        catch (err) {
            console.log(err.message)
        }
    },

    async getLocation() {
    const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
      try {
        let tempArr = x.data.data            
        this.locationOptions.push({ value: 0, text: "Please select a farm location." })
        for (let i=2; i<tempArr.length; i++) {
          let location = tempArr[i].location
          let id = tempArr[i].id
          this.locationOptions.push({ value: id, text: location })
          }
      } 
      catch (err) {
        console.log(err.message)
        }
    },

    async getAction() {
    const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/seed_inventory/actions`)
      try {
        let tempArr = x.data.data            
        this.actionOptions.push({ value: 0, text: "Please select your action." })
        this.actionOptions.push({ value: 3, text: tempArr[3].action })
        this.actionOptions.push({ value: 4, text: tempArr[4].action})
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

    bindLocationAndCultivar(arr){
        for (let i=0; i<arr.length; i++){
            for (let k=0; k<this.cultivars.length; k++){
                if (arr[i].cultivarId == this.cultivars[k].id){
                arr[i].displayCultivar = this.cultivars[k].name
            }
            }
        }
      return arr
    },

    formatDate() {
      return (this.dateTime = moment().format('DD-MM-YYYY HH:mm:ss'))
    },

    resetRequestData(){
      this.scan.action=0
      this.scan.scanLocation=0,
      this.result=[]
    },

    async pushCartList(){
      this.itemAlert=''
      this.emptyAlert=''
      this.scan.scanList=[]

      this.cartList.forEach(element => {
          if(element.addToCart==true){
            if(this.scan.action==3){
              if(element.quantity>0){
                this.scan.scanList.push({
                  seedId: element.seedId,
                  cultivarId: element.cultivarId,
                  quantity: element.quantity
              })
              } 
              
              else{
                this.itemAlert='Please fill in the quantity'
              }
            }

            else if(this.scan.action==4){
              this.scan.scanList.push({
                  seedId: element.seedId,
                  cultivarId: element.cultivarId,
                  quantity: 1
              })
            }
          }     
      })
      // console.log(this.itemAlert)
      
      if (this.scan.scanList.length>0){
        await this.checkInput()
      }

      else{
        // console.log("No item scanned.")
        this.emptyAlert='Please complete the form.'
      }
    },

    async checkInput(){
      this.$v.scan.$touch();

       if (this.$v.$invalid || this.emptyAlert!='' || this.itemAlert!=''){
        //  console.log('Validation fail. Please try again.')
          this.emptyAlert='Please complete the form.'  
       }
                
      else{
        await this.submitScanList()
        // console.log("submit")
      }
    },

    async submitScanList() {
      const x= await axios.post(`${process.env.VUE_APP_ROOT_API}/seed_inventory/scans/`,this.scan)
      try{
        // console.log(x.data)
         this.$router.push(
          {name:'NewScanEntry',
          params: {id: x.data.scanRecordEntry._id, msg: x.data}
          })
      }
      catch(err){
        this.scanFailAlert='ERROR. Please check the form input again.'
        console.log(err.message, x)
      }
    },

  },

  computed:{
    

  },

  mounted() {
    this.callAPI()
  }
}
</script>

<style>
.title-font {
  font-family: 'Cooper Black', sans-serif;
  font-weight: bold;
  color: #2bb573;
  font-size: 40px;
  margin-top: 30px;
}

.subheading-font {
  font-family: 'Nunito', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: #2bb573;
  margin-top: 40px;
}

.details-font {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  margin-top: -8px;
  margin-left: 2px;
  font-weight: 500;
  /* text-align: center;
  line-height: 24px; */
  color: #28273d;
}

.details-font .date {
  margin-top: 20px;
  color: gray;
  letter-spacing: 1.2px;
}

.details-font .date-details {
  font-size: 16px;
  margin-top: -16px;
  font-weight: 600;
}

.details-font .staff {
  margin-top: -5px;
  color: gray;
  letter-spacing: 1.2px;
}

.details-font .staff-details {
  font-size: 16px;
  margin-top: -16px;
  font-weight: 600;
}

.details-font .status {
  margin-top: 30px;
  color: gray;
  letter-spacing: 1px;
}

.details-font .location {
  margin-top: 10px;
  color: gray;
  letter-spacing: 1px;
}

.details-font .seed {
  margin-top: 0px;
  color: gray;
  letter-spacing: 1px;
}

.details-font .quantity {
  margin-top: 0px;
  margin-bottom: -5px;
  color: gray;
  letter-spacing: 1px;
}

.loading-indicator {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  letter-spacing: 1.2px;
  text-align: center;
  margin-top: 135px;
}

.red-alert {
  margin-bottom: -10px;
  margin-top: -10px;
  color: red;
  font-weight: bold;
}

.yellow-alert {
  margin-bottom: -10px;
  margin-top: -10px;
  color: sienna;
  font-weight: bold;
}

.green-alert {
  margin-bottom: -20px;
  margin-top: 20px;
  color: green;
  font-weight: bold;
}

.on-scanner {
  margin-top: 10px;
  margin-bottom: -10px;
  max-height: 480px; 
  max-width: 480px; 
  width: 100%;
  height: 100%;
}

.off-scanner {
  margin-top: -40px;
  margin-bottom: 40px;
  /* height: 250px; 
  width: 250px;  */
  max-height: 480px; 
  max-width: 480px; 
  width: 100%;
  height: 100%;
  background-color: black;
}

.off-text {
  font-family: 'Nunito', sans-serif;
  padding-top: 120px;
  font-size: 14px;
  color: white;
  text-align: center;
  letter-spacing: 1px;
}

.off-text2 {
  font-family: 'Nunito', sans-serif;
  margin-top: -20px;
  margin-left: 3px;
  font-weight: bolder;
  letter-spacing: 2px;
  font-size: 26px;
  color: white;
  text-align: center;
}

.button-scan {
  font-family: 'Nunito', sans-serif;
  font-weight: 600!important;
  letter-spacing: 1px;
  border-radius: 50px!important;
  margin-top: -20px;
  margin-bottom: 0px;
  max-width: 120px;
  width: 100%;
}

/* .btn-block {
  max-width: 250px;
  width: 100%;
  text-align: center!important;
} */

.item-card {
  max-width: 350px;
  margin-top: 20px;
  margin-bottom: 18px;
  padding-left: 5px;
  padding-right: 5px;
  /* display: flex; */
  border-color: transparent!important;
  border-radius: 10px!important;
  box-shadow: 0.01px 1.5px 12px rgb(0,0,0,0.12)!important;
}

/* .entry-form {
  border-radius: 20px; padding-left: 15px; width: 300px;
}

.card-form {
  border-radius: 20px; 
  padding-left: 15px; 
  width: 290px;
} */

.delete {
  width: 20px;
  height: 20px;
}

/* .itemBg{
  background-color:#7fd3a1;
  padding-top:20px;
  padding-bottom: 20px; 
} */
</style>