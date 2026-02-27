// import axios from 'axios';
// import {BASE_URL} from "./apiPaths";

// const axiosInstance=axios.create({
//     baseURL:BASE_URL,
//     headers:{
//         'Content-Type':'application/json',
//     },
//     // withCredentials:true, //Include cookies in requests
// });

// //Request Interceptor to add Authorization header
// axiosInstance.interceptors.request.use(
//     (config)=>{
//         const accesstoken=localStorage.getItem("token");
//         if(accesstoken){
//             config.headers.Authorization=`Bearer ${accesstoken}`;
//         }
//         return config;
//     },
//     (error)=>{
//         return Promise.reject(error);
//     }
// );


// //Response Interceptor
// axiosInstance.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     (error)=>{
//         //Handle common errors globally
//         if(error.response){
//             //Unauthorized access - 401
//             if(error.response.status===401){
//                 //Redirect to login or show a modal
//                 window.location.href="/";
//             }else if(error.response.status===500){
//                 console.error("Server Error: Please try again later.");
//             }
//         }else if (error.code==="ECONNABORTED"){
//             console.error("Request timed out. Please try again.");
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;




// import axios from 'axios';
// import {BASE_URL} from "./apiPaths";

// const axiosInstance=axios.create({
//     baseURL:BASE_URL,
//     headers:{
//         'Content-Type':'application/json',
//     },
// });

// //Request Interceptor to add Authorization header
// axiosInstance.interceptors.request.use(
//     (config)=>{
//         // ✅ Don't add token to register/login endpoints
//         const publicEndpoints = ['/api/auth/register', '/api/auth/login'];
//         const isPublicEndpoint = publicEndpoints.some(endpoint => 
//             config.url?.includes(endpoint)
//         );

//         console.log('🔍 Request to:', config.url);
//         console.log('🔍 Is public?', isPublicEndpoint);

//         if (!isPublicEndpoint) {
//             const accesstoken = localStorage.getItem("token");
//             if(accesstoken){
//                 console.log('🔑 Adding token:', accesstoken.substring(0, 20) + '...');
//                 config.headers.Authorization = `Bearer ${accesstoken}`;
//             }
//             else{
//                 console.log('❌ No token found');
//             }
//         }
        
//         return config;
//     },
//     (error)=>{
//         return Promise.reject(error);
//     }
// );

// //Response Interceptor
// axiosInstance.interceptors.response.use(
//     (response)=>{
//         return response;
//     },
//     (error)=>{
//         //Handle common errors globally
//         if(error.response){
//             //Unauthorized access - 401
//             if(error.response.status===401){
//                 // ✅ Only redirect to login if NOT on auth pages
//                 const authPages = ['/api/auth/register', '/api/auth/login'];
//                 const isAuthPage = authPages.some(page => 
//                     error.config.url?.includes(page)
//                 );
                
//                 if (!isAuthPage) {
//                     window.location.href="/";
//                 }
//             }else if(error.response.status===500){
//                 console.error("Server Error: Please try again later.");
//             }
//         }else if (error.code==="ECONNABORTED"){
//             console.error("Request timed out. Please try again.");
//         }
//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;










import axios from 'axios';
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    // ✅ NO default headers - let each request decide
});

// Request Interceptor to add Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        // ✅ Check if this is FormData
        const isFormData = config.data instanceof FormData;
        
        console.log('🔍 Request to:', config.url);
        console.log('📦 Data type:', isFormData ? 'FormData' : typeof config.data);
        
        if (isFormData) {
            console.log('📦 FormData entries:');
            for (let pair of config.data.entries()) {
                console.log(`  ${pair[0]}:`, pair[1]);
            }
        }

        // Don't add token to register/login endpoints
        const publicEndpoints = ['/api/auth/register', '/api/auth/login'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
            config.url?.includes(endpoint)
        );

        console.log('🔍 Is public?', isPublicEndpoint);

        if (!isPublicEndpoint) {
            const accesstoken = localStorage.getItem("token");
            if (accesstoken) {
                console.log('🔑 Adding token:', accesstoken.substring(0, 20) + '...');
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${accesstoken}`;
            } else {
                console.log('❌ No token found');
            }
        }

        // ✅ Handle Content-Type based on data type
        if (isFormData) {
            // CRITICAL: Delete Content-Type for FormData (browser will set it with boundary)
            delete config.headers['Content-Type'];
            console.log('✅ Removed Content-Type for FormData (browser will set boundary)');
        } else if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
            console.log('✅ Set Content-Type to application/json');
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            // Unauthorized access - 401
            if (error.response.status === 401) {
                const authPages = ['/api/auth/register', '/api/auth/login'];
                const isAuthPage = authPages.some(page => 
                    error.config.url?.includes(page)
                );
                
                if (!isAuthPage) {
                    window.location.href = "/";
                }
            } else if (error.response.status === 500) {
                console.error("Server Error: Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
