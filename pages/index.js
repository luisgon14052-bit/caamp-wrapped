import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function buscar(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/coach?name=' + name);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (err) {
      setError('Nombre no encontrado');
      setData(null);
    }
  }

  return (
    <>
      {/* Animaciones globales */}
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes glow {
          from {
            box-shadow: 0 0 0px rgba(0, 255, 156, 0.0);
          }
          to {
            box-shadow: 0 0 24px rgba(0, 255, 156, 0.35);
          }
        }
      `}</style>

      <div style={styles.bg}>
        {/* PANTALLA 1: INPUT */}
        {!data && (
          <div style={styles.center}>
            {/* Logo Caamp (opcional pero recomendado) */}
            <div style={styles.logoWrap}>
              <img
                src="/caamp-logo.png"
                alt="Caamp"
                style={styles.logo}
              />
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
                placeholder="Escribe tu nombre tal cual aparece"
              />
              <button style={styles.button}>Ver mi Wrapped</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}
          </div>
        )}

        {/* PANTALLA 2: RESULTADOS */}
        {data && (
          <div style={styles.cards}>
            <div style={styles.headerRow}>
              <div>
                <p style={styles.miniLabel}>Caamp Wrapped</p>
                <h2 style={styles.name}>{data.name}</h2>
              </div>
              <div style={styles.badge}>
                2025
              </div>
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
    background:
      'radial-gradient(circle at top, #00ff9c22 0, transparent 60%), radial-gradient(circle at bottom, #00b8ff22 0, #050505 60%)',
    color: '#fff',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif',
    padding: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 420
  },
  logoWrap: {
    marginBottom: 24,
    display: 'flex',
    justifyContent: 'center'
  },
  logo: {
    width: 140,
    height: 'auto',
    opacity: 0.95
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    marginBottom: 8,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.75,
    marginBottom: 24
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8
  },
  input: {
    padding: 14,
    borderRadius: 999,
    border: 'none',
    fontSize: 16,
    textAlign: 'center',
    outline: 'none',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: '#fff'
  },
  button: {
    padding: 14,
    borderRadius: 999,
    border: 'none',
    background:
      'linear-gradient(120deg, #00ff9c, #00c97b)',
    color: '#000',
    fontWeight: 700,
    fontSize: 16,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  error: {
    marginTop: 10,
    color: '#ff7676',
    fontSize: 13
  },
  cards: {
    width: '100%',
    maxWidth: 430,
    textAlign: 'left',
    animation: 'fadeUp 450ms ease-out forwards'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  miniLabel: {
    fontSize: 12,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 1.2
  },
  name: {
    fontSize: 30,
    margin: 0,
    marginTop: 4
  },
  badge: {
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '6px 14px',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  card: {
    background: 'rgba(10,10,10,0.9)',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    border: '1px solid rgba(255,255,255,0.05)'
  },
  cardLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  cardNumber: {
    fontSize: 26,
    fontWeight: 700
  },
  cardMain: {
    marginTop: 16,
    background:
      'linear-gradient(135deg, #00ff9c, #00c97b)',
    borderRadius: 22,
    padding: 22,
    color: '#000',
    boxShadow: '0 18px 40px rgba(0,0,0,0.35)'
  },
  cardLabelDark: {
    fontSize: 13,
    opacity: 0.9,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  mainTitle: {
    fontSize: 22,
    display: 'block',
    marginBottom: 6
  },
  mainSubtitle: {
    fontSize: 14,
    opacity: 0.9
  },
  back: {
    marginTop: 20,
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    padding: 10,
    borderRadius: 999,
    cursor: 'pointer',
    width: '100%',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1
  }
};
