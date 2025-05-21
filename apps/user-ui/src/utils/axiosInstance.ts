import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SEVER_URI,
    withCredentials: true
})

let isRefreshing = false;

let refresehSubscribers : (() => void)[] = [];


// Handle logouts and prevent infinite loops
const handleLogout = () => {
    if(window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
}


// Handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback : () => void) => {
    refresehSubscribers.push(callback);
}


// Execute the queued requests after refreshing
const onRefreshSuccess = () => {
    refresehSubscribers.forEach((callback) => callback());
    refresehSubscribers = [];
}


// Handle API requests
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);


// Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // prevent inifinite loop problem
        if (error.response?.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
                })
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(
                    `${process.env.NEXT_PUBLIC_SEVER_URI}/api/refresh-token-user`,
                    {},
                    { withCredentials : true}
                )

                isRefreshing = false;
                onRefreshSuccess();

                return axiosInstance(originalRequest);

            } catch (error) {
                isRefreshing = false;
                refresehSubscribers = [];
                handleLogout();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;