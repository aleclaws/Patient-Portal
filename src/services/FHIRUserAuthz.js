
import { LocalStorage, SessionStorage } from './store/BrowserStorage'


import FPXApi from './api/FPXAPI'


const uuid = require("uuid")
const queryString = require('query-string')
var jwt_decode = require('jwt-decode');

const FHIRUserAuthz = {

	doLoginRedirect,
	getAuthorizeURL,

	handleAuthorizeCallback,
	getGrantedPermission, 
	logout
}

const AS_HOST = "https://authserver.idnorth.demo.identos.ca"
const AS_AUTHZ_ENDPOINT = "/transaction/authorize"

const AS_CLIENT_ID = "bc-example1-client-id"

const AS_TICKET_ID = "bc-services-ticket-1"

const RESOURCES = {
	"medications" : "5000",
	"lab_results" : "6000",
	"immunization": "1000",
	"patient" : "7000"
}

const CAPABILITIES = {
	login: {
		ticket: "bc-services-ticket-1",
		resources: ["5000", "6000", "1000"]
	}
}

const LOCALSTORAGEKEYS= {
	granted: "FHIRUserAuthz.granted",
	state: "FHIRUserAuthz.state"
}


function loadGrantedAccess() {
	var encoded = LocalStorage.get(LOCALSTORAGEKEYS.granted)
	return JSON.parse(encoded)
}
function saveGrantedAccess(granted) {
    LocalStorage.set(LOCALSTORAGEKEYS.granted, JSON.stringify(granted));
}

function doLoginRedirect() {
    const url = FHIRUserAuthz.getAuthorizeURL()
    window.location.href=url
}

function getAuthorizeURL() {
	const state = uuid.v4()

	LocalStorage.set(LOCALSTORAGEKEYS.state, state)

	const query = {
		ticket: CAPABILITIES.login.ticket,
		client_id: AS_CLIENT_ID,
		claims_redirect_uri: "http://localhost:8085/redirect/datasync",
//		claims_redirect_uri: "https://portal.bcmoh.demo.identos.ca/redirect/datasync",
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

	const sentState = LocalStorage.get(LOCALSTORAGEKEYS.state)
	if(sentState !== state) {
		return Promise.reject("unknown state");				
	}
	LocalStorage.remove(LOCALSTORAGEKEYS.state)

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

function logout() {
	LocalStorage.remove(LOCALSTORAGEKEYS.granted)
	LocalStorage.remove(LOCALSTORAGEKEYS.state)
	SessionStorage.clear()	
}

export default FHIRUserAuthz;