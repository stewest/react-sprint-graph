import React from 'react';
import ReactDOM from 'react-dom';
import LoaderImg from './components/Loader'
import Plot from './components/Plot';
import Velocity from './components/Velocity';
import api from 'jira-agile-api-client';
import queryString from 'query-string';
import styled from 'styled-components';
import GoalList from './components/GoalList';

// Set JIRA Url.
api.setEndpoint('http://localhost:3001');

const args = queryString.parse(location.search);

let intro = '';

if (!args.boardId || !args.sprintId) {
  intro = 'Please provide boardId and sprintId parameters.';
} else {
  intro = <LoaderImg />;
}

const MainWrapper = styled.div`
  background-color: #e2e2e2;
  border-radius: 4px;
  margin: 0 auto;
  padding: 2em;
  width: calc(80%);

  .title {
    text-align: center;
    margin-bottom: 2em;
    font-size: 1.5em;
  }

  .title:after {
    content: "😎";
    display: inline-block;
    margin-left: 0.5em;
  }
`

ReactDOM.render(
  <MainWrapper>
    {intro}
  </MainWrapper>,
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

  // create an array of day numbers ascending for the base curve.
  const graphDays = days.map((days, index) => {
    return index;
  });

  // Draw base curve on graph
  const basePoints = graphDays.map((totalPoints) => {
    let percentage = 5;
    return Math.pow((totalPoints) + (totalPoints * ((percentage++)/100)), 1.6);
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
      line: {shape: 'spline'},
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
        shape: 'spline',
        width: 1
      }
    },
  ];
  // console.log(lines);

  
// TODO: Store and retreive these externally  
const goals = [{
    text: 'Improve knowledge sharing',
    checked: true,
  }, {
    text: 'Accurate estimations & planning',
    checked: false,
  }, {
    text: 'Balance workload across team members',
    checked: false,
  }, {
    text: 'Transparency of whats going on',
    checked: false,
  }, {
    text: 'Focus - reduce the amount of projects a team member is working on',
    checked: false,
  }, {
    text: 'Empower the team to take decisions',
    checked: false,
  }, {
    text: 'Make it work both for maintenance & new development projects without a dedicated maintenance team',
    checked: false,
  }, {
    text: 'Efficiency gains',
    checked: false,
}];

  ReactDOM.render(
    <MainWrapper>
      <h1 className="title">Jira Burn Up for { sprint.name }</h1>
      <Plot Data={lines} Type="scatter" Days={days.length}/>
      <Velocity vDays={days.length} dPoints={donePoints} />
      <GoalList items={goals} />
    </MainWrapper>,
    document.getElementById('root')
  );
}).catch(function (error) {
  console.log(error);
});
