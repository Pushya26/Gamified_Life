export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        system: {
          blue: '#00D4FF',
          purple: '#7B2FBE',
          gold: '#FFD700',
          dark: '#050A18',
          panel: '#0A1628',
          border: '#1A2C4E',
          danger: '#FF3A3A',
          success: '#39FF14',
          rank: {
            e: '#9CA3AF',
            d: '#22C55E',
            c: '#3B82F6',
            b: '#A855F7',
            a: '#F97316',
            s: '#EAB308',
          },
        },
      },
      boxShadow: {
        'system-glow': '0 0 30px rgba(0, 212, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
