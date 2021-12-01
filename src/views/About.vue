<template>
  <div>
    <div>
      <b-jumbotron class="jumbo" text-variant="light">
        <template v-slot:header>
          <strong>About Us</strong>
        </template>
        <template v-slot:lead>
          Our aim is to inspire communities to eat cleaner greens.
          <br />No chemicals, no nasties.
          <br />Just clean and packed with
          flavour.
        </template>
      </b-jumbotron>
    </div>
    <div class="container">
      <div class="mt-4">
        <b-card img-alt="Card image" img-right border-variant="white" align="center">
          <h4>Space efficient and scalable</h4>
          <b-card-text>Modular plant racking system enables a variety of cultivars to be planted, with the flexibility to scale up based on demand from the local communities we serve. When stacked 5 levels on a 360 square foot plot of land, our farms produce a yield of up to 1 acres of a traditional outdoor farm.</b-card-text>
        </b-card>

        <b-card img-alt="Card image" img-left class="mb-3" border-variant="white" align="center">
          <h4>Controlled lighting</h4>
          <b-card-text>Controlled and customised LED grow lights ensure optimal and balanced growing conditions for the plants.</b-card-text>
        </b-card>

        <b-card img-alt="Card image" img-right border-variant="white" align="center">
          <h4>Data and Analytics Driven</h4>
          <b-card-text>Live data feeds and analytics driven growing system guide crop cycles for optimal harvest. Our crop cycles are much faster and more frequent than traditional agriculture. The more we grow, the more data we collect, allowing us to optimise and automate key parts of the system.</b-card-text>
        </b-card>
      </div>
    </div>
  </div>
</template>

<style>
.jumbo {
  background-image: url('https://i.pinimg.com/originals/a9/a8/3e/a9a83efe190ed9660b27be8047b94edd.jpg');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;

  width: 100%;
  height: 100%;
}
.jumbo > h1 {
  padding-top: 3rem;
}

.container-fluid > .container-fluid {
  padding-top: 0px;
  margin-bottom: 0px;
  margin-top: 0px;
}

.container > .mt-4 > .card > .card-body > h4 {
  padding-top: 30px;
}
</style>
