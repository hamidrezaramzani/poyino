import { useI18n } from "../i18n/i18n-provider";
import { useTheme } from "./theme-provider";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "language-toggle" }: ThemeToggleProps) {
  const { t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={isDark ? t.switchThemeToLight : t.switchThemeToDark}
      title={isDark ? t.switchThemeToLight : t.switchThemeToDark}
    >
      <span className="theme-toggle-icon" aria-hidden>
        {isDark ? (
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none">
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
            <path
              d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none">
            <path
              d="M20.5 14.3A8.5 8.5 0 0 1 9.7 3.5 7 7 0 1 0 20.5 14.3Z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>{isDark ? t.switchThemeToLight : t.switchThemeToDark}</span>
    </button>
  );
}
