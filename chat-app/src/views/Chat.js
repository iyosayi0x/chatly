import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {Link , Navigate,useParams} from 'react-router-dom'
import {useState,useEffect,useCallback, useRef} from 'react'
import CSRFToken from '../components/CSRFToken'
import Cookies from 'js-cookie'
import axios from 'axios'
import Message from '../components/Message'
import {connect} from 'react-redux'
import NotFound from './NotFound'
import useWebSocket from 'react-use-websocket'

const Chat=({isAuthenticated,senderId})=>{
    const [message_description , set_message_description]=useState('')
    const [receiverId , setReceiverId]=useState(null)
    const {user:receiver}=useParams()
    const [messages , setMessages]=useState([])
    const [is404 , setIs404]=useState(false)
    const boxRef=useRef(null)

        const wsStart = 'ws://'
        // for production
        // const endpoint = wsStart + window.location.host + window.location.pathname
        // for react testing
        const endpoint = wsStart + "localhost:8000" + window.location.pathname
        const socket = useWebSocket(endpoint, {
            onMessage:(e)=>{
                const data = JSON.parse(e.data)
                const new_message ={
                    id:messages.length+1,
                    description:data.message_description,
                    sender:data.senderId,
                    receiver:data.receiverId,
                    year:new Date().getFullYear(),
                    day:new Date().getDate(),
                    month:new Date().getMonth()+1,
                    time :{
                        hours: new Date().getHours(),
                        mins: new Date().getMinutes()
                    }
                }
                setMessages(prevMessages=>[...prevMessages , new_message])
            },
            onOpen:e=>{
                console.log(e)
            },
            shouldReconnect:(closeEvent)=> true
        })
        const {sendMessage}=socket

    const chatSendMessage=()=>{
        if(message_description.trim()){
            sendMessage(JSON.stringify({message_description,receiverId,senderId}))
            set_message_description('')
        }
    }

    // fetch message and confirm thread exists or create thread
    const fetchMessages=useCallback(async()=>{
        const config = {
            headers: {
                "Content-type":"application/json",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const body = JSON.stringify({receiver})
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/chat/fetch_messages/`, body , config)
            const data = await res.data
            if(data.error){
                setIs404(true)
                return
            }
            setMessages(data.data)
            setReceiverId(data.receiver_id)
        }catch(err){}
    },[receiver])

    useEffect(()=>{
        isAuthenticated && fetchMessages()
    },[fetchMessages,isAuthenticated])


    useEffect(()=>{
        boxRef.current.scrollIntoView({behavior:"smooth"})
    },[messages])

    if (!isAuthenticated){
        return <Navigate to='/login'/>
    }
    if(is404){
        return <NotFound/>
    }
    return (
        <section className='chat'>
            <header className='chat__header'>
                <div className='chat__iconContainer'>
                    <Link to='/'>
                        <ArrowBackRoundedIcon/>
                    </Link>
                </div>
                <div className='chat__name'>
                    {receiver}
                </div>
            </header>
            <section className='chat__box'>
                {
                    messages.map(message => <Message key={message.id}
                        sender={message?.sender}
                        description={message?.description}
                        year={message?.year}
                        day={message?.day}
                        month={message?.month}
                        time={message?.time}
                        />
                        )
                }
                <div ref={boxRef}/>
            </section>
            <section>
                <form className='chat__area' onSubmit={(evt)=>evt.preventDefault()}>
                    <CSRFToken/>
                    <input type='text' placeholder='write your message...'
                    value={message_description}
                    onChange={(e)=>set_message_description(e.target.value)}/>
                    <button type='button' onClick={chatSendMessage}>
                        <SendRoundedIcon/>
                    </button>
                </form>
            </section>
        </section>
    )
}
const mapStateToProps = state=>{
    return{
        senderId:state.profile.userid,
        isAuthenticated:state.auth.isAuthenticated
    }
}
export default connect(mapStateToProps)(Chat)