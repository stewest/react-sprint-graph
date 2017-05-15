import React from 'react';
import ReactDOM from 'react-dom';
import LoaderImg from './components/Loader'
import Plot from './components/Plot';
import Velocity from './components/Velocity';
import api from 'jira-agile-api-client';
import queryString from 'query-string';
import styled from 'styled-components';

// Set JIRA Url.
api.setEndpoint('http://localhost:3001');

const args = queryString.parse(location.search);

let intro = '';

if (!args.boardId || !args.sprintId) {
  intro = 'Please provide boardId and sprintId parameters.';
} else {
  intro = <LoaderImg />;
}

ReactDOM.render(
  <div className="wrapper">
    {intro}
  </div>,
  document.getElementById('root')
);

api.util.getSprintWithHistory(args.boardId, args.sprintId).then(function ({ history, sprint }) {

  // api.util.getSprintHistory(args.boardId, args.sprintId).then(function (stats) {
  // console.log(stats);

  let days = [],
    totalPoints = [],
    demoDeployDonePoints = [],
    testingPoints = [],
    donePoints = [];


  history.forEach(({ date, stats }) => {
    // Make sure all status are initialized.
    stats = {
      'Done': 0,
      'Demo': 0,
      'Closed': 0,
      'Testing': 0,
      'In Progress': 0,
      'To Do': 0,
      ... stats
    };

    days.push(date);

    donePoints.push(stats['Done'] + stats['Closed']);

    testingPoints.push(stats['Testing']);

    demoDeployDonePoints.push(stats['Done'] + stats['Closed'] + stats['Demo']);

    totalPoints.push(stats['Done'] + stats['Demo'] + stats['Closed'] + stats['Testing'] + stats['In Progress'] + stats['To Do']);
  });

  // create an array of day numbers ascending.
  const graphDays = days.map((days, index) => {
    return index;
  });
  // Curve expects 12 working days, so needed to give it this array
  const twoWeek = [14,13,12,11,10,9,8,7,6,5,4,3,2,1];
  // Draw base curve on graph
  const basePoints = graphDays.map((totalPoints, twoWeek) => {
    let percentage = 5;
    return Math.pow((totalPoints) + (totalPoints * ((percentage++)/100)), 1.65);
  }).reverse();

  let basePointsRound = parseFloat(basePoints[0]).toFixed(2);

  const lines = [
    {
      x: days,
      y: totalPoints,
      name: 'Total Points: ' + totalPoints[0],
    },
    {
      x: days,
      y: demoDeployDonePoints,
      name: 'Demo / Deploy / Done: ' + demoDeployDonePoints[0],
    },
    {
      x: days,
      y: testingPoints,
      name: 'Points in Testing: ' + testingPoints[0],
    },
    {
      x: days,
      y: donePoints,
      name: 'DONE: ' + donePoints[0],
    },
    {
      x: days,
      y: basePoints,
      name: 'Base Curve: ' + basePointsRound,
      line: {
        dash: 'dashdot',
        width: 1
      }
    },
  ];

  // console.log(lines);

  ReactDOM.render(
    <div className="wrapper">
      <h1 className="title">Jira Burn Up for { sprint.name }</h1>
      <Plot Data={lines} Type="scatter" Days={days.length}/>
      <Velocity vDays={days.length} dPoints={donePoints} />
    </div>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});