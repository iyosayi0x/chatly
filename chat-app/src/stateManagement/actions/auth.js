import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    CREATE_USER_SUCCESS,
    CREATE_USER_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL,
    CLEAR_AUTH_ERRORS

} from './types'
import axios from 'axios'
import Cookies from 'js-cookie'
import {load_user} from './profile'
//logining a user
export const login=(username , password)=> async dispatch=>{
    const config = {
        headers:{
            'Content-type':'application/json',
            'Accept':'application/json',
            'x-CSRFToken':`${Cookies.get('csrftoken')}`
        }
    }
    const body = JSON.stringify({username , password})
    try {
        await axios.post(`${process.env.REACT_APP_API_URL}/accounts/login_user/`, body , config)
        dispatch({
            type:LOGIN_SUCCESS,
        })
        dispatch(load_user())
    }catch(err){
        dispatch({
            type:LOGIN_FAIL
        })
    }
}

//create a user
export const create_user=(username, password1 , password2)=> async dispatch=>{
    const config = {
        headers:{
            'Content-type':'application/json',
            'Accept':'application/json',
            'x-CSRFToken':`${Cookies.get('csrftoken')}`
        }
    }

    const body = JSON.stringify({username , password1 , password2})
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/create_user/`, body , config)
        const data = await res.data
        dispatch({
            type:CREATE_USER_SUCCESS,
            payload:data
        })
    }catch(err){
        dispatch({
            type:CREATE_USER_FAIL,
        })
    }
}

// this checks if the user is authenticated
export const check_authenticated =()=> async dispatch=>{
    const config = {
        headers: {
            'Accept':'application/json',
            'Content-type':'application/json',
        }
    }
    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/is_authenticated/`,config)
        const data = await res.data
        const {detail}=data
        if(detail==='user is authenticated'){
            dispatch({
                type:AUTHENTICATED_SUCCESS
            })
        }
    }catch(err){
        dispatch({
            type:AUTHENTICATED_FAIL
        })
    }
}

// logs out the user
export const logout=()=> async dispatch=>{
    const config = {
        headers:{
            'Content-type':'application/json',
            'Accept':'application/json',
        }
    }

    try {
        await axios.get(`${process.env.REACT_APP_API_URL}/accounts/logout_user/` , config)
        dispatch({
            type:LOGOUT_USER_SUCCESS,
        })
    }catch(err){
        dispatch({
            type:LOGOUT_USER_FAIL,
        })
    }
}

export const clearAuthErrors=()=> async dispatch=>{
    dispatch({
        type:CLEAR_AUTH_ERRORS
    })
}