import React, { Component } from 'react';
import spinner from '../images/balls.svg';
import styled from 'styled-components';

const Spinner = styled.div`
  display: block;
  margin: auto;
  text-align: center;
  width: 50%;
  img {
    clear: both;
    text-align: center;
    margin: auto;
  }
`

class LoaderImg extends Component {
  
  render() {
    return (
      <Spinner>
        <img src={spinner} alt="Loading" />
        <div>Loading . . .</div>
      </Spinner>
    )
  }
}

export default LoaderImg;
