import React, { Component }from 'react';
import Wall from '../Wall';

class MyMemes extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <h2>My Memes</h2>
                <Wall userWall={true} token={this.props.token} />
            </div>
        )
    }
}

export default MyMemes;