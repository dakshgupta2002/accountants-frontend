import React from 'react'
import { useNavigate } from 'react-router-dom'
import AboutUs from '../elements/AboutUs';
import Introduction from '../elements/Introduction';
import Services from '../elements/Services';
import Header from '../Header';

export default function Home() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/login')
    }
  }, [])

  return (

    <div>
      <Header />
      <Introduction/>
      <Services/>
      <AboutUs/>
    </div>

  )
}
