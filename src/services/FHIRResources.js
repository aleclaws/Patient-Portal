
import BrowserStorage from './BrowserStorage'

const uuid = require("uuid");
const queryString = require('query-string');

const FHIRResources = {

	getAuthorizeURL,
	handleAuthorizeCallback
}

const AS_HOST = "https://authserver.idnorth.demo.identos.ca"
const AS_AUTHZ_ENDPOINT = "/transaction/authorize"

const AS_CLIENT_ID = "bc-example1-client-id"

const AS_TICKET_ID = "bc-services-ticket-1"



function getAuthorizeURL() {
	const state = uuid.v4()

	BrowserStorage.set("FHIRResources.state", state)

	const query = {
		ticket: AS_TICKET_ID,
		client_id: AS_CLIENT_ID,
		claims_redirect_uri: "http://localhost:8085/redirect/datasync",
		scope: "ax",
		grant_type: "urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Auma-ticket",
		login_hint: "bcmoh_wallet",
		state: state
	}


	const url = AS_HOST + AS_AUTHZ_ENDPOINT + '?' + queryString.stringify(query)
	
	return url	
}

function handleAuthorizeCallback(ticket, state) {
	if(!ticket || !state) {
		return Promise.reject("missing param");		
	}

	return new Promise(function(resolve, reject) {
		resolve("yay")
	});
}

export default FHIRResources;