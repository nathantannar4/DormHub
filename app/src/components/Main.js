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
        <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
        <Route exact path={`${process.env.PUBLIC_URL}/persons`} component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/person/:id`} component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/seekers`}  component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/seeker:id`} component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/landlords`}  component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/landlord/:id`}  component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/reviews`}  component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/review/:id`}  component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/reviews/:id`}  component={Table} />
        <Route exact path={`${process.env.PUBLIC_URL}/averageReviewScore/:id`} component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/ratings`}  component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/locations`} component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/location/:city`}  component={View} />
        <Route exact path={`${process.env.PUBLIC_URL}/housing`}  component={Table}/>
        <Route exact path={`${process.env.PUBLIC_URL}/housing/:title`}  component={View}/>
        <Route exact path={`${process.env.PUBLIC_URL}/verifiedReviews`}  component={Table}/>
      </Switch>
  </main>
)

export default Main
