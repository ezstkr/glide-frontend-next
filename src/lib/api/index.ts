import Axios from 'axios';

const axios = Axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export function useAxios(token: string = null) {
	axios.interceptors.request.use(function (config) {
		config.headers.Authorization = `Bearer ${token}`;
		
		return config;
	});

	// If you need to handle cases where the token might change during the lifetime of your application, 
	// using an interceptor is the better approach.
	// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	
    return axios
}

export default axios