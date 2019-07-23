
import axios from "axios";


const baseURL = "https://authserver.idnorth.demo.identos.ca";

const authHeader = process.env.VUE_APP_FPX_CLIENT_AUTHZ_BASIC || ""
const API = axios.create({
  baseURL,
  headers: { Authorization: `Basic ${authHeader}` }
});



export default {

	tokenRequest(ticket) {

		const body = {
			ticket: ticket,
			grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
		}		

		return API.post('/transaction/token', body)
	}
};


