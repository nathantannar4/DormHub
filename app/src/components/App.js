import React, { Component } from 'react';
import NavigationBar from './NavigationBar'
import Main from './Main'

// this component will be rendered by our <___Router>
class App extends Component {
  render() {
    return (
      <div>
        <NavigationBar />
        <Main />
      </div>
    );
  }
}

export default App;
