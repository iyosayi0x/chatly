import {Link} from 'react-router-dom'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CSRFToken from '../components/CSRFToken'
import axios from 'axios'
import Cookies from 'js-cookie'
import {useCallback} from 'react'
import {connect} from 'react-redux'

const Follower=({user,user_username ,isFollowing,setFollowers,current_user})=>{

      // fetching followers for current logged in user
    const fetchFollowers=useCallback(async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json"
            }
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/list_followers/`,config)
            const data = await res.data
            setFollowers(data)
        }catch(err){}
    },[setFollowers])

    // fetching followers for other user
    const fetchFollowersOther=useCallback(async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const body = JSON.stringify({user_username})
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/list_followers/`,body,config)
            const data = await res.data
            setFollowers(data)
        }catch(err){}
    },[user_username , setFollowers])

    // fetching followers for other user

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
        const body = JSON.stringify({user})

        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/accounts/remove_follower/`,body, config)
            await fetchFollowers()
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
            await fetchFollowersOther()
        }catch(err){}
    }
    return (
        <div className='follower__follower'>
        <section className='userprofile'>
            <Link to={`/profile/${user}`}>
            <div className='userprofile__user'>
                <AccountCircleRoundedIcon/>
                <div className='userprofile__nameContainer'>
                    <h3>{user || 'dexter'}</h3>
                </div>
            </div>
            </Link>

            <section className='userprofile__btnSection'>

            {user_username==="me"&&
                <form onSubmit={(e)=>{handleSubmit(e)}}>
                    <CSRFToken/>
                    <button type='submit' className='btn btn_secondary'>Remove</button>
                </form>
            }
            {current_user!==user && user_username !== "me" &&
                <form onSubmit={(e)=>{handleSubmit2(e)}}>
                    <CSRFToken/>
                    {!isFollowing && <button type='submit' className="btn btn_primary">Follow</button> }
                    {isFollowing && <button type='submit' className='btn btn_secondary'>Unfollow</button>}
                </form>
            }
            </section>
        </section>
        </div>
    )
}
const mapStateToProps=state=>{
    return {
        current_user:state.profile.username
    }
}
export default connect(mapStateToProps)(Follower)