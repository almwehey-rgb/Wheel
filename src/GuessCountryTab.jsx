import { useState } from 'react'
import { COUNTRIES_QUIZ } from './countriesQuizData'

const LEVELS = ['easy', 'medium', 'hard']

function shuffleArray(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function poolForLevel(level) {
  const indices = COUNTRIES_QUIZ.map((_, i) => i).filter(
    (i) => level === 'all' || COUNTRIES_QUIZ[i].level === level
  )
  return shuffleArray(indices)
}

export default function GuessCountryTab({ t }) {
  const [level, setLevel] = useState('all')
  const [pool, setPool] = useState(() => poolForLevel('all'))
  const [currentIndex, setCurrentIndex] = useState(pool[0] ?? null)
  const [revealedHints, setRevealedHints] = useState(1)
  const [showAnswer, setShowAnswer] = useState(false)
  const [roundNumber, setRoundNumber] = useState(1)

  const total = COUNTRIES_QUIZ.filter((c) => level === 'all' || c.level === level).length
  const current = currentIndex !== null ? COUNTRIES_QUIZ[currentIndex] : null

  function changeLevel(nextLevel) {
    const nextPool = poolForLevel(nextLevel)
    setLevel(nextLevel)
    setPool(nextPool.slice(1))
    setCurrentIndex(nextPool[0] ?? null)
    setRevealedHints(1)
    setShowAnswer(false)
    setRoundNumber(1)
  }

  function nextQuestion() {
    let nextPool = pool
    if (nextPool.length === 0) {
      nextPool = poolForLevel(level)
      setRoundNumber(1)
    } else {
      setRoundNumber((n) => n + 1)
    }
    setCurrentIndex(nextPool[0] ?? null)
    setPool(nextPool.slice(1))
    setRevealedHints(1)
    setShowAnswer(false)
  }

  function revealNextHint() {
    if (!current) return
    setRevealedHints((n) => Math.min(n + 1, current.hints.length))
  }

  return (
    <div className="guess-tab">
      <h2>{t('guessTitle')}</h2>

      <div className="level-row">
        {['all', ...LEVELS].map((lvl) => (
          <button
            key={lvl}
            type="button"
            className={level === lvl ? 'level-btn active' : 'level-btn'}
            onClick={() => changeLevel(lvl)}
          >
            {t(`guessLevel_${lvl}`)}
          </button>
        ))}
      </div>

      {current ? (
        <div className="guess-card">
          <p className="guess-progress">{t('guessProgress', roundNumber, total)}</p>

          <ul className="guess-hints">
            {current.hints.slice(0, revealedHints).map((hint, i) => (
              <li key={i} className="guess-hint-item">
                <span className="guess-hint-num">{i + 1}</span>
                <span>{hint}</span>
              </li>
            ))}
          </ul>

          {showAnswer && (
            <div className="guess-answer">
              <span className="guess-answer-flag">{current.flag}</span>
              <span className="guess-answer-name">{current.answer}</span>
            </div>
          )}

          <div className="guess-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={revealNextHint}
              disabled={revealedHints >= current.hints.length}
            >
              {t('guessNextHint')}
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setShowAnswer(true)}
              disabled={showAnswer}
            >
              {t('guessShowAnswer')}
            </button>
            <button type="button" className="primary-btn" onClick={nextQuestion}>
              {t('guessNextCountry')}
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-state">{t('guessEmpty')}</p>
      )}
    </div>
  )
}
