import {
    LOAD_USER_PROFILE_SUCCESS,
    LOAD_USER_PROFILE_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL
} from '../actions/types'

const initialState={
    userid:null,
    username:'',
    first_name:'',
    last_name:'',
    bio:'',
    profile_image_url:null,
}

const reducer =(state = initialState , action)=>{
        const {type , payload}=action
        switch(type){
        case LOAD_USER_PROFILE_SUCCESS:
            return {
                ...state,
                username:payload?.user.username ,
                userid:payload?.user.id,
                first_name:payload?.userprofile?.first_name,
                last_name:payload?.userprofile?.last_name,
                bio:payload?.userprofile?.bio,
                profile_image_url:payload?.userprofile?.profile_image,
            }
        case LOGOUT_USER_SUCCESS:
        case LOAD_USER_PROFILE_FAIL:
            return {
                ...state ,
                username:'',
                userid:null,
                first_name:'',
                last_name:'',
                bio:'',
                profile_image_url:null
            }
        case LOGOUT_USER_FAIL:
            return state
        default :
            return state
        }
}
export default reducer