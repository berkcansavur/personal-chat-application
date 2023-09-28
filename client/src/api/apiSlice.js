import { createApi, fetchBaseQuery } from'@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseURL: process.env.BASE_URL,
    credentials: 'include',
    prepareHeaders:(headers, { getState } ) => {
        const token = getState().auth.token;
        if(token){
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});
const baseQueryWithReauth = async(args,api,exportOptions) => {
    let result = await baseQuery(args,api,exportOptions);
    if(result?.error?.originalStatus === 401 ) {
        console.log('baseQuerywithreauth',result)
        const refreshResult = await baseQuery('/refreshToken',api,exportOptions);
        if(refreshResult?.data) {
            const user = api.getState().auth.user
            api.dispatch(setCredentials({...refreshResult.data, user})) 
            result = await baseQuery(args, api, exportOptions);
        } else{
            api.dispatch( logOut() )
        }
    }
    return result;
}
export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})