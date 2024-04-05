import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import ChatPage from './pages/ChatPage'
import { useSelector } from 'react-redux'
import Developer from './Components/Developer/Developer'
import Guide from './Components/Guide/Guide'

function App() {
  const user  = useSelector(state => state.log)
  return (
    <>
      <Routes>
        <Route path='/' element={user && user.token == "" ? <Home /> : <ChatPage />} />
        <Route path='/developer' element={<Developer />} />
        <Route path='/guide' element={<Guide />} />
      </Routes>

    </>
  )
}

export default App
