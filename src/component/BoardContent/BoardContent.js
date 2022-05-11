import React, {useState, useEffect, useRef} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Container as BoostrapContainer, Row, Col, Form, Button } from 'react-bootstrap';
import {isEmpty} from 'lodash';

import './BoardContent.scss';
import Column from '../Column/Column.js';
import { mapOrder } from '../../utilities/sort.js';
import { applyDrag } from '../../utilities/dragDrop';
import { updateBoard, fetchBoard, createNewColumn, updateColumn, updateCard } from '../../actions/ApiCall/index.js';
import {cloneDeep} from 'lodash';

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
    const boardId = '627a68b03a66af1245b3cd6a';
    fetchBoard(boardId).then(board => {
      setBoard(board);
      setColumns(mapOrder(board.columns, board.columnOrder, '_id'));
    })
    // if (boardFromDB) {
    //   setBoard(boardFromDB);
    //   //sort columns
    //   // boardFromDB.columns.sort(function (a, b) {
    //   //   return boardFromDB.columnOrder.indexOf(a._id) - boardFromDB.columnOrder.indexOf(b._id);
    //   // })
    //   setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    // }
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
    let newColumns = cloneDeep(columns);
    newColumns = applyDrag(newColumns, dropResult);
    
    let newBoard = cloneDeep(board);
    newBoard.columnOrder = newColumns.map(column => column._id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    //Call API update columnOrder in Board
    updateBoard(newBoard._id, newBoard).catch(error => {
      console.log(error);
      setColumns(columns);
      setBoard(board);
    })
  }

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      let newColumns = cloneDeep(columns);

      let currentColumn = newColumns.find(column => column._id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOrder = currentColumn.cards.map(card => card._id);
      
      setColumns(newColumns);
      if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
        /**
         * Action: move card inside column
         * 1. Call api update cardOrder in column
         */
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));
      } else {
        /**
         * Action: move card inside column
         */
        //1. Call api update cardOrder in column
        updateColumn(currentColumn._id, currentColumn).catch(() => setColumns(columns));

        if (dropResult.addedIndex !== null) {
          let currentCard = cloneDeep(dropResult.payload);
          currentCard.columnId = columnId;
          
          //2. Call api update columnId in current card
          updateCard(currentCard._id, currentCard)
        }
      }
  }
}
 
  const addNewColumn = () => {
    if (!newColumnTitle) {
      inputFocus.current.focus();
      return
    }

    const newColumnToAdd = {
      boardId: board._id,
      title: newColumnTitle.trim()
    }

    //Call api createNewColumn
    createNewColumn(newColumnToAdd).then(newColumn => {
      let newColumns = [...columns];
      newColumns.push(newColumn);
      setColumns(newColumns);
  
      let newBoard = {...board}
      newBoard.columnOrder = newColumns.map(column => column._id);
      newBoard.columns = newColumns;
      setBoard(newBoard);
  
      setNewColumnTitle('');
      toggleOpenNewColumnForm();
    });
  }

  const onUpdateColumnState = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate._id;

    let newColumns = [...columns];
    const columIndexToUpdate = newColumns.findIndex(item => item._id === columnIdToUpdate);
    
    if (newColumnToUpdate._destroy) {
      //remove column
      newColumns.splice(columIndexToUpdate, 1);
    } else {
      //update column
      newColumns.splice(columIndexToUpdate, 1, newColumnToUpdate);
    }

    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(column => column._id);
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
          <Draggable key={column._id}>
            <Column 
              column={column} 
              onCardDrop={onCardDrop} 
              onUpdateColumnState={onUpdateColumnState} 
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