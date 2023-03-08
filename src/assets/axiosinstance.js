const axios = require('axios')

const axiosInstance = axios.create({
    //https://kefagardens-backend.herokuapp.com/kefagardens/api/
    // http://localhost:8000/digitaldairyApi/api/
    baseURL: 'http://localhost:8000/digitaldairyApi/api/',
    timeout: 50000,
    headers: {
        'X-CSRFTOKEN': 'bPlDWqaa2GgGL90fa8dnKVJPsUvspToyT3lu0TVLgJTb3RtOt1gSPK4z3fU3o8wi',
    },
});

export default axiosInstance