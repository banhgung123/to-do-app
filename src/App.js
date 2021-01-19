import downArrow from './img/down-arrow.svg';
import './App.css';
import React, { Component } from 'react';
import TodoItem from './components/TodoItem/to-do-item';
import classNames from 'classnames';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newItem: '',
      allItems: this.getLS(),
      itemLeft: this.getLS().filter(item => item.completed === false).length,
      edit: false
    }
    this.onHandleKeyUp = this.onHandleKeyUp.bind(this);
    this.onHandleChange = this.onHandleChange.bind(this);
    this.onHandleSelectAllAndDisSelectAll = this.onHandleSelectAllAndDisSelectAll.bind(this);
    this.onHandleClearCompleted = this.onHandleClearCompleted.bind(this);
  }

  getLS() {
    return localStorage.getItem('todoItems') === null ?
    [] : JSON.parse(localStorage.getItem('todoItems')); 
  }

  addLS(item) {
    localStorage.setItem('todoItems', JSON.stringify([...this.getLS(), item]));
  }

  onHandleChange(event) {
    this.setState({
      newItem: event.target.value
    });
  }

  onHandleKeyUp(event) {
    if (event.keyCode === 13) {
      let text = event.target.value;
      if (!text) return;
      text = text.trim();
      if (!text) return;

      let newItem = {
        id: Date.now(),
        title: text,
        completed: false
      }

      this.addLS(newItem);
      this.setState({
        newItem: '',
        allItems: this.getLS(),
        itemLeft: this.getLS().filter(item => item.completed === false).length
      });
    }
  }

  onHandleItemTick(item) {
    return () => {
      let completed = item.completed;
      let { allItems } = this.state;
      let index = allItems.indexOf(item);
      let items = [
        ...allItems.slice(0, index),
        {
          ...item,
          completed: !completed
        },
        ...allItems.slice(index + 1)
      ];
      this.setState({
        allItems: items,
        itemLeft: items.filter(item => item.completed === false).length
      });
      localStorage.setItem('todoItems', JSON.stringify([...items]));
    }
  }

  onHandleItemCancel(item) {
    let { allItems } = this.state;
    let index = allItems.indexOf(item);
    let items = allItems.filter((item, ind) => ind != index);
    this.setState({
      allItems: items,
      itemLeft: items.filter(item => item.completed === false).length
    });
    localStorage.setItem('todoItems', JSON.stringify([...items]));
  }

  onHandleSelectAllAndDisSelectAll() {
    let { allItems } = this.state, 
        items = JSON.parse(JSON.stringify(allItems)),
        updateItems = [],
        countTrue = 0;

    allItems.filter(item => { 
      if (item.completed === true) countTrue++;
    });

    if (countTrue == allItems.length) {
      updateItems = items.map(item => { 
        item.completed = false;
        return item;
      });
    } 
    else {
      updateItems = items.map(item => { 
        item.completed = true;
        return item;
      });
    }
    
    this.setState({
      allItems: updateItems,
      itemLeft: updateItems.filter(item => item.completed === false).length
    });
    localStorage.setItem('todoItems', JSON.stringify([...updateItems]));
  }

  onHandleFilter(filter) {
    return () => {
      let itemLeft = this.getLS().filter(item => item.completed === false).length;
      switch (filter) {
        case 'active':
          this.setState({
            allItems: this.getLS().filter(item => item.completed === false),
            itemLeft: itemLeft
          });
          break;
        case 'completed':
          this.setState({
            allItems: this.getLS().filter(item => item.completed === true),
            itemLeft: itemLeft
          });
          break;
        default:
          this.setState({
            allItems: this.getLS(),
            itemLeft: itemLeft
          });
          break;
      }
    }
  }

  onHandleClearCompleted() {
    let items = this.getLS().filter(item => item.completed === false);
    localStorage.setItem('todoItems', JSON.stringify([...items]));
    this.setState({
      allItems: items,
      itemLeft: items.length
    });
  }

  render() {
    let { newItem, allItems, itemLeft, edit } = this.state;
    return (
      <div className="App">
        <header className="header">
          <h1>todos</h1>
          <div>
            <img 
              className={classNames({
                'hidden': allItems.length === 0, 
                'not-select-all': allItems.filter(item => item.completed === true).length !== allItems.length})} 
              src={downArrow} 
              width={22} 
              onClick={this.onHandleSelectAllAndDisSelectAll}/>
            <input 
              type="text" 
              placeholder="What needs to be done?"
              className="new-todo"
              value={newItem}
              onChange={this.onHandleChange}
              onKeyUp={this.onHandleKeyUp}/>
          </div>
        </header>
        <section className="main">
            <ul className="todo-list">
              { allItems.length > 0 && allItems.map((item, index) =>
                <TodoItem 
                  key={index} 
                  item={item}
                  edit={edit}
                  handleItemTick={this.onHandleItemTick(item)}
                  handleItemCancel={this.onHandleItemCancel.bind(this, item)}/>) }
            </ul>
        </section>
        <footer className="footer">
          <div className={classNames('filter', {'hidden': this.getLS().length === 0})}>
            <p>{itemLeft} item{itemLeft === 1 ? '' : 's'} left</p>
            <button onClick={this.onHandleFilter('all')}>All</button>
            <button onClick={this.onHandleFilter('active')}>Active</button>
            <button onClick={this.onHandleFilter('completed')}>Completed</button>
            <p
              className={
                classNames({
                  'hidden': allItems.filter(item => item.completed === false).length === allItems.length
                })}
              onClick={this.onHandleClearCompleted}>Clear completed</p>
          </div>
          <p></p>
        </footer>
      </div>
    );
  } 
}

export default App;
