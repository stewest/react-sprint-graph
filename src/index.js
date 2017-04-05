import React from 'react';
import ReactDOM from 'react-dom';
import Plot from './Plot';


const storyPoints = {
  // Days of sprint
  x: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"],
  // Story Points
  y: [19.82, 18.95, 18.64, 17.99, 17.14, 17.29, 17.26, 17.54, 17.46, 18.95, 18.64, 17.99, 17.14, 17.29,],
  name: 'Story Points'
}

const baseCurve = {
  x: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14"],
  y: [0,5.225,11.555,18.94,27.46,37.585,50.95,65.95,82.72,100.78,121.33],
  name: 'Base'
}

const data = [baseCurve, storyPoints];

ReactDOM.render(
  <div className="wrapper">
    <h1 className="title">DBB - 2 Week Sprint Data</h1>
    <Plot Data={data} Type="scatter"/>
  </div>,
  document.getElementById('root')
);
