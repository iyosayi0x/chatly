import UserProfile from "../components/UserProfile"
import {connect} from 'react-redux'
import {Navigate} from 'react-router-dom'
import axios from 'axios'
import {useState,useEffect} from 'react'
import Footer from '../components/Footer'

const Users=({isAuthenticated,username})=>{
    const [users , setUsers]=useState([])
    const [userFollowing , setUserFollowing]=useState([])
    const fetchUsers=async()=>{
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/accounts/list_users/`)
        const data = await res.data
        setUsers(data)
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
            setUserFollowing(usernames)
        }catch(err){}
    }

    useEffect(()=>{
        fetchUsers()
        fetchUserFollowing()
    },[])

    if(!isAuthenticated){
        return <Navigate to='/login'/>
    }
    return (
        <section className='users'>
            <h1>Users</h1>
            <div className='users__listSection'>
                {users.filter(user=>user.username !== username).map(user=>{
                    const {username , id} = user
                    if (userFollowing.includes(username)){
                        return (<UserProfile username={username} key={id} isFollowing={true} suf={setUserFollowing}
                        />)
                    }else {
                        return (<UserProfile username={username} key={id} isFollowing={false} suf={setUserFollowing}
                        />)
                    }
                    })}
            </div>
            <Footer/>
        </section>
    )
}
const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        username:state.profile.username
    }
}
export default connect(mapStateToProps)(Users)