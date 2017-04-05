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
    const concatData = dataArray.map(v => v);
    const layout = {
      title: '2 Week Sprint'
    };
    Plotly.newPlot(this.div,concatData, layout);
  }

  render() {
    return (
      <div className="plot-wrapper">
        <div ref={comp => this.div = comp} />
      </div>
    )
  }
}

export default Plot;
