import React, {useState, useEffect, useRef} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BoostrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import {isEmpty} from 'lodash';

import './BoardContent.scss';
import Column from '../Column/Column.js';
import { mapOrder } from '../../utilities/sort.js';
import { applyDrag } from '../../utilities/dragDrop';
import { initialData } from '../../actions/initialData.js';

function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState([]);
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggleOpenNewColumnForm = () => {
    setOpenNewColumnForm(!openNewColumnForm);
  }
  const inputFocus = useRef(null);

  const [newColumnTitle, setNewColumnTitle] = useState('');
  const onNewColumnChangeTitle = (e) => setNewColumnTitle(e.target.value);

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
    return () => {
      setBoard({});
    }
  }, []);

  useEffect(() => {
    if (inputFocus && inputFocus.current) {
      inputFocus.current.focus();
      inputFocus.current.select();
    }
  }, [openNewColumnForm]);


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
 
  const addNewColumn = () => {
    if (!newColumnTitle) {
      inputFocus.current.focus();
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substring(2, 5), //random character
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: [],
    }

    let newColumns = [...columns];
    newColumns.push(newColumnToAdd);
    setColumns(newColumns);

    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(column => column.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);

    setNewColumnTitle('');
    toggleOpenNewColumnForm();
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id;

    let newColumns = [...columns];
    const columIndexToUpdate = newColumns.findIndex(item => item.id === columnIdToUpdate);
    
    if (newColumnToUpdate._destroy) {
      //remove column
      newColumns.splice(columIndexToUpdate, 1);
    } else {
      //update column
      newColumns.splice(columIndexToUpdate, 1, newColumnToUpdate);
    }

    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(column => column.id);
    newBoard.columns = newColumns;
    setBoard(newBoard);
    setColumns(newColumns);
  }

  return (
    <div className="board-content">
      <Container 
        orientation="horizontal" 
        onDrop={onColumnDrop}
        getChildPayload={index => columns[index]}
        dragHandleSelector=".column-drag-handle"
        dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'column-drop-preview'
          }} 
      >
        {columns.map(column => (
          <Draggable key={column.id}>
            <Column 
              column={column} 
              onCardDrop={onCardDrop} 
              onUpdateColumn={onUpdateColumn} 
            />
          </Draggable>
        ))}
      </Container>

      <BoostrapContainer className="bugtracker-container">
        {!openNewColumnForm &&
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className="fa fa-plus icon" />Add another column
            </Col>
          </Row>
        }
        {openNewColumnForm &&
          <Row>
            <Col className="enter-new-column">
              <Form.Control 
                size="sm" 
                type="text" 
                placeholder="Enter column title" 
                className="input-enter-new-column"
                ref={inputFocus}
                value={newColumnTitle}
                onChange={onNewColumnChangeTitle}
                onKeyDown={(event) => (event.key === 'Enter' && addNewColumn())}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
              <span className="cancel-icon" onClick={toggleOpenNewColumnForm}>
                <i className="fa fa-close icon"/>
              </span>
            </Col>
          </Row>
        }
      </BoostrapContainer>
    </div>
  )
}

export default BoardContent