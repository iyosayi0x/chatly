import Footer from '../components/Footer'
import {connect} from 'react-redux'
import {check_authenticated} from '../stateManagement/actions/auth'
import {load_user} from '../stateManagement/actions/profile'
import { useEffect } from 'react'

const Layout=({children,check_authenticated,load_user})=>{

    useEffect(()=>{
        (async ()=>{
            await check_authenticated()
            await load_user()
        })()
    },[load_user , check_authenticated])
    return (
        <>
        {children}
        </>
    )
}
export default connect(null , {check_authenticated,load_user})(Layout)