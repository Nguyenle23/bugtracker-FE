import React, {useState, useEffect} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import {isEmpty} from 'lodash';

import './BoardContent.scss';
import Column from '../Column/Column.js';
import { mapOrder } from '../../utilities/sort.js';
import { applyDrag } from '../../utilities/dragDrop';
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

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns];
    newColumns = applyDrag(newColumns, dropResult);
    setColumns(newColumns);

    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(column => column.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = [...columns];

      let currentColumn = newColumns.find(column => column.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map(card => card.id);

      setColumns(newColumns);
    }
  }

  return (
    <div className="board-content">
      <Container 
        orientation="horizontal" 
        onDrop={onColumnDrop}
        getChildPayload={index =>
          columns[index]
        }
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'column-drop-preview'
          }} 
      >
        {columns.map(column => (
          <Draggable key={column.id}>
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus icon" />Add another column
      </div>
    </div>
  )
}

export default BoardContent