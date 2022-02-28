import {Link} from 'react-router-dom'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {connect} from 'react-redux'
const UserChat=({seen , first_user , second_user , description, userid})=>{
        if(description.trim() !== ''){
        return (
        <section className='userchat'>
            <Link to={`profile/${
                (( userid !== first_user.id ) && first_user.name ) || (second_user && ( ( userid !== second_user.id ) && second_user.name))
            }`}>
                <div className='userchat__iconContainer'>
                    <PersonRoundedIcon/>
                </div>
            </Link>
            <div className='userchat__chat'>
                <Link to={`chat/${
                    (( userid !== first_user.id ) && first_user.name ) || (second_user && ( ( userid !== second_user.id ) && second_user.name))
                }`}>
                    <h3 className='userchat__name'>
                    { (( userid !== first_user.id ) && first_user.name ) || (second_user && ( ( userid !== second_user.id ) && second_user.name))}
                    </h3>
                    <div className={`userchat__chatexert userchat__seen__${seen}`}>
                        {
                            description.length > 30 ?  `${description.slice(0,30)}...` : description
                        }
                    </div>
                </Link>
            </div>
        </section>
        )
        }else {
            return <></>
        }
}
const mapStateToProps=state=>{
    return {
        userid:state.profile.userid
    }
}
export default connect(mapStateToProps)(UserChat)