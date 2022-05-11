
import React, {useState, useEffect, useRef} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form, Button } from 'react-bootstrap';

import './Column.scss';
import Card from '../Card/Card.js';
import ConfirmModal from '../Common/ConfirmModal.js';
import { mapOrder } from '../../utilities/sort.js';
import {MODAL_ACTION_CONFIRM} from '../../utilities/constants.js';
import {selectAllInlineText, saveColumnTitle} from '../../utilities/contentEditable.js';

function Column(props) {
  const {column, onCardDrop, onUpdateColumn} = props;
  const cards = mapOrder(column.cards, column.cardOrder, '_id');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [columnTitle, setColumnTitle] = useState('');
  const handleColumnTitleChange = (e) => setColumnTitle(e.target.value);

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm(!openNewCardForm);
  }

  const inputFocus = useRef(null);

  const [newCardTitle, setNewCardTitle] = useState('');
  const onNewCardChangeTitle = (e) => setNewCardTitle(e.target.value);

  useEffect(() =>{
    setColumnTitle(column.title);
    return () => {
      setColumnTitle('');
    }
  }, [column.title])

  useEffect(() => {
    if (inputFocus && inputFocus.current) {
      inputFocus.current.focus();
      inputFocus.current.select();
    }
  }, [openNewCardForm]);

  const onConfirmModalAction = (type) => {
    console.log(type);
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumn = {
        ...column,
        _destroy: true
      };
      onUpdateColumn(newColumn);
    }
    toggleShowConfirmModal();
  }

  const handleColumnTitleBlur = () => {
    const newColumn = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumn);
  }
  const addNewCard = () => {
    if (!newCardTitle) {
      inputFocus.current.focus();
      return
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substring(2, 5), //random character
      boardId: column.boardId,
      columnId: column._id,
      title: newCardTitle.trim(),
      cover: null,
    }

    const newColumn = {
      ...column,
      cards: [...column.cards, newCardToAdd],
      cardOrder: [...column.cardOrder, newCardToAdd._id],
    };
    onUpdateColumn(newColumn);

    setNewCardTitle('');
    toggleOpenNewCardForm();
  }

  return (
      <div className="column"> 
        <header className="column-drag-handle">
          <div className="column-title">
            <Form.Control 
              size="sm" 
              type="text" 
              className="content-editable"
              value={columnTitle}
              onChange={handleColumnTitleChange}
              onBlur={handleColumnTitleBlur}
              onKeyDown={saveColumnTitle}
              onMouseDown={e => e.preventDefault()}
              spellCheck="false"
              onClick={selectAllInlineText}
            />
          </div>
          <div className="column-dropdown-actions">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"/>

              <Dropdown.Menu>
                <Dropdown.Item onClick={toggleOpenNewCardForm}>Add</Dropdown.Item>
                <Dropdown.Item onClick={toggleShowConfirmModal}>Remove</Dropdown.Item>
                <Dropdown.Item>Move all</Dropdown.Item>
                <Dropdown.Item>Archive all</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        <div className="card-list">
          <Container
            orientation="vertical" 
            groupName="columns"
            onDrop={dropResult => onCardDrop(column._id, dropResult)}
            getChildPayload={index =>
              cards[index]
            }
            dragClass="card-ghost"
            dropClass="card-ghost-drop"
            dropPlaceholder={{                      
              animationDuration: 150,
              showOnTop: true,
              className: 'card-drop-preview' 
            }}
            dropPlaceholderAnimationDuration={200}
          >
            {cards.map(card => (
              <Draggable key={column._id}>
                <Card card={card} />
              </Draggable>
            ))}
          </Container>
          {openNewCardForm &&
            <div className="add-new-card">
            <Form.Control 
              size="sm" 
              as="textarea" 
              rows="3"
              placeholder="Enter card title" 
              className="textarea-enter-new-card"
              ref={inputFocus}
              value={newCardTitle}
              onChange={onNewCardChangeTitle}
              onKeyDown={(event) => (event.key === 'Enter' && addNewCard())}
            />
          </div>
          }
        </div>

        <footer>
        {openNewCardForm &&
          <div className="add-new-actions">
            <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
            <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
              <i className="fa fa-close icon"/>
            </span>
          </div>
        }
        {!openNewCardForm &&
          <div className="footer-actions" onClick={toggleOpenNewCardForm}>
            <i className="fa fa-plus icon" />Add another card
          </div>
        }
        </footer>

        <ConfirmModal 
          title="Remove column"
          content={`Are you sure you want to remove <strong>${column.title}</strong> column?`}
          show={showConfirmModal}
          onAction={onConfirmModalAction}
        />


      </div>
  )
}

export default Column