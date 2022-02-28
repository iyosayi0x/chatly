// import Cookies from 'js-cookie'
import axios from 'axios'
import {
    LOAD_USER_PROFILE_SUCCESS ,
    LOAD_USER_PROFILE_FAIL,
} from './types'

export const load_user=()=>async dispatch=>{
    const config = {
        headers :{
            'Content-type':'application/json',
            'Accept':'application/json'
        }
    }
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/get_user/`,config)
        const data = await res.data
        dispatch({
            type:LOAD_USER_PROFILE_SUCCESS,
            payload:data
        })
    }catch(err){
        dispatch({
            type:LOAD_USER_PROFILE_FAIL
        })
    }
}
