import { useState, useRef } from 'react';

// ✅ ALIAS DE NOMBRES
const NAME_ALIASES = {
  'adriana': 'Adriana',
  'ana sofia': 'Ana Sofía',
  'sofia': 'Ana Sofía',
  'sofi': 'Ana Sofía',

  'andrea': 'Andrea',
  'baca': 'Baca',
  'caap': 'Caap',

  'fer barraza': 'Fer Barraza',
  'fer': 'Fer Barraza',
  'fernanda': 'Fer Barraza',

  'guest coach  mich': 'Guest coach  Mich',
  'guest coach anape!': 'Guest coach AnaPe!',
  'guest coach dani!': 'Guest coach Dani!',
  'guest coach gaby': 'Guest coach Gaby',
  'guest coach irma': 'Guest coach Irma',
  'guest coach joaquin': 'Guest coach Joaquin',
  'guest coach karo': 'Guest coach Karo',
  'guest coach kenia': 'Guest coach Kenia',

  'julio': 'Julio',
  'marianna!': 'Marianna!',

  'misa': 'Misa',
  'misael': 'Misa',

  'sofit': 'SOFIT',
  'sebas': 'Sebas'
};

function normalizeName(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export default function Home() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);
  const audioRef = useRef(null);

  async function buscar(e) {
    e.preventDefault();
    setError('');
    setData(null);

    const normalized = normalizeName(name);
    const officialName = NAME_ALIASES[normalized];

    if (!officialName) {
      setError('Nombre no encontrado');
      return;
    }

    try {
      const res = await fetch('/api/coach?name=' + encodeURIComponent(officialName));
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError('Nombre no encontrado');
      setData(null);
    }
  }

  function handleActivateAudio() {
    if (activated) return;
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setActivated(true);
        })
        .catch(() => {
          // si el navegador no deja, no truena la app
        });
    }
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glow {
          from { box-shadow: 0 0 0px rgba(0,255,156,0); }
          to { box-shadow: 0 0 24px rgba(0,255,156,.35); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        style={styles.bg}
        onClick={handleActivateAudio}
      >
        {/* 🎧 AUDIO CARGADO DESDE /public */}
        <audio
          ref={audioRef}
          loop
          muted
          autoPlay
          playsInline
        >
          <source src="/musica.mp3" type="audio/mpeg" />
        </audio>

        {!data && (
          <div style={styles.center}>
            <div style={styles.logoWrap}>
              <img src="/caamp-logo.png" alt="Caamp" style={styles.logo} />
            </div>

            <h1 style={styles.title}>Tu año en movimiento</h1>
            <p style={styles.subtitle}>
              Mira lo que lograste como coach en Caamp este año.
            </p>

            <form onSubmit={buscar} style={styles.form}>
              <input
                style={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej. sofia, fer, misael, sebas"
              />
              <button style={styles.button}>Ver mi Wrapped</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}
          </div>
        )}

        {data && (
          <div style={styles.cards}>
            <div style={styles.headerRow}>
              <div>
                <p style={styles.miniLabel}>Caamp Wrapped</p>
                <h2 style={styles.name}>{data.name}</h2>
              </div>
              <div style={styles.badge}>2025</div>
            </div>

            <div style={{ ...styles.card, animation: 'fadeUp 500ms ease-out forwards' }}>
              <p style={styles.cardLabel}>Clases impartidas</p>
              <span style={styles.cardNumber}>{data.clases_impartidas}</span>
            </div>

            <div style={{ ...styles.card, animation: 'fadeUp 600ms ease-out forwards' }}>
              <p style={styles.cardLabel}>Asistencias generadas</p>
              <span style={styles.cardNumber}>{data.total_asistencias}</span>
            </div>

            <div style={{ ...styles.card, animation: 'fadeUp 700ms ease-out forwards' }}>
              <p style={styles.cardLabel}>Efectividad</p>
              <span style={styles.cardNumber}>{data.efectividad_pct}%</span>
            </div>

            <div
              style={{
                ...styles.cardMain,
                animation: 'fadeUp 800ms ease-out forwards, glow 2s ease-in-out infinite alternate'
              }}
            >
              <p style={styles.cardLabelDark}>Tu clase más llena</p>
              <strong style={styles.mainTitle}>{data.clase_mas_llena.name}</strong>
              <span style={styles.mainSubtitle}>
                {data.clase_mas_llena.max_asistencias} personas entrenando contigo
                {data.clase_mas_llena.fecha && (
                  <> el <strong>{data.clase_mas_llena.fecha}</strong></>
                )}
              </span>
            </div>

            <button style={styles.back} onClick={() => setData(null)}>
              Ver otro coach
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #050505, #003b2f, #00ff9c33, #003b2f, #050505)',
    backgroundSize: '300% 300%',
    animation: 'gradientMove 18s ease-in-out infinite',
    color: '#fff',
    fontFamily: 'system-ui, Arial, sans-serif',
    padding: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: { textAlign: 'center', width: '100%', maxWidth: 420 },
  logoWrap: { marginBottom: 24, display: 'flex', justifyContent: 'center' },
  logo: { width: 140, height: 'auto', opacity: 0.95 },
  title: { fontSize: 34, fontWeight: 800, marginBottom: 8 },
  subtitle: { fontSize: 14, opacity: 0.75, marginBottom: 24 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    padding: 14, borderRadius: 999, border: 'none', fontSize: 16,
    textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.08)', color: '#fff'
  },
  button: {
    padding: 14, borderRadius: 999, border: 'none',
    background: 'linear-gradient(120deg, #00ff9c, #00c97b)',
    color: '#000', fontWeight: 700, cursor: 'pointer'
  },
  error: { marginTop: 10, color: '#ff7676', fontSize: 13 },
  cards: { width: '100%', maxWidth: 430 },
  headerRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 24 },
  miniLabel: { fontSize: 12, opacity: 0.7 },
  name: { fontSize: 30 },
  badge: { borderRadius: 999, border: '1px solid #333', padding: '6px 14px' },
  card: { background: '#0f0f0f', borderRadius: 18, padding: 18, marginBottom: 12 },
  cardLabel: { fontSize: 13, opacity: 0.7 },
  cardNumber: { fontSize: 26, fontWeight: 700 },
  cardMain: {
    background: 'linear-gradient(135deg, #00ff9c, #00c97b)',
    borderRadius: 22, padding: 22, color: '#000'
  },
  cardLabelDark: { fontSize: 13 },
  mainTitle: { fontSize: 22 },
  mainSubtitle: { fontSize: 14 },
  back: {
    marginTop: 20, background: 'transparent',
    border: '1px solid #00ff9c', color: '#00ff9c',
    padding: 10, borderRadius: 999, cursor: 'pointer'
  }
};
