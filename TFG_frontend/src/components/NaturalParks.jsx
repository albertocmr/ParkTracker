import React, { useEffect, useMemo, useState } from 'react';
import NaturalPark from './NaturalPark';
import NaturalParkService from '../service/NaturalParkService'

const NaturalParks = () => {
  const [naturalParks, setNaturalParks] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [province, setProvince] = useState(null);

  useEffect(() => {
    NaturalParkService.getAllNaturalParks()
      .then(response => {
        setNaturalParks(response.data)
      })
      .catch(error => {
        console.error('Error when obtaining natural parks: ', error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [])

  const provinces = useMemo(
    () => [...new Set(naturalParks.map((p) => p.province))].sort((a, b) => a.localeCompare(b, 'es')),
    [naturalParks]
  );

  const visibleParks = naturalParks
    .filter((p) => !province || p.province === province)
    .sort((a, b) => a.name.localeCompare(b.name, 'es'));

  const chipClass = (active) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${active
      ? "bg-pine-800 text-paper-50 shadow-soft"
      : "border border-pine-900/10 bg-white text-pine-900/70 hover:border-pine-500/40 hover:text-pine-950"}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="eyebrow">Red de espacios protegidos</p>
        <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Parques naturales de Andalucía</h1>
        <p className="mt-4 leading-relaxed text-pine-900/70">
          Consulta la normativa de uso público, turismo activo y ecoturismo de cada parque, recogida en sus planes PORN y PRUG.
        </p>
      </div>

      {!loading && !error && (
        <div className="mt-10 flex flex-wrap gap-2" role="toolbar" aria-label="Filtrar por provincia">
          <button type="button" className={chipClass(!province)} onClick={() => setProvince(null)}>
            Todas <span className="ml-1 opacity-60">{naturalParks.length}</span>
          </button>
          {provinces.map((p) => (
            <button key={p} type="button" className={chipClass(province === p)} onClick={() => setProvince(p)}>
              {p}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-10 rounded-2xl border border-clay-500/25 bg-clay-50 px-5 py-4 text-sm text-clay-600">
          No se han podido cargar los parques naturales. Inténtalo de nuevo más tarde.
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="card h-44 animate-pulse p-6">
                <div className="h-3 w-20 rounded bg-pine-100" />
                <div className="mt-5 h-6 w-3/4 rounded bg-pine-100" />
                <div className="mt-2 h-6 w-1/2 rounded bg-pine-100" />
              </div>
            ))
          : visibleParks.map((naturalPark) => (
              <NaturalPark key={naturalPark.id} name={naturalPark.name} province={naturalPark.province} perimeterfile={naturalPark.perimeterfile} />
            ))}
      </div>
    </div>
  );
};

export default NaturalParks;
