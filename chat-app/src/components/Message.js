import {connect} from 'react-redux'

const Message=({sender , description, userid,day , month , year,time})=>{
    const getMonthString=()=>{
        if(month===1)return "Jan"
        if(month===2)return "Feb"
        if(month===3)return "Mar"
        if(month===4)return "Apr"
        if(month===5)return "May"
        if(month===6)return "Jun"
        if(month===7)return "Jul"
        if(month===8)return "Aug"
        if(month===9)return "Sep"
        if(month===10)return "Oct"
        if(month===11)return "Nov"
        if(month===12)return "Dec"
    }
    if(description.trim() !==''){
        return (
        <>
        {
            sender === parseInt(userid) ?
            (
            <div className='chat__msg_wrapper wrapper_right'>
                <div className='chat__msg msg__right'>{description} </div>
                <small className='chat_msg_time time_right'>{day} {getMonthString()}, {year}  <small style={{
                        fontWeight:"bolder"
                    }}>{(time?.hours > 12 && `${time?.hours-12} : ${time?.mins}Pm`) || `${time?.hours} : ${time?.mins}Am`}</small>
                </small>
            </div>
            )
            :
            (
            <div className='chat__msg_wrapper'>
                <div className='chat__msg msg__left'>{description}</div>
                <small className='chat_msg_time'>{day} {getMonthString()}, {year} <small style={{
                        fontWeight:"bolder"
                    }}
                    >{(time?.hours > 12 && `${time?.hours-12} : ${time?.mins}Pm`) || `${time?.hours} : ${time?.mins}Am`}</small>
                </small>
            </div>
            )
        }
        </>
    )
    }else return <></>
}

const mapStateToProps=state=>{
    return {
        userid:state.profile.userid,
    }
}

export default connect(mapStateToProps)(Message)