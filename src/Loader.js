import React, { Component } from 'react';
import spinner from './images/balls.svg';

class LoaderImg extends Component {
  
  render() {
    return (
      <div className="spinner">
        <img src={spinner} />
        <div>Loading . . .</div>
      </div>
    )
  }
}

export default LoaderImg;
