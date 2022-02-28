import {Link} from 'react-router-dom'
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import CSRFToken from './CSRFToken'
import Cookies from 'js-cookie'
import axios from 'axios'

const UserProfile=({username , isFollowing , suf})=>{

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(isFollowing){
            await toggleFollow('unfollow')
        }else{
            await toggleFollow('follow')
        }
        await fetchUserFollowing()
    }

    // toggles following for users
    const toggleFollow=async(task)=>{
        const config={
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                'x-CSRFToken':Cookies.get('csrftoken')
            }
        }
        const user = username
        const body = JSON.stringify({task , user})
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/accounts/toggle_follow/`, body , config)
        }catch(err){}
    }

    const fetchUserFollowing=async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json"
            }
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/list_following/` , config)
            const data = await res.data
            const usernames = data.map(user_obj => user_obj?.user)
            suf(usernames)
        }catch(err){}
    }


    return (
        <section className='userprofile'>
            <Link to={`/profile/${username}`}>
            <div className='userprofile__user'>
                <AccountCircleRoundedIcon/>
                <div className='userprofile__nameContainer'>
                    <h3>{username}</h3>
                    {/* { <small>other name</small>} */}
                </div>
            </div>
            </Link>

            <section className='userprofile__btnSection'>
            <div className='userprofile__chatBtn'>
                <Link to={`/chat/${username}`}>Chat</Link>
            </div>
            <form onSubmit={(e)=>{handleSubmit(e)}}>
            <CSRFToken/>
            {isFollowing &&  <button type='submit' className='btn btn_secondary'>Unfollow</button>}
            {!isFollowing && <button type='submit' className='btn btn_primary'>Follow</button>}
            </form>
            </section>
        </section>
    )
}
export default UserProfile