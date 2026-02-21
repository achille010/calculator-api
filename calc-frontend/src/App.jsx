import { useState, useEffect, useCallback } from 'react'
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

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`)
      setHistory(response.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleNumber = useCallback((num) => {
    setDisplay(prev => {
      if (isNewInput) {
        setIsNewInput(false)
        return num.toString()
      } else {
        return prev === '0' ? num.toString() : prev + num.toString()
      }
    })
  }, [isNewInput])

  const handleDecimal = useCallback(() => {
    setDisplay(prev => {
      if (isNewInput) {
        setIsNewInput(false)
        return '0.'
      } else if (!prev.includes('.')) {
        return prev + '.'
      }
      return prev
    })
  }, [isNewInput])

  const calculate = useCallback(async (a, b, op) => {
    let endpoint = ''
    switch (op) {
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
      setOperation(`${a} ${op} ${b} =`)
      setPreviousValue(result)
      setCurrentOperator(null)
      setIsNewInput(true)
      fetchHistory()
    } catch (error) {
      setDisplay('Error')
      setIsNewInput(true)
    }
  }, [fetchHistory])

  const handleOperator = useCallback((op) => {
    const currentValue = parseFloat(display)
    if (previousValue !== null && !isNewInput) {
      calculate(previousValue, currentValue, currentOperator)
    } else {
      setPreviousValue(currentValue)
    }
    setCurrentOperator(op)
    setOperation(`${display} ${op}`)
    setIsNewInput(true)
  }, [display, previousValue, isNewInput, currentOperator, calculate])

  const handleEquals = useCallback(() => {
    if (currentOperator === null || isNewInput) return
    calculate(previousValue, parseFloat(display), currentOperator)
  }, [currentOperator, isNewInput, previousValue, display, calculate])

  const handleDelete = useCallback(() => {
    setDisplay(prev => {
      if (isNewInput) return prev
      if (prev.length === 1) {
        setIsNewInput(true)
        return '0'
      } else {
        return prev.slice(0, -1)
      }
    })
  }, [isNewInput])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setOperation('')
    setPreviousValue(null)
    setCurrentOperator(null)
    setIsNewInput(true)
  }, [])

  const handleScientific = useCallback(async (func) => {
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
  }, [display, fetchHistory])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(parseInt(e.key))
      } else if (e.key === '.') {
        handleDecimal()
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        handleOperator(e.key)
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        handleEquals()
      } else if (e.key === 'Backspace') {
        handleDelete()
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNumber, handleDecimal, handleOperator, handleEquals, handleDelete, handleClear])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-inter text-slate-100">
      <div className="bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-700 w-full max-w-sm flex flex-col gap-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

        {/* Display Section */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-end items-end min-h-[120px] gap-1 overflow-hidden">
          <div className="text-slate-500 text-sm font-mono tracking-wider h-6 overflow-hidden text-ellipsis whitespace-nowrap">
            {operation}
          </div>
          <div className="text-5xl font-bold font-mono text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)] overflow-hidden text-ellipsis">
            {display}
          </div>
        </div>

        {/* Scientific Row */}
        <div className="grid grid-cols-4 gap-3">
          {['sin', 'cos', 'n!', '^'].map((func) => (
            <button
              key={func}
              onClick={() => func === '^' ? handleOperator('^') : handleScientific(func)}
              className="bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all p-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-600/50"
            >
              {func === '^' ? <span>x<sup>y</sup></span> : func}
            </button>
          ))}
        </div>

        {/* Main Keypad */}
        <div className="grid grid-cols-4 gap-4">
          <button onClick={handleClear} className="bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold p-4 rounded-2xl border border-red-500/30 active:scale-95 transition-all">C</button>
          <button onClick={handleDelete} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all">DEL</button>
          <button onClick={() => setDisplay((parseFloat(display) / 100).toString())} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all">%</button>
          <button onClick={() => handleOperator('/')} className="bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl">÷</button>

          {[7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl">{n}</button>
          ))}
          <button onClick={() => handleOperator('*')} className="bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl">×</button>

          {[4, 5, 6].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl">{n}</button>
          ))}
          <button onClick={() => handleOperator('-')} className="bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl">−</button>

          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl">{n}</button>
          ))}
          <button onClick={() => handleOperator('+')} className="bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl">+</button>

          <button onClick={() => handleNumber(0)} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl">0</button>
          <button onClick={handleDecimal} className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl">.</button>
          <button onClick={() => setDisplay((parseFloat(display) * -1).toString())} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all text-sm">+/-</button>
          <button onClick={handleEquals} className="bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-2xl">=</button>
        </div>

        {/* History Panel */}
        {history.length > 0 && (
          <div className="mt-4 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm max-h-32 overflow-y-auto custom-scrollbar">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Recent History
            </div>
            <div className="flex flex-col gap-2">
              {history.slice(-4).reverse().map((item, index) => (
                <div key={index} className="flex justify-between items-center text-xs group">
                  <span className="text-slate-500 group-hover:text-slate-400 transition-colors uppercase">{item.Operation}</span>
                  <span className="text-blue-400 font-bold font-mono">{item.Outcome ?? item.Result ?? item.outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard tip */}
      <div className="mt-8 text-slate-500 text-xs font-medium flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
        <kbd className="bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 text-slate-300">Keyboard Support</kbd>
        <span>Use Number Keys, Operators, Backspace, and Enter</span>
      </div>
    </div>
  )
}

export default App
