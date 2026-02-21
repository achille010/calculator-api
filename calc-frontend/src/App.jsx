import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = 'http://localhost:3000'

function App() {
  const [display, setDisplay] = useState('0')
  const [operation, setOperation] = useState('')
  const [previousValue, setPreviousValue] = useState(null)
  const [currentOperator, setCurrentOperator] = useState(null)
  const [history, setHistory] = useState([])
  const [isNewInput, setIsNewInput] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`)
      setHistory(response.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleNumber = (num) => {
    if (isNewInput) {
      setDisplay(num.toString())
      setIsNewInput(false)
    } else {
      setDisplay(display === '0' ? num.toString() : display + num.toString())
    }
  }

  const handleDecimal = () => {
    if (isNewInput) {
      setDisplay('0.')
      setIsNewInput(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperator = (op) => {
    if (previousValue !== null && !isNewInput) {
      calculate()
    } else {
      setPreviousValue(parseFloat(display))
    }
    setCurrentOperator(op)
    setOperation(`${display} ${op}`)
    setIsNewInput(true)
  }

  const calculate = async () => {
    if (currentOperator === null || isNewInput) return

    const a = previousValue
    const b = parseFloat(display)
    let endpoint = ''
    
    switch (currentOperator) {
      case '+': endpoint = 'add'; break;
      case '-': endpoint = 'subtract'; break;
      case '*': endpoint = 'multiply'; break;
      case '/': endpoint = 'divide'; break;
      case '^': endpoint = 'power'; break;
      default: return;
    }

    try {
      const response = await axios.get(`${API_BASE}/${endpoint}`, { params: { a, b } })
      const result = response.data.result
      setDisplay(result.toString())
      setOperation(`${a} ${currentOperator} ${b} =`)
      setPreviousValue(result)
      setCurrentOperator(null)
      setIsNewInput(true)
      fetchHistory()
    } catch (error) {
      setDisplay('Error')
      setIsNewInput(true)
    }
  }

  const handleScientific = async (func) => {
    const n = parseFloat(display)
    let endpoint = ''
    
    switch (func) {
      case 'sin': endpoint = `sin/${n}`; break;
      case 'cos': endpoint = `cos/${n}`; break;
      case 'n!': endpoint = `factorial/${n}`; break;
      default: return;
    }

    try {
      const response = await axios.get(`${API_BASE}/${endpoint}`)
      const result = response.data.result
      setDisplay(result.toString())
      setOperation(`${func}(${n}) =`)
      setIsNewInput(true)
      fetchHistory()
    } catch (error) {
      setDisplay('Error')
      setIsNewInput(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setOperation('')
    setPreviousValue(null)
    setCurrentOperator(null)
    setIsNewInput(true)
  }

  const handleEquals = () => {
    calculate()
  }

  return (
    <div className="calculator-container">
      <div className="display">
        <div className="display-operation">{operation}</div>
        <div className="display-result">{display}</div>
      </div>

      <div className="scientific-row">
        <button className="function scientific" onClick={() => handleScientific('sin')}>sin</button>
        <button className="function scientific" onClick={() => handleScientific('cos')}>cos</button>
        <button className="function scientific" onClick={() => handleScientific('n!')}>n!</button>
        <button className="function scientific" onClick={() => handleOperator('^')}>x^y</button>
      </div>

      <div className="keypad">
        <button className="action" onClick={handleClear}>AC</button>
        <button className="function" onClick={() => setDisplay((parseFloat(display) * -1).toString())}>+/-</button>
        <button className="function" onClick={() => setDisplay((parseFloat(display) / 100).toString())}>%</button>
        <button className="operator" onClick={() => handleOperator('/')}>÷</button>

        <button onClick={() => handleNumber(7)}>7</button>
        <button onClick={() => handleNumber(8)}>8</button>
        <button onClick={() => handleNumber(9)}>9</button>
        <button className="operator" onClick={() => handleOperator('*')}>×</button>

        <button onClick={() => handleNumber(4)}>4</button>
        <button onClick={() => handleNumber(5)}>5</button>
        <button onClick={() => handleNumber(6)}>6</button>
        <button className="operator" onClick={() => handleOperator('-')}>−</button>

        <button onClick={() => handleNumber(1)}>1</button>
        <button onClick={() => handleNumber(2)}>2</button>
        <button onClick={() => handleNumber(3)}>3</button>
        <button className="operator" onClick={() => handleOperator('+')}>+</button>

        <button onClick={() => handleNumber(0)} style={{ gridColumn: 'span 2', borderRadius: '24px', aspectRatio: 'auto' }}>0</button>
        <button onClick={handleDecimal}>.</button>
        <button className="equals" onClick={handleEquals}>=</button>
      </div>

      {history.length > 0 && (
        <div className="history-panel">
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#f8fafc' }}>History</div>
          {history.slice(-5).reverse().map((item, index) => (
            <div key={index} className="history-item">
              {item.Operation}: {item.Outcome ?? item.Result ?? item.outcome}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
