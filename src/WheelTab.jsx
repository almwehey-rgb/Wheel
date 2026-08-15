import { useEffect, useRef, useState } from 'react'
import { WHEEL_COLORS } from './constants'
import { playTick, playWin } from './sound'

const SPIN_MIN_DURATION = 4000
const SPIN_MAX_DURATION = 5000
const EXTRA_SPINS = 6

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5)
}

function sectorIndexForRotation(rotation, count, sectorWidth) {
  const a = (((360 - (rotation % 360)) % 360) + 360) % 360
  return Math.floor(a / sectorWidth) % count
}

function buildGradient(names) {
  const n = names.length
  if (n === 0) return '#e2e8f0'
  if (n === 1) return WHEEL_COLORS[0]
  const sectorWidth = 360 / n
  const stops = []
  for (let i = 0; i < n; i += 1) {
    const color = WHEEL_COLORS[i % WHEEL_COLORS.length]
    const start = (i * sectorWidth).toFixed(3)
    const end = ((i + 1) * sectorWidth).toFixed(3)
    stops.push(`${color} ${start}deg ${end}deg`)
  }
  return `conic-gradient(${stops.join(', ')})`
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 24 }, (_, i) => {
    const color = WHEEL_COLORS[i % WHEEL_COLORS.length]
    const left = Math.random() * 100
    const delay = Math.random() * 0.3
    const duration = 1.2 + Math.random() * 0.8
    const rotate = Math.random() * 360
    return { id: i, color, left, delay, duration, rotate }
  })
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function WheelTab({
  names,
  setNames,
  history,
  setHistory,
  autoRemove,
  setAutoRemove,
  soundOn,
  t,
  lastSpin,
  setLastSpin,
}) {
  const wheelRef = useRef(null)
  const rotationRef = useRef(0)
  const animRef = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)

  useEffect(() => () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }, [])

  const canSpin = names.length >= 2 && !spinning

  function spin() {
    if (!canSpin) return
    const n = names.length
    const sectorWidth = 360 / n
    const winnerIndex = Math.floor(Math.random() * n)
    const jitter = (Math.random() - 0.5) * sectorWidth * 0.6
    const targetAngle = (winnerIndex * sectorWidth + sectorWidth / 2 + jitter + 360) % 360
    const neededMod = (360 - targetAngle + 360) % 360
    const currentMod = ((rotationRef.current % 360) + 360) % 360
    const deltaToTarget = (neededMod - currentMod + 360) % 360
    const totalDelta = EXTRA_SPINS * 360 + deltaToTarget
    const startRotation = rotationRef.current
    const duration = SPIN_MIN_DURATION + Math.random() * (SPIN_MAX_DURATION - SPIN_MIN_DURATION)

    setWinner(null)
    setSpinning(true)

    let lastIdx = sectorIndexForRotation(startRotation, n, sectorWidth)
    const startTime = performance.now()

    function frame(now) {
      const elapsed = now - startTime
      const t2 = Math.min(elapsed / duration, 1)
      const eased = easeOutQuint(t2)
      const currentRotation = startRotation + totalDelta * eased
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRotation}deg)`
      }
      const idx = sectorIndexForRotation(currentRotation, n, sectorWidth)
      if (idx !== lastIdx) {
        lastIdx = idx
        if (soundOn) playTick()
      }
      if (t2 < 1) {
        animRef.current = requestAnimationFrame(frame)
      } else {
        finishSpin(currentRotation, winnerIndex)
      }
    }
    animRef.current = requestAnimationFrame(frame)
  }

  function finishSpin(finalRotation, winnerIndex) {
    rotationRef.current = finalRotation
    setSpinning(false)
    const winnerName = names[winnerIndex]
    setWinner(winnerName)
    if (soundOn) playWin()

    const prevNames = [...names]
    const prevHistory = [...history]
    const entry = { id: Date.now(), name: winnerName, time: new Date().toISOString() }
    setHistory([entry, ...history].slice(0, 50))
    if (autoRemove) {
      setNames(names.filter((_, i) => i !== winnerIndex))
    }
    setLastSpin({ names: prevNames, history: prevHistory })
  }

  function undoLastSpin() {
    if (!lastSpin) return
    setNames(lastSpin.names)
    setHistory(lastSpin.history)
    setLastSpin(null)
    setWinner(null)
  }

  const gradient = buildGradient(names)
  const sectorWidth = names.length > 0 ? 360 / names.length : 0

  return (
    <div className="wheel-tab">
      <div className="wheel-wrap">
        <div className="pointer" aria-hidden="true" />
        <div className="wheel" ref={wheelRef} style={{ background: gradient }}>
          {names.map((name, i) => {
            const angle = i * sectorWidth + sectorWidth / 2 - 90
            return (
              <div
                key={`${name}-${i}`}
                className="wheel-label"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <span>{name}</span>
              </div>
            )
          })}
        </div>
        <button
          type="button"
          className="spin-btn"
          onClick={spin}
          disabled={!canSpin}
        >
          {spinning ? t('spinning') : t('start')}
        </button>
      </div>

      {names.length < 2 && <p className="hint">{t('needTwoNames')}</p>}

      <div className="wheel-controls">
        <label className="switch-row">
          <input
            type="checkbox"
            checked={autoRemove}
            onChange={(e) => setAutoRemove(e.target.checked)}
          />
          <span>{t('autoRemove')}</span>
        </label>
        <button
          type="button"
          className="secondary-btn"
          onClick={undoLastSpin}
          disabled={!lastSpin}
        >
          {t('undo')}
        </button>
      </div>

      {winner && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal winner-modal">
            <ConfettiBurst />
            <p className="winner-emoji">🎉</p>
            <h2>{t('winnerTitle')}</h2>
            <p className="winner-name">{winner}</p>
            <button type="button" className="primary-btn" onClick={() => setWinner(null)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
