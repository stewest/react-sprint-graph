
import React, { Component } from 'react';
import GoalItem from './GoalItem';
import GoalInput from './GoalInput';
import styled from 'styled-components';

const GoalListSection = styled.div`
  display: block;
  height: auto;
  text-align: left;
  width: 100%;
  ul {
    clear: both;
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: 2rem 0;
    li {
      flex: 0 1 50%;
      float: left;
      line-height: 1.5rem;
      margin-bottom: 4px;
      //width: calc(50% - 32px);
      label {
        display: block;
        padding-left: 0px;
        width: 98%;
      }
      input {
        margin-left: -20px;
      }
    }
  }
`

const GoalInputWrapper = styled.div`
  clear: both;
  display: block;
  float: none;
  margin: 2rem 0;
  width: 100%;
  input {
    border-radius: 4px;
    height: 1.5rem;
    min-width: 300px;
    padding: 6px;
  }
`

class GoalList extends Component {
  
  state = {
    items: this.props.items,
    inputValue: '',
  }

  // Check an item
  checkItem = (text) => {
    this.setState({
      items: this.state.items.map(item => {
        if (item.text !== text) return item;

        return {
          ...item,
          checked: !item.checked,
        };
      }),
    });
  }

  // Add an item
  addItem = (evt) => {
    evt.preventDefault();
    this.setState({
      items: this.state.items.concat([{
        text: this.state.inputValue,
        checked: false,
      }]),
    });
  }

  // Edit the input
  editInput = (evt) => {
    this.setState({
      inputValue: evt.target.value,
    })
  }

  render() {
    return (
      <GoalListSection>
        <h2>Sprint Goals</h2>
        <ul>
          {this.state.items.map((item, index) => (
            <li key={index}>
              <GoalItem
                onClick={this.checkItem}
                text={item.text}
                checked={item.checked}
              />
            </li>
          ))}
        </ul>
        <GoalInputWrapper>
          <h3>Add a new item</h3>
          <form onSubmit={this.addItem}>
            <GoalInput
              onChange={this.editInput}
              value={this.state.value}
            />
          </form>
        </GoalInputWrapper>
      </GoalListSection>
    )
  }
}

export default GoalList;
