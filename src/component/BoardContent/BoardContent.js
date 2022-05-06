import React from 'react'

import './BoardContent.scss'
import Column from '../Column/Column.js';


function BoardContent() {
    return (
      <div className="board-content">
        <Column />
        <Column />
      </div>
    )
}

export default BoardContent