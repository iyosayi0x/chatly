import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import{Link} from 'react-router-dom'

const Footer=()=>{
    return (
        <section className='footer'>
            <div className='footer__iconContainer'>
                <Link to='/users/'>
                    <PeopleRoundedIcon/>
                </Link>
            </div>
            <div className='footer__iconContainer'>
                <Link to='/'>
                    <ChatRoundedIcon/>
                </Link>
            </div>
            <div className='footer__iconContainer'>
                <Link to='/profile/me/'>
                    <PersonRoundedIcon/>
                </Link>
            </div>
        </section>
    )
}
export default Footer
