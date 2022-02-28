import UserChat from '../components/UserChat'
import {connect} from 'react-redux'
import {Navigate,Link} from 'react-router-dom'
import axios from 'axios'
import {useState , useEffect} from 'react'
import Footer from '../components/Footer'


const Home=({isAuthenticated})=>{
    // fetch thread and chats of people the user is following , even it its empty
    const [userFollowing , setUserFollowing]=useState([])
    const [thread , setThread]=useState([])
    const [threadUserIds , setThreadUserIds]=useState([1,3])
    const [isLoading , setIsLoading]=useState(true)
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
            setUserFollowing(data)
        }catch(err){}
    }
    const fetchChatThread=async()=>{
        const config = {
            headers:{
                "Content-type":"application/json",
                "Accept":"application/json"
            }
        }
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/chat/fetch_thread/`, config)
            const data = await res.data
            setThread(data?.data)
            setThreadUserIds(data?.ids)
        }catch(err){}
    }
    useEffect(()=>{
        if(isAuthenticated){
            (async ()=>{
                await fetchChatThread()
                await fetchUserFollowing()
                setIsLoading(false)
            })()
        }
    },[isAuthenticated])
    if(!isAuthenticated){
        return <Navigate to='/login'/>
    }
    return (
        <section className='home'>
            <h1>Chats</h1>
            <main className='home__chatsSection'>
            {
                thread.map(chat=><UserChat key={chat?.id}
                    seen={chat?.seen}
                    first_user={chat.first_user}
                    second_user={chat.second_user}
                    description={chat?.message}/>)
            }
            {
                userFollowing.filter(ufl=> !threadUserIds.includes(ufl.id)).map(empty_converssation=>{
                    const {id , user} = empty_converssation
                    const first_user = {
                        id:id ,
                        name:user
                    }
                    return <UserChat key={id} first_user={first_user} description='You are now connected, say Hi' seen={true}/>
                })
            }
            {isLoading && <div className='home__emptyThread'>
                Loading...
                </div>}
            {
                (!isLoading &&
                    (thread.length === 0 && userFollowing.length ===0) && (
                        <div className='home__emptyThread'>
                            <h1>Such empty :(</h1>
                            <Link to='/users/' className='link_btn btn_primary'>Start new conversation</Link>
                        </div>
                    )
                )
            }
            </main>
            <Footer/>
        </section>
    )
}
const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        userid:state.profile.userid
    }
}
export default connect(mapStateToProps)(Home)