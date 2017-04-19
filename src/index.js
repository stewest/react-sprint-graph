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
  let days = [],
      totalPoints = [],
      demoDeployDonePoints = [],
      donePoints = [];

  stats.forEach(({ date, stats }) => {
    days.push(date);

    let sum = stats['Done'];
    donePoints.push(sum);

    sum += stats['Demo'] + stats['Closed'];
    demoDeployDonePoints.push(sum);

    sum += stats['Testing'] + stats['In Progress'] + stats['To Do'];
    totalPoints.push(sum);
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
