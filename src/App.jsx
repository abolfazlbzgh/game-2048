import { useState } from 'react'
import './App.css'
import Game from './components/Game';

function App() {

  return (
    <div className="flex justify-center items-center h-screen bg-slate-300">
      <Game />
    </div>
  );
}

export default App
