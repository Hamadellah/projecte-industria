import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './user/pages/homePage'
function App() {
 return <>
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
    </Routes>
  </BrowserRouter>
 
 </>
}

export default App
