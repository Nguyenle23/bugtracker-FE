import React from 'react'

import './Column.scss'
import Card from '../Card/Card.js';
import { mapOrder } from '../../utilities/sort.js';

function Column(props) {
  const {column} = props;
  const cards = mapOrder(column.cards, column.cardOrder, 'id')
  
  return (
      <div className="column"> 
        <header>
          <h1>{column.title}</h1>
        </header>

        <ul className="card-list">
          {cards.map(card => (
            <Card key={card.id} card={card} />
          ))}
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
          <li className="card-item">Description</li>
        </ul>

        <footer>Add another card</footer>
      </div>
  )
}

export default Column