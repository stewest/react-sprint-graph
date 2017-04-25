import React from 'react';
import ReactDOM from 'react-dom';
import LoaderImg from './Loader'
import Plot from './Plot';
import api from 'jira-agile-api-client';
import queryString from 'query-string';

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

let sprint;
api.sprint.getSingle(args.sprintId).then(s => {
  sprint = s;
  console.log(sprint);
  return api.util.getSprintHistory(args.boardId, args.sprintId);
}).then(function (stats) {

  // api.util.getSprintHistory(args.boardId, args.sprintId).then(function (stats) {
  // console.log(stats);

  let days = [],
    totalPoints = [],
    demoDeployDonePoints = [],
    donePoints = [];

  stats.forEach(({ date, stats }) => {
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
    demoDeployDonePoints.push(stats['Done'] + stats['Closed'] + stats['Demo']);

    totalPoints.push(stats['Done'] + stats['Demo'] + stats['Closed'] + stats['Testing'] + stats['In Progress'] + stats['To Do']);
  });

  // y = x2 + 2
  let daysTotal = days.length;
  let finalPoints = totalPoints[0];
  let spacing = (finalPoints / daysTotal);

  // console.log('number of days ' + daysTotal);
  // console.log('last days points ' + finalPoints);
  // console.log(' spacing ' + spacing);
  // console.log(totalPoints);

  // create an array of day numbers ascending.
  const graphDays = days.map((days, index) => {
    return index;
  });

  let dayPoints = totalPoints;

  // Draw base curve on graph
  const basePoints = graphDays.map((dayPoints, graphDays) => {
  // return Math.pow(y, 2) + spacing; // this is too tall
  // =B3+(C4*5%)
    let percentage = 5;
    // need to make this a more smooth curve.
    return (dayPoints + (dayPoints * ((percentage++))));

  }).reverse();

  const lines = [
    {
      x: days,
      y: totalPoints,
      name: 'Total',
    },
    {
      x: days,
      y: demoDeployDonePoints,
      name: 'Demo / Deploy / Done',
    },
    {
      x: days,
      y: donePoints,
      name: 'Points Done',
    },
    {
      x: days,
      y: basePoints,
      name: 'Base Curve'
    },
  ];

  // console.log(lines);

  ReactDOM.render(
    <div className="wrapper">
      <h1 className="title">Jira Burn Up for { sprint.name }</h1>
      <Plot Data={lines} Type="scatter" Days={daysTotal}/>
    </div>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});


// Make a baswe curve that can automatically take the totalPoints points, and then make day points along the curve which equals the days array.