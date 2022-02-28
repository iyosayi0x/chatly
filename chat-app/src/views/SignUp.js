import {Link , Navigate} from 'react-router-dom'
import {useState,useEffect} from 'react'
import {connect} from 'react-redux'
import { create_user } from '../stateManagement/actions/auth'
import CSRFToken from '../components/CSRFToken'
import ChatlyLogo from '../assets/svg/Clp.svg'
import {clearAuthErrors} from '../stateManagement/actions/auth'

const SignIn=({create_user,sign_up_errors,sign_up_message,isAuthenticated,clearAuthErrors})=>{
    // clears authentication errors when the pages rerenders
    useEffect(()=>{clearAuthErrors()},[clearAuthErrors])

    const [formData , setFormData]=useState({
        username:'',
        password1:'',
        password2:''
    })

    const [isLoading , setIsLoading]=useState(false)
    const [termsAgreed , setTermsAgreed]=useState(true)
    const handleChange=(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value})
    }
    const {username , password1 , password2}= formData
    const handleSubmit=async(e)=>{
        e.preventDefault()
        if(username.trim() && password1.trim() && password2.trim()){
            if(!agree){
                setTermsAgreed(false)
                return
            }
            setTermsAgreed(true)
            setIsLoading(true)
            await create_user(username , password1 , password2)
            setFormData({
                username:'',
                password1:'',
                password2:''
            })
            setIsLoading(false)
        }
    }
    const [agree , setAgree]=useState(false)

    if(isAuthenticated){
        return <Navigate to='/'/>
    }
    return (
        <section className='signin'>
            <main className='formContainer'>
                {
                    sign_up_message === "success" && <div className='form_success'>User successfully created , proceed to login</div>
                }

                <form onSubmit={(e)=>handleSubmit(e)}>
                    <div className='form__header'>
                    <img src={ChatlyLogo} alt='chatly_logo'/>
                    <h1>SignUp</h1>
                    </div>
                    <CSRFToken/>
                    <div className='form__field'>
                        <label htmlFor='username'>Username</label>
                        <input type='text' name='username' onChange={handleChange} value={username} minLength="3" required/>
                        {
                            sign_up_errors?.username && sign_up_errors?.username.map(error=><div className='form_error' key={error}>{error}</div>)
                        }
                    </div>
                    <div className='form__field'>
                        <label htmlFor='password1'>Password</label>
                        <input type='password' name='password1' onChange={handleChange} value={password1} minLength="8" required/>
                        {
                            sign_up_errors?.password1 && sign_up_errors?.password1.map(error=><div className='form_error' key={error}>{error}</div>)
                        }
                    </div>
                    <div className='form__field'>
                        <label htmlFor='password2'>Confirm password</label>
                        <input type='password' name='password2' onChange={handleChange} value={password2} minLength="8" required/>
                        {
                            sign_up_errors?.password2 && sign_up_errors?.password2.map(error=><div className='form_error' key={error}>{error}</div>)
                        }
                    </div>
                    <div className='form__field field_inline'>
                        <input type='checkbox' value={agree}
                        onChange={e =>{
                            agree === false ? setAgree(true) : setAgree(false)
                        }}
                        /> <span> I agree to the <Link to='privacy_policy'>privacy policy</Link> and <Link to='terms_of_use'>terms of use</Link></span>
                        {!termsAgreed && <div className='form_error'>You've not yet agreed to the privacy policy and terms of use</div>}
                    </div>
                    <div className='form__submitBtnContainer mgt-1'>
                        {!isLoading && <button type='submit'>Sign Up</button>}
                        {isLoading && <button type='button' style={{
                            background:"#4980f8"
                        }}>Loading...</button>}
                    </div>
                    <p className='form__footer'> Already have an account ?
                        <Link to='/login'>
                    Login </Link></p>
                </form>
            </main>
        </section>
    )
}

const mapStateToProps=state=>{
    return {
        sign_up_errors:state.auth.sign_up_errors,
        sign_up_message:state.auth.sign_up_message,
        isAuthenticated:state.auth.isAuthenticated,
    }
}
export default connect(mapStateToProps , {create_user,clearAuthErrors})(SignIn)