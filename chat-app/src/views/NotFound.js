import {Link} from 'react-router-dom'
import Footer from '../components/Footer'

const NotFound=()=>{
    return (
        <section className='notFound'>
            <h1 className='notFound__bigText'>
                Opps
            </h1>
            <p className='notFound__message'> Sorry the page you're looking for could not be found :(</p>
            <div className='notFound__linkBtn'>
                <Link to='/'>Back Home</Link>
            </div>
            <Footer/>
        </section>
    )
}
export default NotFound