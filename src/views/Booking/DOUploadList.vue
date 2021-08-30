<template>
  <div class="container">
    <h1>Delivery Note List</h1>
    <b-media>
      <b-row v-for="(image, i) of images" :key="i" sm="10" md="6">
        <div class="container pt-3">
          <h4>
            <b>{{ image.DO }}</b>
          </h4>
          <b-btn size="sm" @click.stop="packOrder(image)">Edit</b-btn>
          <p>{{ image.caption }}</p>
        </div>
        <b-col
          v-for="(a, index) in image.filename"
          :key="index"
          cols="12"
          sm="5"
          md="2"
        >
          <div class="card">
            <img :src="prefix + a" class="mt-3" width="100px" style="width:100%" />
          </div>
          <!-- :src="'http://localhost:5000/api/image/image/' + a" -->
        </b-col>
      </b-row>
      <b-col v-if="images.length === 0" class="text-center">
        <font size="5" color="red"
          >Doh! Looks like you haven't uploaded any DN.</font
        >
        <br />
        <b-btn
          size="md"
          variant="primary"
          @click="uploadImages()"
          class="cursor"
          >Upload images</b-btn
        >
      </b-col>
    </b-media>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ImageList',
  data() {
    return {
      prefix: `${process.env.VUE_APP_ROOT_API}/image/get/image/id/`,
      images: [],
      errors: []
    }
  },
  created() {
    this.getImages()
  },
  methods: {
    getImages() {
      axios
        .get(`${process.env.VUE_APP_ROOT_API}/booking_images`)
        .then(response => {
          this.images = response.data.images
        })
        .catch(e => {
          this.errors.push(e)
        })
    },

    uploadImages() {
      this.$router.push({
        name: 'ImageUpload'
      })
    },

    packOrder(data) {
      this.$router.push({
        name: 'InvoiceEdit',
        params: { id: data.DO }
      })
    }
  }
}
</script>

<style>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
}
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
}
.container {
  padding: 2px 16px;
}
</style>