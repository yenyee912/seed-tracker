<template>
  <footer class="bd-footer text-muted docs-border">
    <div class="container footer-container" >
      <div class="row justify-content-center" >
        <div class="text-center text-sm-right col-sm order-sm-3 col-12" >
          <img
            src="../assets/logo.png"
            width="100"
            class="mb-4 mt-0 mt-sm-4 img-fluid"
            
          />
        </div>
        <div class="text-left col-md-4 col-auto" >
          <h5 class="bd-text-purple-bright mb-1" >Documentation</h5>
        </div>
        <div class="text-left col-auto" >
          <h5 class="bd-text-purple-bright mb-1" >Our Site</h5>
          <ul class="list-unstyled ml-3" >
            <li>
              <a
                href="https://www.google.com/"
                target="_blank"
              >Site</a>
            </li>
          </ul>
        </div>
      </div>
      <hr />
      <p class="mb-2" >Designed and built</p>
      <p >with love.</p>
    </div>
  </footer>
</template>

<script>
export default {}
</script>

<style scoped>
footer {
  background-color: #7fd3a1;
  margin-top: 80px;
  padding:50px;
}
.footer-container {
  width: 100%;
  padding-top: 80px;
  padding-bottom: 30px;
  padding-left: 15px;
  /* margin-top: 100px; */
  margin-right: auto;
  margin-left: auto;
}
.bd-footer a {
  font-weight: 500;
  color: #495057;
}
</style>
