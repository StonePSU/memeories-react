import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function protectedRoute(ProtectedComponent, isLoggedIn = false, token) {
    return class extends Component {
        constructor(props) {
            super(props);
        }
        
        render() {
            return (<div className='container'>
                {
                    isLoggedIn ? <ProtectedComponent token={token} />
                    : <Redirect to='/' />
                }
                </div>
            )
        }
    }
}