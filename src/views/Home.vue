<template>
  <div>
    <div class="text-center">
      <b-jumbotron class="intro" text-variant="white">
        <template v-slot:header>
          <strong>The Future of Farming</strong>
        </template>

        <template v-slot:lead class="my-3">
          <b>
            We are charting a new course in precision and productivity through controlled environment farming.
            <br />We call this our Machine Farm. Our tech enables the right balance of flavour, freshness and nutrition
            <br />whilst creating a more sustainable approach to growing food.
          </b>
        </template>
      </b-jumbotron>
    </div>
    <div class="text-center">
      <h2>What We Do?</h2>
    </div>
    <div class="container">
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
        :interval="4000"
      >
        <b-carousel-slide
          id="slide 1"
          caption="Clean Food"
          text="Grown into clean, nutritious & tasty greens."
          :img-src="'/assets/home/plant-1-1.webp'"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Controlled Environment"
          text="Our farm uses 95% less water and operates on a 365 day planting cycle."
          :img-src="'/assets/home/plant-1-2.webp'"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Consistent Quality"
          text="We took time to develop our technology and solutions, and today we are able to chart a new course in precision and productivity."
          :img-src="'/assets/home/plant-2-1.webp'"
        ></b-carousel-slide>
      </b-carousel>
    </div>
  </div>
</template>

<style>
.b-img {
  background-size: cover;
  background-position: center;
  max-width: 100%;
  height: auto;
}
.intro > h1 {
  padding-top: 9rem;
}
.intro {
  background-image: url('/assets/home/melawati2.webp');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 750px;
  margin-bottom: 4rem;
}

.carousel-inner > .carousel-item > img {
  margin: auto;
  display: block;
  max-width: 1000px;
  max-height: 500px;
  width: auto;
  height: auto;
}
.carousel-fade {
  margin-top: 4rem;
  margin-bottom: 4rem;
}
iframe {
  width: 1000px;
  height: 500px;
  margin-right: auto;
  margin-left: auto;
  display: block;
  margin: auto;
}
</style>
