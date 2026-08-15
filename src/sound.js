let ctx = null

function getCtx() {
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    ctx = new AudioContextClass()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playTick() {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.type = 'square'
    osc.frequency.value = 1200
    gain.gain.setValueAtTime(0.18, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.045)
    osc.connect(gain).connect(c.destination)
    osc.start()
    osc.stop(c.currentTime + 0.05)
  } catch {
    // audio unavailable, ignore
  }
}

export function playWin() {
  try {
    const c = getCtx()
    const now = c.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = now + i * 0.12
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      osc.connect(gain).connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  } catch {
    // audio unavailable, ignore
  }
}
