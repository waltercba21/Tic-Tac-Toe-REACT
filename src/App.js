import { useState } from "react";
import confetti from "canvas-confetti";

import { Square } from "./components/Square.js";
import {TURNS} from "./constants.js"
import {checkWinnerFrom, checkEndGame} from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.js";


function App() {
  
  const [board, setBoard] = useState (() => {
    const boardFromStorage = window.localStorage.getItem('board');
    return boardFromStorage ? JSON.parse(boardFromStorage) : (Array(9).fill(null))
  })

  const [turn, setTurn] = useState (() => {
    const turnFromStorage = window.localStorage.getItem('turn');
    return turnFromStorage ?? TURNS.X
  })

  // null es que no hay ganador, false es que hay un empate
  const [winner, setWinner] = useState (null) 

  
  const resetGame = () => {
    setBoard (Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const updateBoard = (index) => {
    // No actualizamos esta posicion, si ya tiene algo
    if (board[index] || winner) return 
    // Actualizar el tablero
    const newBoard = [...board]
    newBoard[index]=turn
    setBoard(newBoard)
    // Cambiar el Turno 
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // Guardar Partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))
    // Revisar si hay un ganador 
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner){
      confetti ()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)){
      setWinner(false) //EMPATE 
    }
  }

  return (
    <main className="board">
      <h1>TIC -TAC- TOE</h1>
      <button onClick={resetGame}>Empezar de Nuevo</button>
      <section className="game">
        { 
          board.map ((_, index) => {
            return (
            <Square 
              key={index}
              index={index}
              updateBoard = {updateBoard}
              >
              {board[index]}
            </Square>
          )
        })
        }

      </section>
      <section className="turn">
        <Square isSelected = {turn}>{TURNS.X}</Square>
        <Square>{TURNS.O}</Square>
      </section>
      
    <WinnerModal resetGame={resetGame} winner={winner}/>
    </main>
   
  );
}

export default App;
