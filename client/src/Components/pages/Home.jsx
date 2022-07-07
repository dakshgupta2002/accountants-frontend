import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../Header';

export default function Home() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('token') === null) {
      navigate('/login')
    }
  }, [])

  return (

    <>
      <Header />

    </>

  )
}
