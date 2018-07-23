import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './NavigationBar.css';
import NavLink from './NavLink'

class NavigationBar extends Component {

  render() {
    return (  
      <div className="header">
        <h1>DormHub</h1>
        <div className="header-right">
          <Link to='/'>Home</Link>
          <NavLink to='/persons'>Persons</NavLink>
          <NavLink to='/seekers'>Seekers</NavLink>
          <NavLink to='/landlords'>Landlords</NavLink>
          <NavLink to='/housing'>Housing</NavLink>
          <NavLink to='/homeSwappers'>Home Swappers</NavLink>
          <NavLink to='/reviews'>Reviews</NavLink>
          <NavLink to='/ratings'>Ratings</NavLink>
          <NavLink to='/locations'>Location</NavLink>
        </div>
      </div>
    )
  }
}

export default NavigationBar;