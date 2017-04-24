import React from 'react';
import ReactDOM from 'react-dom';
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
  intro = 'Loading...';
}

ReactDOM.render(
  <div className="wrapper">
    {intro}
  </div>,
  document.getElementById('root')
);

api.util.getSprintHistory(args.boardId, args.sprintId).then(function (stats) {
  console.log(stats);

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

console.log(daysTotal);
console.log(finalPoints);
console.log(spacing);

let graphDays = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0];

const basePoints = graphDays.map((y) => {
  return y * spacing;
});


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
      name: 'Done',
    },
    {
      x: days,
      y: basePoints,
      name: 'Base Curve'
    },
  ];

  console.log(lines);

  ReactDOM.render(
    <div className="wrapper">
      <h1 className="title">React - Jira Burn Up</h1>
      <Plot Data={lines} Type="scatter"/>
    </div>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});


// Make a baswe curve that can automatically take the totalPoints points, and then make day points along the curve which equals the days array.