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
  // console.log(sprint);
  return api.util.getSprintHistory(args.boardId, args.sprintId);
}).then(function (stats) {

  // api.util.getSprintHistory(args.boardId, args.sprintId).then(function (stats) {
  // console.log(stats);

  let days = [],
    totalPoints = [],
    demoDeployDonePoints = [],
    testingPoints = [],
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

    testingPoints.push(stats['Testing']);

    demoDeployDonePoints.push(stats['Done'] + stats['Closed'] + stats['Demo']);

    totalPoints.push(stats['Done'] + stats['Demo'] + stats['Closed'] + stats['Testing'] + stats['In Progress'] + stats['To Do']);
  });

  // y = x2 + 2
  // const daysTotal = days.length;
  // const finalPoints = totalPoints[0];
  // const spacing = (finalPoints / daysTotal);

  // console.log('number of days ' + daysTotal);
  // console.log('last days points ' + finalPoints);
  // console.log(' spacing ' + spacing);
  // console.log(totalPoints);

  // create an array of day numbers ascending.
  const graphDays = days.map((days, index) => {
    return index;
  });
  // Curve expects 14 days, so needed to give it this array
  const twoWeek = [14,13,12,11,10,9,8,7,6,5,4,3,2,1,0];
  // Draw base curve on graph
  const basePoints = graphDays.map((totalPoints, twoWeek) => {
    let percentage = 5;
    return Math.pow((totalPoints) + (totalPoints * ((percentage++)/100)), 1.65);
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
      y: testingPoints,
      name: 'Points in Testing',
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
      <Plot Data={lines} Type="scatter" Days={days.length}/>
    </div>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});


// Make a baswe curve that can automatically take the totalPoints points, and then make day points along the curve which equals the days array.