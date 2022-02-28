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
} from '../actions/types'

const initialState={
    isAuthenticated:false,
    sign_up_errors:[],
    sign_up_message:'',
    login_success:true
}

const reducer =(state=initialState, action)=>{
    const {type, payload} = action

    switch(type){
        case LOGIN_SUCCESS:
            return {
                ...state,
                sign_up_errors:[],
                sign_up_message:'',
                isAuthenticated:true,
                login_success:true
            }
        case LOGIN_FAIL:
            return {
                ...state,
                isAuthenticated:false,
                login_success:false
            }
        case CREATE_USER_SUCCESS:
                return {
                    ...state ,
                    sign_up_message:payload?.sign_up_message,
                    sign_up_errors:payload?.sign_up_errors
                }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state ,
                isAuthenticated:true
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated:false
            }
        case LOGOUT_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated:false
            }
        case CLEAR_AUTH_ERRORS:{
            return {
                ...state,
                sign_up_errors:[],
                sign_up_message:'',
                login_success:true
            }
        }
        case LOGOUT_USER_FAIL:
        case CREATE_USER_FAIL:
            return state
        default:
            return state
    }
}
export default reducer