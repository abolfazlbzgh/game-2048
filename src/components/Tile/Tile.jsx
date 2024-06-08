import React from 'react'
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import './Tile.css'; // Import the CSS file for animations

export default function Tile({ value }) {
  const tileClass = classNames(
    'flex items-center justify-center h-20 w-20 rounded-lg text-2xl font-bold',
    {
      'bg-gray-300 text-gray-900': value === 0,
      'bg-yellow-400 text-white': value === 2,
      'bg-yellow-500 text-white': value === 4,
      'bg-orange-400 text-white': value === 8,
      'bg-orange-500 text-white': value === 16,
      'bg-red-400 text-white': value === 32,
      'bg-red-500 text-white': value === 64,
      'bg-purple-400 text-white': value === 128,
      'bg-purple-500 text-white': value === 256,
      'bg-green-400 text-white': value === 512,
      'bg-green-500 text-white': value === 1024,
      'bg-blue-400 text-white': value === 2048,
      'bg-blue-500 text-white': value === 4096,
    }
  );

  return (
    <CSSTransition
      in={true}
      timeout={300}
      classNames="tile"
      unmountOnExit
    >
      <div className={tileClass}>
        {value !== 0 ? value : ''}
      </div>
    </CSSTransition>
  );
}
