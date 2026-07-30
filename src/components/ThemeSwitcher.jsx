function ThemeSwitcher({ theme, onThemeChange }) {
  const themes = [
    { name: 'white', label: 'White', color: '#ffffff' },
    { name: 'green', label: 'Green', color: '#00b894' },
    { name: 'orange', label: 'Orange', color: '#fdcb6e' },
    { name: 'yellow', label: 'Yellow', color: '#ffeaa7' },
  ];

  return (
    <div className="theme-switcher">
      <span className="theme-label">Theme:</span>
      {themes.map((t) => (
        <button
          key={t.name}
          className={`theme-btn ${theme === t.name ? 'active' : ''}`}
          onClick={() => onThemeChange(t.name)}
          title={t.label}
          style={{ backgroundColor: t.color }}
        >
          {theme === t.name && <i className="fas fa-check"></i>}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;