<template>
  <b-container v-if="msg&&busy==false">
    <h4 class="mt-4 mb-3">Seed Entry</h4>  
    <b-alert dismissible variant="success" :show="msg!=''">{{msg}}</b-alert>
    <b-btn class="btn-info m-2" to="/seed/new" type="submit">Add New Entry</b-btn>
    <b-btn class="btn-warning m-2" @click="editSeed()">Edit</b-btn>
    <b-btn class="btn-danger m-2" @click.prevent="deleteSeed" type="submit">Delete Entry</b-btn>
    <b-btn class="btn-success m-2" to="/seed/list" type="submit">Seed List</b-btn>
    <hr />
    <h5>Seed Details</h5><br>
    <b-row>
      <b-col lg=2><b>Scientific Name:</b></b-col>
      <b-col lg=6>{{ seedEntry.scientificName }}</b-col>
    </b-row><br>

    <b-row>
      <b-col lg=2><b>Cultivar:</b></b-col>
      <b-col lg=6>{{ seedEntry.displayCultivar}}</b-col>
    </b-row><br>

     <b-row>
      <b-col lg=2><b>Brand:</b></b-col>
      <b-col lg=6>{{ seedEntry.brand}}</b-col>
    </b-row><br>

    <b-row>
      <b-col lg=2><b>Quantity per packet:</b></b-col>
      <b-col lg=6>{{ seedEntry.quantity}} pcs</b-col>
    </b-row><br>

     <b-row>
      <b-col lg=2><b>Description:</b></b-col>
      <b-col lg=6>{{ seedEntry.description}}</b-col>
    </b-row><br>

    <b-row>
      <b-col lg=2><b>URL:</b></b-col>
      <b-col lg=6>{{ seedEntry.url}}</b-col>
    </b-row><br>

    <hr />
    <h5>Seed Packaging Details</h5><br>
    <b-row>
      <b-col lg=2><b>Height:</b></b-col>
      <b-col lg=6>{{ seedEntry.height}} cm</b-col>
    </b-row><br>

    <b-row>
      <b-col lg=2><b>Width:</b></b-col>
      <b-col lg=6>{{ seedEntry.width}} cm</b-col>
    </b-row><br>

    <b-row>
      <b-col lg=2><b>Packaging Image:</b></b-col>
      <b-col lg=6>
        <b-img
          class="image-seed"
          close-on-background-click="true"
          :src="prefix + seedEntry.imageName"
          v-if="seedEntry.imageName"
        />

        <p v-else>No image data</p></b-col>
    </b-row><br>
  </b-container>
</template>

<script>
import axios from "axios";

export default {
  name: "editedSeedEntry",
  data() {
    return {
      busy:true,
      seedEntry: {},
      cultivarOptions: [],
      msg: this.$route.params.msg,
      prefix:'',

    };
  },
  methods: {
    async callAPI() {
      this.busy=true
      await Promise.all([
        this.getCultivar(),
        this.getSeed()
      ]);
      this.busy=false   
    },

    async getSeed() {
      const x = await axios.get(`${process.env.VUE_APP_ROOT_API}/seeds/${this.$route.params.id}`);
      try {
        this.seedEntry = x.data.data;
        this.seedEntry.displayCultivar= this.cultivars.filter(el =>{
          return el.id==this.seedEntry.cultivarId
        })[0].name
      } catch (err) {
        console.log(err.message);
      }
    },

    async getCultivar() {
      try {
        const x = await axios.get(
          `${process.env.VUE_APP_ROOT_API}/cultivars`
        );
        this.cultivars=x.data.data
        
      } catch (err) {
        console.log(err.message);
      }
    },

    async editSeed(){
      this.$router.push({
        name:'EditSeed',
        params: {id: this.seedEntry.seedId}
      })

    },

    async deleteSeed() {
      const x= await axios.delete(`${process.env.VUE_APP_ROOT_API}/seeds/${this.seedEntry.seedId}`)
      try{
        this.$router.push({name: 'SeedList', params: {msg: x.data}});
      }
      catch(err){
        console.log(err.message);
      }
    },
  },

  mounted() {    
    this.prefix = `${process.env.VUE_APP_API_URL}/image/`
    this.callAPI();
  }
};
</script>

<style>

</style>
