import {Link , Navigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import {connect} from 'react-redux'
import {login} from '../stateManagement/actions/auth'
import CSRFToken from '../components/CSRFToken'
import ChatlyLogo from '../assets/svg/Clp.svg'
import { clearAuthErrors } from '../stateManagement/actions/auth'

const Login=({login , isAuthenticated,login_success,clearAuthErrors})=>{
    //clears authentication errors when the page rerenders
    useEffect(()=>{clearAuthErrors()},[clearAuthErrors])

    const [formData , setFormData]=useState({
        username:'',
        password:''
    })
    const [isLoading , setIsLoading]=useState(false)
    const handleChange=(e)=>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }
    const {username , password}=formData
    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(username.trim() && password.trim()){
            setIsLoading(true)
            await login(username , password)
            setFormData({
                username:'',
                password:''
            })
            setIsLoading(false)
        }
    }
    if(isAuthenticated){
        return <Navigate to='/'/>
    }
    return (
        <section className='login'>
            <main className='formContainer'>
            <div className='form__header'>
                <img src={ChatlyLogo} alt='chatly_logo'/>
                <h1>Login</h1>
            </div>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <CSRFToken/>
                    {!login_success && <div className='form_error'>Login failed incorrect <b> Username</b> or <b>Pasword</b></div>}
                    <div className='form__field'>
                        <label htmlFor='username'>Username</label>
                        <input type='text' name='username' onChange={handleChange} value={username}/>
                    </div>
                    <div className='form__field'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' onChange={handleChange} value={password}/>
                    </div>
                    <div className='form__submitBtnContainer'>
                        {!isLoading && <button type='submit'>Login</button>}
                        {isLoading && <button type='button' style={{
                            background:"#4980f8"
                        }}>Loading...</button>}
                    </div>
                    <p className='form__footer'> Don't have an account ?
                        <Link to='/signup'>
                    SignUp</Link></p>
                </form>
            </main>
        </section>
    )
}
const mapStateToProps=state=>{
    return {
        isAuthenticated:state.auth.isAuthenticated,
        login_success:state.auth.login_success
    }
}
export default connect(mapStateToProps , {login,clearAuthErrors})(Login)