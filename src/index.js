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
  ];

  console.log(lines);

  ReactDOM.render(
    <div className="wrapper">
      <h1 className="title">React - DBB</h1>
      <Plot Data={lines} Type="scatter"/>
    </div>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});
