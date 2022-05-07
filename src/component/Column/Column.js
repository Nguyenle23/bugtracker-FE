
import React, {useState, useEffect, useCallback} from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { Dropdown, Form } from 'react-bootstrap';

import './Column.scss';
import Card from '../Card/Card.js';
import ConfirmModal from '../Common/ConfirmModal.js';
import { mapOrder } from '../../utilities/sort.js';
import {MODAL_ACTION_CONFIRM} from '../../utilities/constants.js';
import {selectAllInlineText, saveColumnTitle} from '../../utilities/contentEditable.js';

function Column(props) {
  const {column, onCardDrop, onUpdateColumn} = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const [columnTitle, setColumnTitle] = useState('');
  const handleColumnTitleChange = useCallback((e) => {
    setColumnTitle(e.target.value);
    return () => {
      setColumnTitle('');
    }
  }, []);

  useEffect(() =>{
    setColumnTitle(column.title);
    return () => {
      setColumnTitle('');
    }
  }, [column.title])

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
                <Dropdown.Item>Add</Dropdown.Item>
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
          onDrop={dropResult => onCardDrop(column.id, dropResult)}
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
            <Draggable key={column.id}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
        </div>

        <footer>
          <div className="footer-actions">
            <i className="fa fa-plus icon" />Add another card
          </div>
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