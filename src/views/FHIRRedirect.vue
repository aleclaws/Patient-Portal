<template>
  <div class="container">
    <br>
    <h1><font-awesome-icon icon="syringe"></font-awesome-icon> Logging In...</h1>
  </div>
</template>

<script>
import FHIRUserAuthz from '@/services/FHIRUserAuthz'

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

	  	FHIRUserAuthz.handleAuthorizeCallback(ticket, state)
	  	.then(result => {
	  		this.$router.push('/')	  		
	  	}, 
	  	(error) => this.$router.push('/login'));
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