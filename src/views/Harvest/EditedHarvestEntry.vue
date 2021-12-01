<template>
  <div class="container">
    <b-row>
      <b-col cols="12">
        <h1 class="mb-3 mt-4">Harvest Entry
          <b-btn :to="'/list'" variant="info" class="m-3">Harvest List</b-btn>
        </h1>
        <template slot="header">{{harvest.name}}</template>
        <!-- <div>Harvest ID: {{harvest._id}}</div> -->
        <p>Farm Location: {{harvest.location}}</p>
        <p>Tier: {{harvest.tier}}</p>
        <p>Rack No: {{harvest.rackNo}}</p>
        <p>Experiment: {{harvest.experiment}}</p>
        <p>Germination Date: {{harvest.germinationDate}}</p>
        <p>Transplant Date: {{harvest.transplantDate}}</p>
        <p>Harvest Date: {{harvest.harvestDate}}</p>
        <div>
          <strong>Cultivar:</strong>
        </div>
        <div class="text-center mt-3">
          <b-table :items="harvest.cultivar" :fields="fields"
           hover responsive ></b-table>
        </div>
        <hr class="my-4" />
        <b-btn class="mr-3" variant="warning" @click.stop="editharvest(harvest._id)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deleteharvest(harvest._id)">Delete</b-btn>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      harvest: [],
      fields: [{
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
      },
      ]
    }
  },
  created() {
    axios
      .get(
        `${process.env.VUE_APP_ROOT_API}/harvest/transplant/${this.$route.params.id}`
      )
      .then(response => {
        this.harvest = response.data.data
      })
      .catch(e => {
        this.errors.push(e)
      })
  },
  methods: {
    editharvest(harvestid) {
      this.$router.push({
        name: 'HarvestEdit',
        params: { id: harvestid }
      })
    },
    deleteharvest(harvestid) {
      axios
        .delete(
          `${process.env.VUE_APP_ROOT_API}/harvest/transplant/${harvestid}` 
        )
        .then(() => {
          this.$router.push({
            name: 'HarvestList'
          })
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
}
</script>

