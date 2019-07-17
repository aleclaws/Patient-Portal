<template>
  <div class="container">
    <br>
    <h1><font-awesome-icon icon="syringe"></font-awesome-icon> Logging In...</h1>
  </div>
</template>

<script>
import FHIRResources from '@/services/FHIRResources'

// @ is an alias to /src
export default {
  name: "FHIRRedirect",
  data: () => {
    return {
      hello: [],
      world: "new-to-old",
    };
  },
  methods: {
    handleRedirectParams() {
    	const ticket = this.$route.query.ticket
	  	const state = this.$route.query.state

	  	FHIRResources.handleAuthorizeCallback(ticket, state)
	  	.then(result => {
	  		this.$router.push('/')	  		
	  	}, 
	  	(error) => this.$router.push('/login'));


      // this.$http
      //   .get("http://localhost:5005/api/immunization")
      //   .then(
      //     response => {
      //       console.log("RESPONSE:", response)
      //       this.immunizations = response.body.immunizations;
      //       this.sortImmunizations();
      //       this.patient = "Alice"
      //     },
      //     response => {
      //       console.error(response);
      //     }
      //   );
    }
  },
  beforeMount() {

    this.handleRedirectParams();
  }
};
</script>

<style scoped>
.container {
  text-align: left;
}
</style>