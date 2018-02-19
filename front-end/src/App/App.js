import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import Nav from '../Nav';
import { Switch, Route } from 'react-router-dom';
import MyMemes from '../MyMemes';
import Home from '../Home';
import MastHead from '../MastHead'
import protectedRoute from '../protectedRoute';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isAuthenicated: false,
      user: null,
      token: '',
      displayName: ""
    }
    
  }
  
  onSuccess = (response) => {
    const token = response.headers.get('x-auth-token');
    response.json().then(user => {
      if (token) {
        this.setState({
          isAuthenticated: true, 
          user: user, 
          token: token,
          displayName: user.twitter.displayName
        });
      }
    });
  };

  onFailed = (error) => {
    alert(error);
  };

  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null})
  };
  

  render() {
    return (
      <div>
        <MastHead />
        <Nav isLoggedIn={this.state.isAuthenticated} displayName={this.state.displayName} onSuccess={this.onSuccess} onFailed={this.onFailed} logout={this.logout}>
          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/my-memes' component={protectedRoute(MyMemes, this.state.isAuthenticated, this.state.token)} />
          </Switch>
        </Nav>
      </div>
    );
  }
}

export default App;
