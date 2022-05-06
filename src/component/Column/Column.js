import React from 'react';
import { Container, Draggable } from 'react-smooth-dnd';

import './Column.scss';
import Card from '../Card/Card.js';
import { mapOrder } from '../../utilities/sort.js';

function Column(props) {
  const {column} = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  
  const onCardDrop = (dropResult) => {
    console.log(dropResult);
  }

  return (
      <div className="column"> 
        <header className="column-drag-handle">
          <h1>{column.title}</h1>
        </header>

        <div className="card-list">
        <Container
          orientation="vertical" 
          groupName="columns"
          onDrop={onCardDrop}
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

        <footer>Add another card</footer>
      </div>
  )
}

export default Column