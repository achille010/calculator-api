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
  const [activeKey, setActiveKey] = useState(null)
  const [isDeg, setIsDeg] = useState(true)
  const [ans, setAns] = useState(0)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const audioContextRef = useRef(null)

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }

  const playClick = useCallback(() => {
    if (!audioContextRef.current) return
    const ctx = audioContextRef.current
    const now = ctx.currentTime
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

  const formatDisplay = (val) => {
    if (val === 'Error' || val === 'Infinity' || val === 'NaN') return val
    const num = parseFloat(val)
    if (isNaN(num)) return val

    if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-7 && num !== 0)) {
      const formatted = num.toExponential(7).replace(/e\+?/, 'e')
      return formatted
    }

    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 10,
      useGrouping: true
    }).format(num)
  }

  const fetchHistory = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/history`)
      setHistory(response.data)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }, [])

  const handleClearHistory = useCallback(async () => {
    try {
      await axios.delete(`${API_BASE}/history`)
      setHistory([])
    } catch (error) {
      console.error('Error clearing history:', error)
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
        if (prev.replace(/,/g, '').length >= 15) return prev
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
      setOperation(`${formatDisplay(a)} ${op} ${formatDisplay(b)} =`)
      setPreviousValue(result)
      setAns(result)
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
    const currentValue = parseFloat(display.replace(/,/g, ''))
    if (previousValue !== null && !isNewInput) {
      calculate(previousValue, currentValue, currentOperator)
    } else {
      setPreviousValue(currentValue)
    }
    setCurrentOperator(op)
    setOperation(`${formatDisplay(currentValue)} ${op}`)
    setIsNewInput(true)
  }, [display, previousValue, isNewInput, currentOperator, calculate, playClick])

  const handleEquals = useCallback(() => {
    playClick()
    if (currentOperator === null || isNewInput) return
    calculate(previousValue, parseFloat(display.replace(/,/g, '')), currentOperator)
  }, [currentOperator, isNewInput, previousValue, display, calculate, playClick])

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
    const n = parseFloat(display.replace(/,/g, ''))
    let endpoint = ''
    const unit = isDeg ? 'deg' : 'rad'
    switch (func) {
      case 'sin': endpoint = `sin/${n}?unit=${unit}`; break;
      case 'cos': endpoint = `cos/${n}?unit=${unit}`; break;
      case 'tan': endpoint = `tan/${n}?unit=${unit}`; break;
      case 'n!': endpoint = `factorial/${n}`; break;
      default: return;
    }

    try {
      const response = await axios.get(`${API_BASE}/${endpoint}`)
      const result = response.data.result
      setDisplay(result.toString())
      setOperation(`${func}(${formatDisplay(n)}) =`)
      setAns(result)
      setIsNewInput(true)
      fetchHistory()
    } catch (error) {
      setDisplay('Error')
      setIsNewInput(true)
    }
  }, [display, fetchHistory, playClick])

  const handleConstant = (type) => {
    playClick()
    const val = type === 'pi' ? Math.PI : Math.E
    setDisplay(val.toString())
    setIsNewInput(true)
  }

  const handleAns = () => {
    playClick()
    setDisplay(ans.toString())
    setIsNewInput(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      initAudio()
      let key = e.key
      if (key === 'Enter') key = '='
      if (key.toLowerCase() === 'c' || key === 'Escape') key = 'clear'

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
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNumber, handleDecimal, handleOperator, handleEquals, handleClear])

  const getButtonClass = (key, type = 'number', custom = '') => {
    const isActive = activeKey === key
    const base = "flex items-center justify-center rounded-full text-[14px] font-medium transition-all duration-75 select-none h-9 mb-1"

    let colors = ""
    switch (type) {
      case 'number':
        colors = "bg-[#3c4043] text-[#e8eaed] hover:bg-[#4a4e52] active:bg-[#5f6368]"
        break
      case 'operator':
        colors = "bg-[#3c4043] text-[#9aa0a6] hover:bg-[#4a4e52] active:bg-[#5f6368]"
        break
      case 'blue':
        colors = "bg-[#8ab4f8] text-[#202124] hover:bg-[#aecbfa] active:bg-[#c2e7ff] text-xl"
        break
      case 'active-toggle':
        colors = "text-[#e8eaed]"
        break
      case 'inactive-toggle':
        colors = "text-[#9aa0a6] hover:text-[#bdc1c6]"
        break
      default:
        colors = "bg-[#3c4043] text-[#e8eaed]"
    }

    return `${base} ${colors} ${isActive ? 'brightness-125 scale-95' : ''} ${custom}`
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#202124] p-4 text-[#e8eaed] font-sans" onClick={initAudio}>
      <div className="w-full max-w-[800px] bg-[#202124]">

        {/* Display Container (Pixel-Perfect Google) */}
        <div className="mb-6 p-4 rounded-3xl border border-[#3c4043] flex flex-col items-end relative min-h-[140px] justify-center bg-[#202124]">
          <div
            className="absolute left-6 top-6 opacity-60 cursor-pointer hover:opacity-100 transition-opacity"
            onClick={() => { playClick(); setIsHistoryOpen(!isHistoryOpen); }}
            title="Toggle History"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" /></svg>
          </div>
          <div className="text-[#9aa0a6] text-xl mb-1 tracking-tight h-8 truncate pr-2">
            {operation}
          </div>
          <div className="text-6xl font-light tracking-tight pr-2">
            {isNewInput ? formatDisplay(display) : display}
          </div>

          {/* History Overlay */}
          {isHistoryOpen && (
            <div className="absolute inset-0 bg-[#202124] rounded-3xl z-10 p-4 border border-[#8ab4f8] shadow-2xl flex flex-col">
              <div className="flex justify-between items-center mb-4 border-b border-[#3c4043] pb-2">
                <h3 className="text-sm font-medium uppercase tracking-widest text-[#8ab4f8]">History</h3>
                <div className="flex gap-4">
                  <button
                    onClick={handleClearHistory}
                    className="text-[10px] text-[#9aa0a6] hover:text-[#f28b82] transition-colors uppercase tracking-widest"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setIsHistoryOpen(false)}
                    className="text-[#9aa0a6] hover:text-[#e8eaed]"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-[#3c4043] scrollbar-track-transparent">
                {history.length > 0 ? (
                  [...history].reverse().map((item, idx) => (
                    <div key={idx} className="flex flex-col items-end animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="text-xs text-[#9aa0a6] mb-1">
                        {item.Operation}
                        {item.Operands && ` (${item.Operands.join(', ')})`}
                        {item.Unit && <span className="ml-1 opacity-70">[{item.Unit}]</span>}
                      </span>
                      <span className="text-xl font-light text-[#e8eaed]">
                        = {formatDisplay(item.Result || item.Outcome || item.outcome)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-[#5f6368] text-sm italic">
                    No history yet
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 7-Column Grid (Identical to Image) */}
        <div className="grid grid-cols-7 gap-x-2 gap-y-2">

          {/* Row 1 */}
          <div className="flex items-center justify-center col-span-1 h-9">
            <button onClick={() => { playClick(); setIsDeg(true); }} className={`text-xs ${isDeg ? 'text-[#e8eaed]' : 'text-[#9aa0a6]'}`}>Deg</button>
            <span className="mx-2 text-[#5f6368]">|</span>
            <button onClick={() => { playClick(); setIsDeg(false); }} className={`text-xs ${!isDeg ? 'text-[#e8eaed]' : 'text-[#9aa0a6]'}`}>Rad</button>
          </div>
          <button onClick={() => handleScientific('n!')} className={getButtonClass('x!', 'operator')}>x!</button>
          <button onClick={() => playClick()} className={getButtonClass('(', 'operator')}>(</button>
          <button onClick={() => playClick()} className={getButtonClass(')', 'operator')}>)</button>
          <button onClick={() => playClick()} className={getButtonClass('%', 'operator')}>%</button>
          <button onClick={handleClear} className={getButtonClass('clear', 'operator')}>AC</button>
          <div className="h-9"></div> {/* Empty place for alignment if needed */}

          {/* Row 2 */}
          <button onClick={() => playClick()} className={getButtonClass('Inv', 'operator') + " opacity-50 cursor-not-allowed"} title="Coming Soon">Inv</button>
          <button onClick={() => handleScientific('sin')} className={getButtonClass('sin', 'operator')}>sin</button>
          <button onClick={() => playClick()} className={getButtonClass('ln', 'operator') + " opacity-50 cursor-not-allowed"} title="Coming Soon">ln</button>
          <button onClick={() => handleNumber(7)} className={getButtonClass('7', 'number')}>7</button>
          <button onClick={() => handleNumber(8)} className={getButtonClass('8', 'number')}>8</button>
          <button onClick={() => handleNumber(9)} className={getButtonClass('9', 'number')}>9</button>
          <button onClick={() => handleOperator('/')} className={getButtonClass('/', 'operator') + " text-xl"}>÷</button>

          {/* Row 3 */}
          <button onClick={() => handleConstant('pi')} className={getButtonClass('pi', 'operator')}>π</button>
          <button onClick={() => handleScientific('cos')} className={getButtonClass('cos', 'operator')}>cos</button>
          <button onClick={() => playClick()} className={getButtonClass('log', 'operator') + " opacity-50 cursor-not-allowed"} title="Coming Soon">log</button>
          <button onClick={() => handleNumber(4)} className={getButtonClass('4', 'number')}>4</button>
          <button onClick={() => handleNumber(5)} className={getButtonClass('5', 'number')}>5</button>
          <button onClick={() => handleNumber(6)} className={getButtonClass('6', 'number')}>6</button>
          <button onClick={() => handleOperator('*')} className={getButtonClass('*', 'operator') + " text-xl"}>×</button>

          {/* Row 4 */}
          <button onClick={() => handleConstant('e')} className={getButtonClass('e', 'operator')}>e</button>
          <button onClick={() => handleScientific('tan')} className={getButtonClass('tan', 'operator')}>tan</button>
          <button onClick={() => playClick()} className={getButtonClass('sqrt', 'operator') + " opacity-50 cursor-not-allowed"} title="Coming Soon">√</button>
          <button onClick={() => handleNumber(1)} className={getButtonClass('1', 'number')}>1</button>
          <button onClick={() => handleNumber(2)} className={getButtonClass('2', 'number')}>2</button>
          <button onClick={() => handleNumber(3)} className={getButtonClass('3', 'number')}>3</button>
          <button onClick={() => handleOperator('-')} className={getButtonClass('-', 'operator') + " text-2xl"}>−</button>

          {/* Row 5 */}
          <button onClick={handleAns} className={getButtonClass('Ans', 'operator')}>Ans</button>
          <button onClick={() => playClick()} className={getButtonClass('EXP', 'operator')}>EXP</button>
          <button onClick={() => handleOperator('^')} className={getButtonClass('xy', 'operator')}>x<sup>y</sup></button>
          <button onClick={() => handleNumber(0)} className={getButtonClass('0', 'number')}>0</button>
          <button onClick={handleDecimal} className={getButtonClass('.', 'number')}>.</button>
          <button onClick={handleEquals} className={getButtonClass('=', 'blue')}>=</button>
          <button onClick={() => handleOperator('+')} className={getButtonClass('+', 'operator') + " text-xl"}>+</button>

        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-[10px] text-[#9aa0a6] uppercase tracking-[0.2em] opacity-30 select-none">
        <span>Google Standard Replica</span>
        <span className="w-1 h-1 bg-[#5f6368] rounded-full"></span>
        <span>Keyboard Active</span>
      </div>
    </div>
  )
}

export default App
