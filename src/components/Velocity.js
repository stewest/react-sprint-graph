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

  let days = this.props.vDays - 1;
  let points = this.props.dPoints[0];
  let veloCalc = points / days;
  let veloCalcRound = parseFloat(veloCalc).toFixed(2);


    return (

      <VeloWrapper>
        <div>{ points } Done points / {days} Days = { veloCalcRound } <span title="Velocity for this sprint">Velocity</span></div>
      </VeloWrapper>
    )
  }
}

export default Velocity;
