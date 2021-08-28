<template>
    <b-container>
    <h1 class="mb-3 mt-4">Location List</h1>
        <p>Alert subscription for farms and HQ.</p>
        <b-table :items="allLocation" :fields="fields" responsive class="text-center">
            
            <template v-slot:cell(isSubscribe)="row">
            {{ allLocation[row.index].isSubscribe ? 'Subscribed' : 'Unsubscribe' }} 
            </template>

            <template v-slot:cell(editDetails)="row">
            <b-btn size="sm" @click="row.toggleDetails" variant="warning" 
            @click.prevent="editLocation(row.item.id)">Edit</b-btn>
            </template>

        </b-table>

        <b-overlay :show="isBusy == true" no-wrap></b-overlay>
    </b-container>
  
</template>

<script>
import axios from "axios"

export default {
    data(){
        return{
            isBusy: false,
            allLocation:[],
            fields:[               
                {
                    label: 'Id',
                    key:'id',
                    sortable: true
                },
                {
                    label:'Location Name',
                    key: 'location',
                    sortable: true
                },
                {
                    label:'Minimum Seed Packet Quantity',
                    key: 'alert',
                    sortable: true
                },
                {
                    label:'Alert Subscription',
                    key: 'isSubscribe',
                    sortable: true
                },
                {
                    label: 'Edit',
                    key:'editDetails',
                },
            ]

        }
    },

    methods:{
        async callAPI(){
            this.isBusy= true
            await this.getLocations()
            this.isBusy= false

        },

        async getLocations(){
            const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/locations`)
            try{
                this.allLocation= x.data.data
                this.allLocation.shift()
            }

            catch(err){
                console.log(err.message)
            }
        },

        async editLocation(id){
            this.$router.push({
                name:'EditLocation',
                params: {id: id}
            })
        }

    },

    mounted(){
        this.callAPI()
    }

}
</script>

<style>

</style>