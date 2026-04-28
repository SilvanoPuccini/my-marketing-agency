/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-0': '#0A0A0F',
        'bg-1': '#0F0F15',
        'bg-2': '#13131A',
        'bg-3': '#1A1A22',
        'bg-4': '#22222C',
        'line-1': 'rgba(255,255,255,0.06)',
        'line-2': 'rgba(255,255,255,0.10)',
        'line-3': 'rgba(255,255,255,0.16)',
        'fg-1': '#F4F4F7',
        'fg-2': '#B6B6C2',
        'fg-3': '#7A7A88',
        'fg-4': '#4A4A55',
        'violet-500': '#7C3AED',
        'violet-400': '#9560F4',
        'violet-600': '#6929D6',
        'violet-soft': 'rgba(124,58,237,0.12)',
        'violet-glow': 'rgba(124,58,237,0.25)',
        'status-draft': '#7A7A88',
        'status-sent': '#3B82F6',
        'status-approved': '#10B981',
        'status-rejected': '#EF4444',
        'status-published': '#7C3AED',
      },
      fontFamily: {
        sans: ['Geist Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '1': '4px',
        '2': '6px',
        '3': '10px',
      },
    },
  },
  plugins: [],
}
