import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import ErrorPage from './pages/ErrorPage'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path = '/' Component={Dashboard}></Route>
          <Route path = '/login' Component={Login}></Route>
          <Route path = 'register' Component={Register}></Route>
          <Route path = '*' Component={ErrorPage}></Route>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
