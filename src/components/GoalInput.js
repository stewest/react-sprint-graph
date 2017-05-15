import React from 'react';

const GoalInput = (props) => {
  return (
      <input type="text" value={props.value} onChange={props.onChange} placeholder="Add Sprint Goal" />
  )
}

export default GoalInput;
