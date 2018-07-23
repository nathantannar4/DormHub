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
          <Link to={`${process.env.PUBLIC_URL}/`}>Home</Link>
          <NavLink to={`${process.env.PUBLIC_URL}/persons`}>Persons</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/seekers`}>Seekers</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/landlords`}>Landlords</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/housing`}>Housing</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/reviews`}>Reviews</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/verifiedReviews`}>Verified Reviews</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/ratings`}>Ratings</NavLink>
          <NavLink to={`${process.env.PUBLIC_URL}/locations`}>Location</NavLink>
        </div>
      </div>
    )
  }
}

export default NavigationBar;