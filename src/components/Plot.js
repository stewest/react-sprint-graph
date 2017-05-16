/**
 * This component should render a plot with Plotly, taking these three props:
 *
 * - xData: the data to be rendered on the x-axis as an array
 * - yData: The data to be rendered on the y-axis as an array
 * - type:  The type of plot we want Plotly to render
 *
 * To see an example of how you should use Plotly look at the index.html file in the public/ folder.
 * (and feel free to delete the code in there)
 */
import React, { Component } from 'react';
import Plotly from 'plotly.js/dist/plotly.js';
import styled from 'styled-components';

const PlotWrapper = styled.div`
  margin: auto;
  width: 80%;
  .main-svg:first-of-type {
    background-color: #FAFAFA!important;
    border-radius: 8px;
  }
  .bg {
    fill: #FAFAFA!important;
  }
  @media screen and (max-width: 425px) {
  .plot-wrapper&:before {
    content: "Rotate your phone to see the graph in its full glory. 🔄📈";
    display: block;
    font-size: 1em;
    background-color: palevioletred;
    color: white;
    border-radius: 3px;
    padding: 0.5em 1em;
    margin-bottom: 1em;
    text-align: center;
  }
`
class Plot extends Component {
  componentDidMount() {
    this.drawPlot();
  }

  componentDidUpdate() {
    this.drawPlot();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.Data !== nextProps.Data;
  }

  drawPlot = () => {
    const dataArray = this.props.Data;
    const days = this.props.Days - 1;
    const concatData = dataArray.map(v => v);
    const layout = {
      title: 'Day ' + days + ' of 14 Day Sprint'
    };
    Plotly.newPlot(this.div,concatData, layout);
  }

  render() {
    return (
      <PlotWrapper>
        <div ref={comp => this.div = comp} />
      </PlotWrapper>
    )
  }
}

export default Plot;
