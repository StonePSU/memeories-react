import React from 'react';
import './Nav.css';
import { Link } from 'react-router-dom';
import TwitterLogin from 'react-twitter-auth';

class Nav extends React.Component {
    
    constructor(props) {
        super(props);
    }
    
    componentDidMount() {
        let navbar = document.querySelector('.navbar');
        let navTop = navbar.getBoundingClientRect().top;
        
        window.addEventListener('scroll', ()=> {
            if (window.scrollY >= navTop) {
                navbar.classList.add('sticky')
            } else {
                navbar.classList.remove('sticky');
            }
        })
    }
    
    render() {
        return (
            <div>
                <nav className='navbar bg-gray'>
                    <ul className='navmenu'>
                        <li><Link to='/' className='menu-item'>View All</Link></li>
                    </ul>
                    {this.props.isLoggedIn ? 
                    <ul className='navmenu'>
                        <li><Link to='/my-memes' className='menu-item'>Just Mine</Link></li>
                    </ul> 
                    : ""}
                    { !this.props.isLoggedIn ?
                    <ul className='navmenu push-flex-right'>
                        <li><TwitterLogin loginUrl="/auth/twitter" onFailure={this.props.onFailed} onSuccess={this.props.onSuccess} requestTokenUrl="/auth/twitter/reverse"/></li>
                    </ul>
                      :
                    <ul className='navmenu push-flex-right'>
                      <li className='menu-item'>Welcome, {this.props.displayName}</li>
                      <li><button type='button' className='menu-item' onClick={this.props.logout}>Log Out</button></li>
                    </ul>
                    }
                </nav>
                {this.props.children}
            </div>

        );
    }
}

export default Nav;