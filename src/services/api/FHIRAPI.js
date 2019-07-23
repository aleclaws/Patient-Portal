
import axios from "axios";


const API = axios.create({});


export default {

	resourceRequest(location, access_token) {

		return API.get(location, 
			{ headers: { Authorization: `Bearer ${access_token}` }});
	}
};


