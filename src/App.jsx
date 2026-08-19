import { useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { getTranslator } from './i18n'
import WheelTab from './WheelTab'
import NamesTab from './NamesTab'
import TeamsTab from './TeamsTab'
import HistoryTab from './HistoryTab'
import GuessCountryTab from './GuessCountryTab'
import './App.css'

const DEFAULT_NAMES = []

export default function App() {
  const [names, setNames] = useLocalStorage('spinit.names', DEFAULT_NAMES)
  const [history, setHistory] = useLocalStorage('spinit.history', [])
  const [lang, setLang] = useLocalStorage('spinit.lang', 'ar')
  const [theme, setTheme] = useLocalStorage('spinit.theme', 'dark')
  const [soundOn, setSoundOn] = useLocalStorage('spinit.sound', true)
  const [autoRemove, setAutoRemove] = useLocalStorage('spinit.autoRemove', false)
  const [teamCount, setTeamCount] = useLocalStorage('spinit.teamCount', 2)
  const [teams, setTeams] = useLocalStorage('spinit.teams', [])
  const [activeTab, setActiveTab] = useState('wheel')
  const [lastSpin, setLastSpin] = useState(null)

  const t = getTranslator(lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleLang() {
    setLang(lang === 'ar' ? 'en' : 'ar')
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('appTitle')}</h1>
        <div className="app-header-actions">
          <button
            type="button"
            className="icon-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('darkMode') : t('lightMode')}
            title={theme === 'dark' ? t('darkMode') : t('lightMode')}
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            className="icon-toggle"
            onClick={() => setSoundOn(!soundOn)}
            aria-label={soundOn ? t('soundOn') : t('soundOff')}
            title={soundOn ? t('soundOn') : t('soundOff')}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button type="button" className="lang-toggle" onClick={toggleLang}>
            {t('langToggle')}
          </button>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'wheel' && (
          <WheelTab
            names={names}
            setNames={setNames}
            history={history}
            setHistory={setHistory}
            autoRemove={autoRemove}
            setAutoRemove={setAutoRemove}
            soundOn={soundOn}
            t={t}
            lastSpin={lastSpin}
            setLastSpin={setLastSpin}
          />
        )}
        {activeTab === 'names' && (
          <NamesTab names={names} setNames={setNames} t={t} />
        )}
        {activeTab === 'teams' && (
          <TeamsTab
            names={names}
            teamCount={teamCount}
            setTeamCount={setTeamCount}
            teams={teams}
            setTeams={setTeams}
            t={t}
          />
        )}
        {activeTab === 'history' && (
          <HistoryTab history={history} setHistory={setHistory} lang={lang} t={t} />
        )}
        {activeTab === 'guess' && <GuessCountryTab t={t} />}
      </main>

      <nav className="tab-bar">
        <button
          type="button"
          className={activeTab === 'wheel' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('wheel')}
        >
          <span className="tab-icon">🎡</span>
          <span>{t('tabWheel')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'names' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('names')}
        >
          <span className="tab-icon">📝</span>
          <span>{t('tabNames')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'teams' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('teams')}
        >
          <span className="tab-icon">👥</span>
          <span>{t('tabTeams')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'history' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('history')}
        >
          <span className="tab-icon">🕘</span>
          <span>{t('tabHistory')}</span>
        </button>
        <button
          type="button"
          className={activeTab === 'guess' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('guess')}
        >
          <span className="tab-icon">🌍</span>
          <span>{t('tabGuess')}</span>
        </button>
      </nav>
    </div>
  )
}
