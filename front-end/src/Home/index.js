import React from 'react';
import Wall from '../Wall';

const Home = (props) => {
    
    return (
      <div className='container'>
        <h2>Home</h2>
        <Wall userWall={false} />
      </div>
    )
}

export default Home;