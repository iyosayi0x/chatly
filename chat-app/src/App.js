import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import Home from './views/Home'
import Profile from './views/Profile'
import Chat from './views/Chat'
import Follow from './views/Follow'
import Login from './views/Login'
import SignUp from './views/SignUp'
import EditProfile from './views/EditProfile'
import NotFound from './views/NotFound'
import Layout from './hocs/Layout'
import Users from './views/Users'
import {Provider} from 'react-redux'
import store from './store'


function App() {
  return (
    <Provider store={store}>
        <Router>
          <Layout>
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route exact path='login/' element={<Login/>}/>
                <Route exact path='signup/' element={<SignUp/>}/>
                <Route exact path='users/' element={<Users/>}/>
                <Route exact path='profile/edit_profile' element={<EditProfile/>}/>
                <Route exact path='profile/:user_username/' element={<Profile/>}/>
                <Route exact path='chat/:user/' element={<Chat/>}/>
                <Route exact path='follow/:user_username/' element={<Follow/>}/>
                <Route exact path='*' element={<NotFound/>}/>
              </Routes>
          </Layout>
        </Router>
      </Provider>
  );
}

export default App;