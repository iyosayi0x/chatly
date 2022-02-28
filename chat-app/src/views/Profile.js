import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import {connect} from 'react-redux'
import {Navigate,useParams, Link} from 'react-router-dom'
import {useState , useEffect,useCallback} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Footer from '../components/Footer'
import {logout} from '../stateManagement/actions/auth'

const Profile=({isAuthenticated,username , first_name , last_name , bio,logout,profile_image_url})=>{
    const [USER,SETUSER]=useState({})
    const [follow , setFollow]=useState({})
    const [isLoading , setIsLoading]=useState(true)
    const {user_username}=useParams()

    // fetching another users profile
    const fetchUserOther=useCallback(async()=>{
        const config ={
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                'x-CSRFToken':Cookies.get('csrftoken')
            }
        }
        const body = JSON.stringify({user_username})
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/profile/get_user/`,body,config)
            const data = await res.data
            SETUSER(data)
        }
        catch(err){
            const err_res={
                username:"User does not exits"
            }
            SETUSER(err_res)
        }
    },[user_username])

    //fetches data for numbers of followers and following
    const fetchUserFollow=useCallback(async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const body = JSON.stringify({user_username})
        try{
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/accounts/count_follow/`,body , config)
            const data = await res.data
            setFollow(data)
        }catch(err){
            return
        }
    },[user_username])

    const handleSubmit=async(e)=>{
        e.preventDefault()
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const user = USER?.username
        const task = USER?.isFollowing ? "unfollow": "follow"
        const body = JSON.stringify({user , task})
        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/accounts/toggle_follow/`,body , config)
            await fetchUserOther()
        }catch(err){
            return
        }
    }

    useEffect(()=>{
        (async ()=>{
            if(user_username!=="me"){
                await fetchUserOther()
            }
            await fetchUserFollow()
            setIsLoading(false)
        })()
    },[user_username,fetchUserFollow, fetchUserOther])


    if(!isAuthenticated){
        return <Navigate to='/login'/>
    }
    if (user_username ==="me"){
        return (
            <section className='profile'>

                <div className='profile__iconContainer'>
                    {profile_image_url !== null && <img src={profile_image_url} alt="Profile_image" className="profile__image"/>}
                    {profile_image_url === null && <AccountCircleRoundedIcon/>}
                    <h1>{username}</h1>
                    <h5 className='profile__iconContainer__fullname'>{first_name} {last_name}</h5>
                </div>

            <section className='profile__followLinks'>
                    <Link to={`/follow/me?page=followers`}>
                        <span>Followers</span> {!isLoading && <span>{follow?.followers}</span>} {isLoading && <small>Loading...</small>}
                    </Link>
                    &middot;
                    <Link to={`/follow/${user_username}?page=following`}>
                        <span>Following</span> {!isLoading && <span>{follow?.following}</span>} {isLoading && <small>Loading...</small>}
                    </Link>
            </section>

            <section className='profile__userDetails'>
                <div className='profile__detailBox'>
                    <div className='profile__detailKey'>First Name :</div>
                    <div className="profile__detailValue">{first_name || "Null"}</div>
                </div>
                <div className='profile__detailBox'>
                    <div className="profile__detailKey">Last Name :</div>
                    <div className="profile__detailValue">{last_name || "Null"}</div>
                </div>
                <div className='profile__detailBox'>
                    <div className='profile__detailKey'>Bio :</div>
                    <div className="profile__detailValue">{bio || "Null"}</div>
                </div>
            </section>

            <section className='profile__footer'>
                <Link to='/profile/edit_profile/' className='link_btn btn_primary'>Edit Profile</Link>
                <button className='normal_btn btn_secondary' onClick={logout}>Logout</button>
            </section>
            <Footer/>
        </section>

        )
    }else return (
        <section className='profile'>
        <div className='profile__iconContainer'>
            {USER?.profile_image_url !== null && <img src={USER?.profile_image_url} alt="Profile_image" className="profile__image"/>}
            {USER?.profile_image_url === null && <AccountCircleRoundedIcon/>}
            <AccountCircleRoundedIcon/>
            {!isLoading && <h1>{USER?.username}</h1>}
            {isLoading && <h1 className='small_text bold_text center'>Loading</h1>}
        </div>

        <section className='profile__followLinks'>
            <Link to={`/follow/${user_username}?page=followers`}>
                <span>Followers</span> {!isLoading && <span>{follow?.followers}</span>} {isLoading && <small>Loading...</small>}
            </Link>
            &middot;
            <Link to={`/follow/${user_username}?page=following`}>
                <span>Following</span> {!isLoading && <span>{follow?.following}</span>} {isLoading && <small>Loading...</small>}
            </Link>
        </section>

        <section className='profile__userDetails'>
                <div className='profile__detailBox'>
                    <div className='profile__detailKey'>First Name :</div>
                    <div className="profile__detailValue">{USER?.first_name || "Null"}</div>
                </div>
                <div className='profile__detailBox'>
                    <div className="profile__detailKey">Last Name :</div>
                    <div className="profile__detailValue">{USER?.last_name || "Null"}</div>
                </div>
                <div className='profile__detailBox'>
                    <div className='profile__detailKey'>Bio :</div>
                    <div className="profile__detailValue">{USER?.bio || "Null"}</div>
                </div>
            </section>

        <section className='profile__footer'>
            <form onSubmit={(e)=>{handleSubmit(e)}}>
                <Link to={`/chat/${user_username}`} className='link_btn btn_secondary'>Chat</Link>
                {!USER?.isFollowing && <button className='normal_btn btn_primary'>Follow</button>}
                {USER?.isFollowing && <button className='normal_btn btn_secondary'>UnFollow</button>}
            </form>
        </section>
        <Footer/>
    </section>
    )
}

const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        username:state.profile.username,
        first_name:state.profile.first_name,
        last_name:state.profile.last_name,
        bio:state.profile.bio,
        profile_image_url:state.profile.profile_image_url
    }
}
export default connect(mapStateToProps,{logout})(Profile)