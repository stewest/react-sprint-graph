import React, { Component } from 'react';
import styled from 'styled-components';

const VeloWrapper = styled.div`
	display: block;
	margin: auto;
	text-align: center;
	width: 100%;
`
class Velocity extends Component {
  
  render() {
    return (
      <VeloWrapper>
        <div>Current Velocity: </div>
      </VeloWrapper>
    )
  }
}

export default Velocity;
