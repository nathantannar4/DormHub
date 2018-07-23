import React from 'react'
import { Link } from 'react-router-dom'

class NavigationBar extends React.Component {

  render() {
    return (
      <header>
        <nav>
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/persons'>Persons</Link></li>
            <li><Link to='/seekers'>Seekers</Link></li>
            <li><Link to='/landlords'>Landlords</Link></li>
            <li><Link to='/housing'>Housing</Link></li>
            <li><Link to='/homeSwappers'>Home Swappers</Link></li>
            <li><Link to='/reviews'>Reviews</Link></li>
            <li><Link to='/ratings'>Ratings</Link></li>
            <li><Link to='/locations'>Location</Link></li>
          </ul>
        </nav>
      </header>
    )
  }
}

export default NavigationBar;