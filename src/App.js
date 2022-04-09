import { useState, useEffect } from 'react'
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [tenziesValue, setTenziesValue] = useState(() => {
        const myTenzies = JSON.parse(localStorage.getItem("tenziesValue"))
        const myTenziesValue = (typeof myTenzies.number !== 'undefined') ? myTenzies.number : 0
        console.log(myTenziesValue)
        return myTenziesValue || 0
    })
    const [rollCount, setRollCount] = useState(0)
    console.log(tenziesValue)


    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setTenziesValue(tenziesValue + 1)
        }

        
    }, [dice])


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }


    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    

    function rollDice() {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                setRollCount(rollCount + 1)
                return die.isHeld ?
                    die :
                    generateNewDie()
                
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            localStorage.setItem('tenziesValue', JSON.stringify({
                number: tenziesValue
            }))
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }))
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button
                className="roll-dice"
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>

            <div className='game-info'>

                <div className="games-won"><p>Games Won</p>
                    <p>{tenziesValue}</p></div>
                
                <div className='roll-count'>
                    <p>Number of rolls</p>
                    <p>{rollCount}</p>
                </div>
            </div>
        </main>
    )
}
