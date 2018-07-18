import React from 'react'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
const NavigationBar = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit">
            DormHub
          </Typography>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/persons'>Persons</Link></li>
          </ul>
        </Toolbar>
      </AppBar>
    </div>
  )
}
export default NavigationBar;