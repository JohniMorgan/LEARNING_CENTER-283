import axios from "axios"

const backConnector = axios.create({
    url: "",
    //baseURL: 'https://butov.pro/api',
    baseURL: 'http://localhost:8080/api',
})

export default backConnector;