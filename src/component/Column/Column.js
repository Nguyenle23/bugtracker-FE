import React from 'react'

import './Column.scss'
import Task from '../Task/Task.js';


function Column() {
    return (
        <div className="column"> 
          <header>
            <h1>Board Columns</h1>
          </header>

          <ul className="task-list">
            <Task />
            <Task />
            <li className="task-item">Description</li>
            <li className="task-item">Description</li>
            <li className="task-item">Description</li>
            <li className="task-item">Description</li>
            
          </ul>

          <footer>Add another card</footer>
        </div>
    )
}

export default Column