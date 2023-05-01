import axios from "axios";


axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers["user_id"] = JSON.parse(localStorage.getItem('chat-app-user')!)["_id"];
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

export default axios