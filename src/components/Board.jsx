import React from 'react';
import Tile from './Tile/Tile';

export default function Board({ board }) {
    return (
        <div className="grid grid-cols-4 gap-4 bg-gray-200 p-4 rounded-lg shadow-lg">
            {board.map((row, rowIndex) => (
                row.map((tile, colIndex) => (
                    <Tile key={`${rowIndex}-${colIndex}`} value={tile} />
                ))
            ))}
        </div>
    );
}
