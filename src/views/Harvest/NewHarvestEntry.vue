<template>
    <div class="container">
      <h1 class="mb-3 mt-4">New Transplant Entry
        <b-btn variant="info" to="/harvest/transplant">New Entry</b-btn>
      </h1>
      <div class="text-left">
        <!-- <div>Mongo ID: {{harvest._id}}</div> -->
        <p>Location: {{harvest.location}}</p>
        <p>Tier: {{harvest.tier}}</p>
        <p>Rack No: {{harvest.rackNo}}</p>
        <p>Experiment: {{harvest.experiment}}</p>
        <p>Germination Date: {{harvest.germinationDate}}</p>
        <p>Transplant Date: {{harvest.transplantDate}}</p>
        <p>Harvest Date: {{harvest.harvestDate}}</p>
        <p>
          <strong>Cultivar:</strong>
        </p>
        <div class="mt-3 text-center">
          <b-table responsive hover :items="harvest.cultivar" :fields="fields" class=".d-none"></b-table>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      dk: this.$route.params.id,
      harvest: {},
      fields: [
        {
          key: 'id',
          label: 'Cultivar ID',
          sortable: true
        },
        {
          key: 'name',
          label: 'Cultivar Name',
          sortable: true
        },
        {
          key: 'quantity',
          label: 'Transplant Quantity',
          sortable: true
        }
      ]
    }
  },

  methods:{
    async getTransplantRecord(){
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/harvest/transplant/${this.$route.params.id}`)

      try{
        if (x){
          this.harvest= x.data.data
        }
      }

      catch(err){
        console.log(err.message)
      }
    }
  },

  mounted(){
    this.getTransplantRecord()
  }
}
</script>

<style></style>
