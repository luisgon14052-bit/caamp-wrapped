
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
    }
  }

  return (
    <div style={{ background:'#041124', minHeight:'100vh', color:'#fff', padding:40 }}>
      <h1>Caamp Coaches Wrapped 2025</h1>

      <form onSubmit={buscar}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Escribe tu nombre" />
        <button>Ver mi Wrapped</button>
      </form>

      {error && <p>{error}</p>}

      {data && (
        <div style={{ marginTop:30 }}>
          <h2>{data.name}</h2>
          <p>Clases: {data.clases_impartidas}</p>
          <p>Reservaciones: {data.total_reservaciones}</p>
          <p>Asistencias: {data.total_asistencias}</p>
          <p>Efectividad: {data.efectividad_pct}%</p>
          <h3>Clase más llena:</h3>
          <p>{data.clase_mas_llena.name} — {data.clase_mas_llena.max_asistencias}</p>
        </div>
      )}
    </div>
  );
}
