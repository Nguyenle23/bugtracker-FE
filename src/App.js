import React from 'react';
import './App.scss';

//Customer Component
import AppBar from './component/AppBar/AppBar.js';
import BoardBar from './component/BoardBar/BoardBar.js';
import BoardContent from './component/BoardContent/BoardContent.js';

function App() {
  return (
    <div className="content">
      <AppBar />
      <BoardBar />
      <BoardContent />
    </div>
  );
}

export default App;
