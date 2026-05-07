import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'

export default function Settings({ toast }) {
  const { user, userProfile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { t, lang, setLang, languages } = useI18n()

  const exportData = () => {
    const data = {
      prompts: JSON.parse(localStorage.getItem('vs-prompts') || '[]'),
      theme: localStorage.getItem('vs-t'),
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'visari-studio-export.json'
    a.click()
    URL.revokeObjectURL(a.href)
    toast(t('settings.dataExported'))
  }

  const deleteAllData = () => {
    if (confirm(t('settings.clearConfirm'))) {
      localStorage.removeItem('vs-prompts')
      toast(t('settings.dataCleared'))
    }
  }

  return (
    <div className="sec">
      <div className="sec-h">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </div>

      <div className="sub">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('settings.appearance')}</h2>
        <div className="card">
          <div className="toggle-row">
            <span>{t('settings.theme')}: {theme === 'dark' ? t('settings.dark') : t('settings.light')}</span>
            <button className={`toggle-switch${theme === 'light' ? ' on' : ''}`} onClick={toggleTheme} aria-label={t('settings.theme')} />
          </div>
        </div>
      </div>

      <div className="sub">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('settings.language')}</h2>
        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
            {languages.map(l => (
              <button
                key={l.code}
                className={`pt-t${lang === l.code ? ' on' : ''}`}
                onClick={() => setLang(l.code)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-start' }}
              >
                <span>{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {user && (
        <div className="sub">
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('settings.account')}</h2>
          <div className="card" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div className="avatar-circle" style={{ width: 48, height: 48, fontSize: 18 }}>
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <span>{(userProfile?.displayName || user.email || 'U')[0].toUpperCase()}</span>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{userProfile?.displayName || 'User'}</div>
                <div style={{ fontSize: 12, color: 'var(--t2)' }}>{user.email}</div>
                <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2 }}>
                  {userProfile?.tier === 'pro' ? t('nav.proPlan') : t('nav.freePlan')}
                </div>
              </div>
            </div>
            <button className="btn" onClick={logout}>{t('common.signOut')}</button>
          </div>
        </div>
      )}

      <div className="sub">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('settings.dataManagement')}</h2>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--t1)', marginBottom: 14, lineHeight: 1.6 }}>
            {t('settings.dataInfo')}
          </p>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={exportData}>{t('settings.exportData')}</button>
            <button className="btn" onClick={deleteAllData} style={{ color: '#ef4444', borderColor: '#ef4444' }}>{t('settings.clearData')}</button>
          </div>
        </div>
      </div>

      <div className="sub">
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{t('settings.privacyLegal')}</h2>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.6, marginBottom: 12 }}>
            {t('settings.privacyInfo')}
          </p>
          <ul style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.8, paddingLeft: 20, marginBottom: 14 }}>
            <li>{t('settings.privacyPoints.collect')}</li>
            <li>{t('settings.privacyPoints.use')}</li>
            <li>{t('settings.privacyPoints.access')}</li>
            <li>{t('settings.privacyPoints.security')}</li>
          </ul>
          <div className="row" style={{ gap: 8 }}>
            <a href="/privacy" className="btn" target="_blank">{t('settings.privacyPolicy')}</a>
            <a href="/terms" className="btn" target="_blank">{t('settings.termsOfService')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}
