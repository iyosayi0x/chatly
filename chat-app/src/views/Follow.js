import {useState,useEffect,useCallback} from 'react'
import {useParams} from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {connect} from 'react-redux'
import {Link,Navigate,useLocation} from 'react-router-dom'
import axios from 'axios'
import Follower from '../components/Follower'
import Following from '../components/Following'
import Cookies from 'js-cookie'

const Follow=({username,isAuthenticated})=>{
    const {user_username}=useParams()
    const {search}=useLocation()
    const queryString = new URLSearchParams(search)
    //get query string
    const queryPage = queryString.get("page")
    const [page,setPage]= useState("followers")
    const [followingPageBtnClass,setFClass]=useState("follow__navBtn navBtn__Active")
    const [followersPageBtnClass , setFsClass]=useState("follow__navBtn")
    const [isLoading , setIsLoading]= useState(false)
    const [following , setFollowing]=useState([])
    const [followers,setFollowers]=useState([])

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
    },[])

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
    },[])

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
    },[user_username])

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
    },[user_username])

    // toggling the between followers and all_following page's
    const togglePage=async(page_name)=>{
        setIsLoading(true)
        setPage(page_name)
        if(page_name === "followers"){
            setFsClass('follow__navBtn navBtn__Active')
            setFClass('follow__navBtn')
            user_username === 'me' ? await fetchFollowers() : await fetchFollowersOther()
        }else{
            setFsClass('follow__navBtn')
            setFClass('follow__navBtn navBtn__Active')
            await fetchFollowing()
            user_username === 'me' ? await fetchFollowing() : await fetchFollowingOther()
        }
        setIsLoading(false)
    }

    // setting the defautl page from use params
    useEffect(()=>{
        ((queryPage === "followers" || queryPage === "following") && setPage(queryPage))
        if(queryPage==="followers"){
            setFClass("follow__navBtn")
            setFsClass("follow__navBtn navBtn__Active")
            user_username === "me"? fetchFollowers() : fetchFollowersOther();
        }else if (queryPage === "following"){
            setFClass("follow__navBtn navBtn__Active")
            setFsClass("follow__navBtn")
            user_username === "me"? fetchFollowing() : fetchFollowingOther();
        }
    },[queryPage,fetchFollowers,fetchFollowersOther,user_username , fetchFollowing , fetchFollowingOther])

    if (!isAuthenticated){
        return <Navigate to='/login'/>
    }

    return (
        <section className='follow'>
            <header className='follow__header'>
                <div className='follow__header__user'>
                    <Link to='/'>
                        <ArrowBackRoundedIcon className='follow__arrowBack'/>
                    </Link>
                    <div className='follow__header__userName'>
                            {user_username ==="me" && username}
                            {user_username !== "me" && user_username}
                    </div>
                    <div className='follow__header__nav'>
                        <div className={followersPageBtnClass} onClick={()=>togglePage("followers")}>Followers</div>
                        <div className={followingPageBtnClass} onClick={()=>togglePage("following")}>Following</div>
                    </div>
                </div>
            </header>
            {
                isLoading && <h1 className='loading'>Loading... Followers page</h1>
            }

            { !isLoading &&
                ( page ==="followers" &&
                    (
                    <section className='follow__followers follow_page'>
                        {
                            followers.map(follower=> <Follower key={follower?.id}
                                user={follower?.user} setFollowers={setFollowers}
                                user_username={user_username}
                                isFollowing={follower?.isFollowing}
                                />)
                        }
                    </section>
                    )
                )
            }

            { !isLoading &&
                ( page ==="following" &&
                    (
                    <section className='follow__following follow_page'>
                        {
                            following.map(following => <Following key={following.id}
                                user={following?.user}
                                setFollowing={setFollowing}
                                user_username={user_username}
                                isFollowing={following?.isFollowing}
                                />)
                        }
                    </section>
                    )
                )
            }


    </section>
    )
}
const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        username:state.profile.username,
    }
}
export default connect(mapStateToProps)(Follow)


