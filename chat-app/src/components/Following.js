import {Link} from 'react-router-dom'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CSRFToken from '../components/CSRFToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import {useCallback} from 'react'
import {connect} from 'react-redux'

const Following=({user ,user_username,isFollowing,setFollowing,current_user})=>{

        // fetching all_following for current logged in user
        const fetchFollowing=useCallback(async()=>{
            const config = {
                headers:{
                    "Content-type":"application/json",
                    "Accept":"application/json"
                }
            }
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/list_following/`,config)
                const data = await res.data
                setFollowing(data)
            }catch(err){}
        },[setFollowing])

            // fetching all_following for other user
    const fetchFollowingOther=useCallback(async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const body = JSON.stringify({user_username})
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/list_following/`,body,config)
            const data = await res.data
            setFollowing(data)
        }catch(err){}
    },[user_username,setFollowing])

    const handleSubmit=async(e)=>{
        e.preventDefault()
            // send a remove request to the backend
            const config = {
                headers:{
                    "Content-type":"application/json",
                    "Accept":"application/json",
                    "x-CSRFToken":Cookies.get('csrftoken')
                }
            }
            const task = "unfollow"
            const body = JSON.stringify({user,task})

            try{
                await axios.post(`${process.env.REACT_APP_API_URL}/accounts/toggle_follow/`,body, config)
                await fetchFollowing()
            }catch(err){}
    }
    const handleSubmit2=async(e)=>{
        // send a remove request to the backend
        e.preventDefault()
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }

        const task = isFollowing ? "unfollow" : "follow"
        const body = JSON.stringify({user,task})
        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/accounts/toggle_follow/`,body, config)
            await fetchFollowingOther()
        }catch(err){}
    }
    return (
        <div className='follower__following'>
            <div className='follower__follower'>
                <section className='userprofile'>
                    <Link to={`/profile/${user}`}>
                    <div className='userprofile__user'>
                        <AccountCircleRoundedIcon/>
                        <div className='userprofile__nameContainer'>
                            <h3>{user}</h3>
                        </div>
                    </div>
                    </Link>
                    <section className='userprofile__btnSection'>
                    {
                    user_username ==="me"  &&
                        <form onSubmit={(e)=>{handleSubmit(e)}}>
                            <CSRFToken/>
                            <button type='submit' className='btn btn_secondary'>UnFollow</button>
                        </form>
                    }
                {current_user !== user && user_username !== "me" &&
                <form onSubmit={(e)=>{handleSubmit2(e)}}>
                    <CSRFToken/>
                    {!isFollowing && <button type='submit' className="btn btn_primary">Follow</button> }
                    {isFollowing && <button type='submit' className='btn btn_secondary'>UnFollow</button>}
                </form>
            }
                    </section>
                </section>
        </div>
    </div>
    )
}
const mapStateToProps=state=>{
    return {
        current_user:state.profile.username
    }
}
export default connect(mapStateToProps)(Following)