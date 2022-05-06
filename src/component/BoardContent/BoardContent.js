import React, {useState, useEffect} from 'react'
import {isEmpty} from 'lodash'

import './BoardContent.scss'
import Column from '../Column/Column.js';
import { mapOrder } from '../../utilities/sort.js';
import { initialData } from '../../actions/initialData.js';

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const boardFromDB = initialData.boards.find(board => board.id === 'board-1');
    if (boardFromDB) {
      setBoard(boardFromDB);
      
      //sort columns
      // boardFromDB.columns.sort(function (a, b) {
      //   return boardFromDB.columnOrder.indexOf(a.id) - boardFromDB.columnOrder.indexOf(b.id);
      // })
      
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="not-found" style={{'padding': '10px', 'color': 'white'}}>Board not found</div>
  }

  return (
    <div className="board-content">
      {columns.map(column => <Column key={column.id} column={column} />)}
    </div>
  )
}

export default BoardContent