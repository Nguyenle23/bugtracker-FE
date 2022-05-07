import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

import './Column.scss';
import Card from '../Card/Card.js';
import { mapOrder } from '../../utilities/sort.js';

function Column(props) {
  const {column, onCardDrop} = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id')


  return (
      <div className="column"> 
        <header className="column-drag-handle">
          <div>{column.title}</div>
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
      </div>
  )
}

export default Column