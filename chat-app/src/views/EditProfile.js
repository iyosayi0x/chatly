import CSRFToken from '../components/CSRFToken'
import {useState} from 'react'
import ChatlyLogo from '../assets/svg/Clp.svg'
import {connect} from 'react-redux'
import {load_user} from '../stateManagement/actions/profile'
import {Navigate, Link} from 'react-router-dom'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import axios from 'axios'
import Cookies from 'js-cookie'
const UpdateProfile=({first_name , last_name, bio, profile_image_url,isAuthenticated})=>{

    const [formData , setFormData]=useState({
        first_name:first_name,
        last_name:last_name,
        bio:bio
    })
    const {first_name:fname,last_name:lname,bio:user_bio}=formData
    const [profile_image , setProfileImage]=useState(profile_image_url)
    const editProfile=async()=>{
        const config = {
            headers:{
                "Content-type":"multipart/form-data",
                "Accept":"application/json",
                "x-CSRFToken":Cookies.get('csrftoken')
            }
        }
        const body = new FormData()
        body.append("fname",fname)
        body.append("lname",lname)
        body.append("user_bio",user_bio)
        body.append("profile_image", profile_image , profile_image?.name)
        try{
            await axios.post(`${process.env.REACT_APP_API_URL}/profile/edit/`,body , config)
            load_user()
        }catch(err){}
    }
    const [isLoading, setIsLoading]=useState(false)

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(profile_image || fname.trim() || lname.trim() || user_bio.trim()){
            setIsLoading(true)
            await editProfile()
            setIsLoading(false)
        }
    }
    const handleChange=(e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }
    const arrowBackStyle = {
        position:"absolute",
        top:"1rem",
        left:"1rem",
        fontSize:"1.2rem",
        background:"#f9f9f9",
        padding:".2rem .7rem",
        borderRadius:".3rem"
    }
    if (!isAuthenticated){
        return <Navigate to='/login'/>
    }
    return (
        <section className='editprofile'>
            <Link to='/' style={arrowBackStyle}><ArrowBackRoundedIcon/></Link>
            <section className='formContainer'>
                <div className='form__header'>
                    <img src={ChatlyLogo} alt='chatly_logo'/>
                    <h1 style={{
                        fontSize:'2.2rem'
                    }}>EditProfile</h1>
                </div>
                <form onSubmit={(e)=>handleSubmit(e)}>
                        <CSRFToken/>
                        <div className='form__field'>
                            <label htmlFor='profile_image'>Profile Picture</label>
                            <input type='file' name='profile_image' onChange={(e)=> setProfileImage(e.target.files[0])}
                            style ={{
                                background:'#f9f9f9f9'
                            }}
                            />
                        </div>
                        <div className='form__field'>
                            <label htmlFor='first_name'>First Name</label>
                            <input type='text' name='first_name' onChange={handleChange} value={fname}/>
                        </div>
                        <div className='form__field'>
                            <label htmlFor='last_name'>Last Name</label>
                            <input type='text' name='last_name' onChange={handleChange} value={lname}/>
                        </div>
                        <div className='form__field'>
                            <label htmlFor='last_name'>Bio</label>
                            <input type='text' name='bio' onChange={handleChange} value={user_bio}/>
                        </div>
                        <div className='form__submitBtnContainer'>
                        {!isLoading && <button type='submit'>Update</button>}
                        {isLoading && <button type='button' style={{
                            background:"#4980f8"
                        }}>Loading...</button>}
                        </div>
                </form>
            </section>
        </section>
    )
}
const mapStateToProps=state=>{
    return {
        first_name:state.profile?.first_name,
        last_name:state.profile?.last_name,
        bio:state.profile?.bio,
        profile_image_url:state.profile?.profile_image_url,
        isAuthenticated:state.auth.isAuthenticated,
    }

}
export default connect(mapStateToProps,{load_user})(UpdateProfile)