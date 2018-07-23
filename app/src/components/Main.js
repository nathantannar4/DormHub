import React from 'react'
import { Switch, Route } from "react-router-dom";
import Home from './Home'
import Table from './Table'
import View from './View'

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
// https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf
const Main = () => (
  <main>
     <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/persons' component={Table}/>
        <Route exact path='/person/:id' component={View} />
        <Route exact path='/seekers' component={Table}/>
        <Route exact path='/seeker/:id' component={View} />
        <Route exact path='/landlords' component={Table}/>
        <Route exact path='/landlord/:id' component={View} />
        <Route exact path='/reviews' component={Table}/>
        <Route exact path='/review/:id' component={View} />
        <Route exact path='/reviews/:id' component={Table} />
        <Route exact path='/averageReviewScore/:id' component={View} />
        <Route exact path='/ratings' component={Table}/>
        <Route exact path='/locations' component={Table}/>
        <Route exact path='/location/:city' component={View} />
        <Route exact path='/housing' component={Table}/>
        <Route exact path='/housing/:title' component={View}/>
        <Route exact path='/homeSwappers' component={Table}/>
      </Switch>
  </main>
)

export default Main
