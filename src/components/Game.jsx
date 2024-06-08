import React, { useState, useEffect } from 'react';
import Board from './Board';
import { useSwipeable } from 'react-swipeable';
import { BrowserView } from 'react-device-detect';
import Button from './Button'
import Score from './Score'
import Modal from './Modal'

const initialBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
];
export default function Game() {
    const [board, setBoard] = useState(initialBoard);
    const [history, setHistory] = useState([initialBoard]);
    const [score, setScore] = useState(0);
    const [targetScore, setTargetScore] = useState(0); // Store target score
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const [highScore, setHighScore] = useState(() => {
        const savedHighScore = localStorage.getItem('highScore');
        return savedHighScore ? parseInt(savedHighScore, 10) : 0;
    });

    useEffect(() => {
        const newBoard = addRandomTile(addRandomTile(board));
        setBoard(newBoard);
        setHistory([...history, newBoard]);
    }, []);

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('highScore', score);
        }
    }, [score, highScore]);

    useEffect(() => {
        let totalSum = 0;
        for (const row of board) {
            totalSum += row.reduce((sum, cellValue) => sum + cellValue, 0);
        }
        setTargetScore(totalSum)
        if (isGameOver()) {
            setGameOver(true);
        }
    }, [board]);

    useEffect(() => {

        if (targetScore !== 0 && targetScore !== score) {
            const intervalId = setInterval(() => {
                if (score < targetScore) {
                    setScore((prevScore) => prevScore + 1);
                } else if (score > targetScore) {
                    setScore((prevScore) => prevScore - 1);
                } else {
                    clearInterval(intervalId);
                }
            }, 100);

            return () => clearInterval(intervalId);
        }
    }, [targetScore, score]);

    useEffect(() => {
        if (checkWin() && !showWinModal) {
            setGameWon(true);
            setShowWinModal(true);
        }
    }, [board, showWinModal]);

    const addRandomTile = (board) => {
        const emptyTiles = [];
        board.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                if (tile === 0) {
                    emptyTiles.push([rowIndex, colIndex]);
                }
            });
        });

        if (emptyTiles.length > 0) {
            const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            const newBoard = board.map(row => row.slice());
            newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
            setHistory([...history, newBoard]);
            return newBoard;
        }
        return board;
    };

    const move = (direction) => {
        const currentBoard = board.map(row => row.slice());
        let newBoard;

        switch (direction) {
            case 'left':
                newBoard = currentBoard.map(row => slide(row));
                break;
            case 'right':
                newBoard = currentBoard.map(row => slide(row.reverse()).reverse());
                break;
            case 'up':
                newBoard = transpose(currentBoard).map(row => slide(row));
                newBoard = transpose(newBoard);
                break;
            case 'down':
                newBoard = transpose(currentBoard).map(row => slide(row.reverse()).reverse());
                newBoard = transpose(newBoard);
                break;
            default:
                return;
        }
        if (!boardsEqual(currentBoard, newBoard)) {
            const addRandomTileToNewBoard = addRandomTile(newBoard)
            setBoard(addRandomTileToNewBoard);
            setHistory([...history, addRandomTileToNewBoard]);
        }
    };

    const moveLeft = () => move('left');
    const moveRight = () => move('right');
    const moveUp = () => move('up');
    const moveDown = () => move('down');

    const slide = (row) => {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        let zeros = Array(missing).fill(0);
        arr = arr.concat(zeros);
        let newScore = score;

        for (let i = 0; i < 3; i++) {
            if (arr[i] === arr[i + 1] && arr[i] !== 0) {
                arr[i] *= 2;
                arr[i + 1] = 0;
                newScore += arr[i];
            }
        }

        arr = arr.filter(val => val);
        missing = 4 - arr.length;
        zeros = Array(missing).fill(0);
        arr = arr.concat(zeros);
        return arr;
    };

    const transpose = (matrix) => {
        return matrix[0].map((col, i) => matrix.map(row => row[i]));
    };

    const boardsEqual = (board1, board2) => {
        for (let i = 0; i < board1.length; i++) {
            for (let j = 0; j < board1[i].length; j++) {
                if (board1[i][j] != board2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    };
    const isGameOver = () => {
        // Check if there are any empty tiles
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }

        // Check if there are any possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === board[i][j + 1] || board[j][i] === board[j + 1][i]) {
                    return false;
                }
            }
        }

        return true;
    };
    const undo = () => {
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            setBoard(newHistory[newHistory.length - 1]);
            setHistory(newHistory);
        }
    };
    const reset = () => {
        const newBoard = addRandomTile(addRandomTile(initialBoard));
        setBoard(newBoard);
        setScore(0)
        setHistory([newBoard]);
        setGameOver(false)
    };
    const closeModalGameOver = () => {
        setGameOver(false);
    };
    const checkWin = () => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    };
    const closeWinModal = () => {
        setHasWon(false);
    };

    const handlers = useSwipeable({
        onSwipedLeft: moveLeft,
        onSwipedRight: moveRight,
        onSwipedUp: moveUp,
        onSwipedDown: moveDown,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div {...handlers} className="flex flex-col items-center py-8 px-2">

            <div className='grid grid-cols-3 gap-4 justify-between  items-center  w-full max-w-md py-4'>
                {/* <h1 className=' font-extrabold justify-center items-center text-4xl text-black w-full text-center' >2048</h1> */}
                <img src='./site-icon.svg' alt='game over' className='shadow-lg h-24' />
                <Score title={'Score'} score={score} />
                <Score title={'Best'} score={highScore} />
            </div>

            <div className='flex w-full justify-between items-center gap-4 pb-4'>
                <div>
                    <BrowserView>
                        <div className='flex gap-4'>
                            <Button onClick={moveLeft} src='./left.svg' />
                            <Button onClick={moveRight} src='./left.svg' rotate='rotate-180' />
                            <Button onClick={moveUp} src='./left.svg' rotate='rotate-90' />
                            <Button onClick={moveDown} src='./left.svg' rotate='-rotate-90' />

                        </div>
                    </BrowserView>
                </div>
                <div className='flex gap-4'>
                    <Button onClick={undo} src='./undo.svg' rotate='rotate-90' />
                    <Button onClick={reset} src='./reset.svg' />
                </div>


            </div>
            <Board board={board} />
            {gameOver && <Modal
                onClickOk={() => window.location.reload()}
                onClickClose={closeModalGameOver}
                src='./game-over.png'
                titleOk='Restart'
            />}
            {hasWon && <Modal
                onClickOk={closeWinModal}
                onClickClose={closeWinModal}
                src='./winner.png'
                titleOk='Thanks!'
            />}
        </div>
    );
}
