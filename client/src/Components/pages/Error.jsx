import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Error() {

  const navigate = useNavigate();
  return (
    <div>
      <img src="https://i.imgur.com/qIufhof.png" alt="404"/>
            <div id="info">
                <h3>This page could not be found</h3>
            </div>
    </div>
  )
}
