import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path = '/' Component={}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
