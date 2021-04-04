import axios from 'axios'


export default ({req})=>{
    if(typeof window === 'undefined'){
        //We are in the server
        //Requests should be made to ingress-nginx
         return axios.create({
             baseURL: 'http://ticket-faster.xyz/',
             headers: req.headers
         })
    } else {
        //We are in the client
        //requests can be made with a base url of ''
        return axios.create()
    }
}
