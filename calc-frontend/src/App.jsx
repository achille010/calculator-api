import { useState, useEffect, useCallback, useRef } from 'react'
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
  const [activeKey, setActiveKey] = useState(null) // For keyboard visualizer

  const audioContextRef = useRef(null)

  // Initialize AudioContext on first interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }

  // Synthesize a "Realistic Typing Click" sound
  const playClick = useCallback(() => {
    if (!audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // 1. Percussive "Snap" (High-frequency noise)
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1

    const noiseSource = ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.setValueAtTime(2000, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.08, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02)

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(ctx.destination)

    // 2. The "Thump" (Body of the key press)
    const osc = ctx.createOscillator()
    const oscGain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(150, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.04)

    oscGain.gain.setValueAtTime(0.12, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

    osc.connect(oscGain)
    oscGain.connect(ctx.destination)

    noiseSource.start(now)
    osc.start(now)
    osc.stop(now + 0.05)
  }, [])

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
    playClick()
    setDisplay(prev => {
      if (isNewInput) {
        setIsNewInput(false)
        return num.toString()
      } else {
        return prev === '0' ? num.toString() : prev + num.toString()
      }
    })
  }, [isNewInput, playClick])

  const handleDecimal = useCallback(() => {
    playClick()
    setDisplay(prev => {
      if (isNewInput) {
        setIsNewInput(false)
        return '0.'
      } else if (!prev.includes('.')) {
        return prev + '.'
      }
      return prev
    })
  }, [isNewInput, playClick])

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
    playClick()
    const currentValue = parseFloat(display)
    if (previousValue !== null && !isNewInput) {
      calculate(previousValue, currentValue, currentOperator)
    } else {
      setPreviousValue(currentValue)
    }
    setCurrentOperator(op)
    setOperation(`${display} ${op}`)
    setIsNewInput(true)
  }, [display, previousValue, isNewInput, currentOperator, calculate, playClick])

  const handleEquals = useCallback(() => {
    playClick()
    if (currentOperator === null || isNewInput) return
    calculate(previousValue, parseFloat(display), currentOperator)
  }, [currentOperator, isNewInput, previousValue, display, calculate, playClick])

  const handleDelete = useCallback(() => {
    playClick()
    setDisplay(prev => {
      if (isNewInput) return prev
      if (prev.length === 1) {
        setIsNewInput(true)
        return '0'
      } else {
        return prev.slice(0, -1)
      }
    })
  }, [isNewInput, playClick])

  const handleClear = useCallback(() => {
    playClick()
    setDisplay('0')
    setOperation('')
    setPreviousValue(null)
    setCurrentOperator(null)
    setIsNewInput(true)
  }, [playClick])

  const handleScientific = useCallback(async (func) => {
    playClick()
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
  }, [display, fetchHistory, playClick])

  useEffect(() => {
    const handleKeyDown = (e) => {
      initAudio()
      let key = e.key
      if (key === 'Enter') key = '='
      if (key.toLowerCase() === 'c' || key === 'Escape') key = 'clear'
      if (key === 'Backspace') key = 'delete'

      setActiveKey(key)
      setTimeout(() => setActiveKey(null), 100)

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

  const getButtonClass = (key, baseClass) => {
    const isActive = activeKey === key
    return `${baseClass} ${isActive ? 'scale-95 brightness-125' : ''}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-inter text-slate-100" onClick={initAudio}>
      <div className="bg-slate-800 p-8 rounded-[2rem] shadow-2xl border border-slate-700 w-full max-w-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none"></div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-900 shadow-inner flex flex-col justify-end items-end min-h-[120px] gap-1 overflow-hidden">
          <div className="text-slate-500 text-sm font-mono tracking-wider h-6 overflow-hidden text-ellipsis whitespace-nowrap">
            {operation}
          </div>
          <div className="text-5xl font-bold font-mono text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.3)] overflow-hidden text-ellipsis">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['sin', 'cos', 'n!', '^'].map((func) => (
            <button
              key={func}
              onClick={() => func === '^' ? handleOperator('^') : handleScientific(func)}
              className={getButtonClass(func === '^' ? '^' : func, "bg-slate-700 hover:bg-slate-600 active:scale-95 transition-all p-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-600/50")}
            >
              {func === '^' ? <span>x<sup>y</sup></span> : func}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4">
          <button onClick={handleClear} className={getButtonClass('clear', "bg-red-500/20 hover:bg-red-500/30 text-red-500 font-bold p-4 rounded-2xl border border-red-500/30 active:scale-95 transition-all")}>C</button>
          <button onClick={handleDelete} className={getButtonClass('delete', "bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all")}>DEL</button>
          <button onClick={() => { playClick(); setDisplay((parseFloat(display) / 100).toString()); }} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all">%</button>
          <button onClick={() => handleOperator('/')} className={getButtonClass('/', "bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl")}>÷</button>

          {[7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className={getButtonClass(n.toString(), "bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl")}>{n}</button>
          ))}
          <button onClick={() => handleOperator('*')} className={getButtonClass('*', "bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl")}>×</button>

          {[4, 5, 6].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className={getButtonClass(n.toString(), "bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl")}>{n}</button>
          ))}
          <button onClick={() => handleOperator('-')} className={getButtonClass('-', "bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl")}>−</button>

          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => handleNumber(n)} className={getButtonClass(n.toString(), "bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl")}>{n}</button>
          ))}
          <button onClick={() => handleOperator('+')} className={getButtonClass('+', "bg-amber-500 hover:bg-amber-400 text-white font-bold p-4 rounded-2xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-2xl")}>+</button>

          <button onClick={() => handleNumber(0)} className={getButtonClass('0', "bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl")}>0</button>
          <button onClick={handleDecimal} className={getButtonClass('.', "bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold p-4 rounded-2xl border border-slate-700 shadow-sm active:scale-95 transition-all text-xl")}>.</button>
          <button onClick={() => { playClick(); setDisplay((parseFloat(display) * -1).toString()); }} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold p-4 rounded-2xl border border-slate-600 active:scale-95 transition-all text-sm">+/-</button>
          <button onClick={handleEquals} className={getButtonClass('=', "bg-blue-600 hover:bg-blue-500 text-white font-bold p-4 rounded-2xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all text-2xl")}>=</button>
        </div>

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

      <div className="mt-8 text-slate-500 text-xs font-medium flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          <kbd className="bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600 text-slate-300">Keyboard Support</kbd>
          <span>Numbers, Operators, Backspace, Enter</span>
        </div>
        <div className="flex items-center gap-2 text-blue-400/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          <span className="text-[10px] uppercase font-bold tracking-tighter">Synthesized Audio Feedback Enabled</span>
        </div>
      </div>
    </div>
  )
}

export default App
