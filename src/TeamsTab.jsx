import { WHEEL_COLORS } from './constants'

function shuffleArray(arr) {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function TeamsTab({ names, teamCount, setTeamCount, teams, setTeams, t }) {
  const maxTeams = Math.max(2, Math.min(names.length, 12))
  const canSplit = names.length >= 2 && teamCount >= 2 && names.length >= teamCount

  function adjustCount(delta) {
    const next = Math.min(maxTeams, Math.max(2, teamCount + delta))
    setTeamCount(next)
  }

  function splitTeams() {
    if (!canSplit) return
    const shuffled = shuffleArray(names)
    const buckets = Array.from({ length: teamCount }, () => [])
    shuffled.forEach((name, i) => {
      buckets[i % teamCount].push(name)
    })
    setTeams(buckets)
  }

  return (
    <div className="teams-tab">
      <h2>{t('teamsTitle')}</h2>

      <div className="team-count-row">
        <span>{t('teamCountLabel')}</span>
        <div className="stepper">
          <button
            type="button"
            className="icon-btn stepper-btn"
            onClick={() => adjustCount(-1)}
            disabled={teamCount <= 2}
          >
            −
          </button>
          <span className="stepper-value">{teamCount}</span>
          <button
            type="button"
            className="icon-btn stepper-btn"
            onClick={() => adjustCount(1)}
            disabled={teamCount >= maxTeams}
          >
            +
          </button>
        </div>
      </div>

      {names.length < teamCount && (
        <p className="hint">{t('notEnoughNamesForTeams')}</p>
      )}

      <button
        type="button"
        className="primary-btn"
        onClick={splitTeams}
        disabled={!canSplit}
      >
        {teams.length > 0 ? t('reshuffleTeams') : t('splitTeams')}
      </button>

      {teams.length === 0 ? (
        <p className="empty-state">{t('teamsEmpty')}</p>
      ) : (
        <div className="teams-grid">
          {teams.map((members, i) => (
            <div className="team-card" key={i}>
              <div
                className="team-card-header"
                style={{ background: WHEEL_COLORS[i % WHEEL_COLORS.length] }}
              >
                <span>{t('teamName', i)}</span>
                <span className="team-card-count">{t('teamMembersCount', members.length)}</span>
              </div>
              <ul className="team-card-list">
                {members.map((name, j) => (
                  <li key={`${name}-${j}`}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
