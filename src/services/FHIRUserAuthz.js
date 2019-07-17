
import BrowserStorage from './BrowserStorage'


import FPXApi from './api/FPXAPI'


const uuid = require("uuid")
const queryString = require('query-string')
var jwt_decode = require('jwt-decode');

const FHIRUserAuthz = {

	getAuthorizeURL,
	handleAuthorizeCallback,
	getGrantedPermission
}

const AS_HOST = "https://authserver.idnorth.demo.identos.ca"
const AS_AUTHZ_ENDPOINT = "/transaction/authorize"

const AS_CLIENT_ID = "bc-example1-client-id"

const AS_TICKET_ID = "bc-services-ticket-1"

const RESOURCES = {
	"medications" : "5000",
	"lab_results" : "6000",
	"immunization": "1000"
}

const CAPABILITIES = {
	login: {
		ticket: "bc-services-ticket-1",
		resources: ["5000", "6000", "1000"]
	}
}


function loadGrantedAccess() {
	var encoded = BrowserStorage.get("FHIRUserAuthz.granted")
	return JSON.parse(encoded)
}
function saveGrantedAccess(granted) {
    BrowserStorage.set("FHIRUserAuthz.granted", JSON.stringify(granted));
}


function getAuthorizeURL() {
	const state = uuid.v4()

	BrowserStorage.set("FHIRUserAuthz.state", state)

	const query = {
		ticket: CAPABILITIES.login.ticket,
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

	const sentState = BrowserStorage.get("FHIRUserAuthz.state")
	if(sentState !== state) {
		return Promise.reject("unknown state");				
	}
	BrowserStorage.remove("FHIRUserAuthz.state")

	return new Promise(function(resolve, reject) {

		FPXApi.tokenRequest(ticket, state)
		.then(result => {
			if(result.status !== 200) {
				return reject(result.data)
			}
			var decoded = jwt_decode(result.data.access_token);

			saveGrantedAccess(decoded.access_tokens);


			resolve(decoded)
		},
		(error) => reject(error))
	});
}

function getGrantedPermission(res_type) {

	const resId = RESOURCES[res_type]
	if(!resId) { return null; }

	const granted_access = loadGrantedAccess();
	for(var element of granted_access) {
		if(element.resource_id == resId) {
			return element
		}
	};
	return null
}

export default FHIRUserAuthz;