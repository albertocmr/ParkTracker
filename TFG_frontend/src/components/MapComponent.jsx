import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';

import { initializeMap } from '../util/map';
import { loadRestrictions } from '../util/loadRestrictions';
import { removeGPXLayers, addGPXToMap, addIntersectionsToMap } from '../util/gpxManager';
import { executeScriptPython } from '../util/scriptManager';
import Modal from './Modal';
import { formatParkName } from '../util/ParkNameFormatter';

const METHODS = [
  { value: "1", label: "Motor", description: "Has seleccionado realizar la ruta en un vehículo a motor.", icon: "M5 17h14M6.5 17l1.2-5.2A2 2 0 0 1 9.6 10h4.8a2 2 0 0 1 1.9 1.8L17.5 17M7.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" },
  { value: "2", label: "Bicicleta", description: "Has seleccionado realizar la ruta en bicicleta.", icon: "M5.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.5 14.5 9 8h5l4.5 6.5M9 8l3 6.5h-6.5M14 5h2.5" },
  { value: "3", label: "A pie", description: "Has seleccionado realizar la ruta a pie.", icon: "M13 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM9 21l2-6 2.5 2.5V21M8 11l3-3 3 2.5 2.5 1M11 8l-1 7" },
];

const NOTICE_STYLES = {
  success: "border-pine-500/20 bg-pine-50 text-pine-800",
  error: "border-clay-500/25 bg-clay-50 text-clay-600",
  info: "border-pine-900/10 bg-white text-pine-900/75",
};


const Step = ({ n, title, done, children }) => (
  <div className="relative pl-11">
    <span className={`absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${done ? "bg-pine-700 text-paper-50" : "bg-pine-100 text-pine-700"}`}>
      {done ? "✓" : n}
    </span>
    <h2 className="font-sans text-sm font-semibold text-pine-950">{title}</h2>
    <div className="mt-3">{children}</div>
  </div>
);

function Map() {
  const [map, setMap] = useState(null);
  const [loadingScript, setLoadingScript] = useState(false);
  const [gpxLayers, setGpxLayers] = useState([]);
  const [selectedGPXFile, setSelectedGPXFile] = useState(null);
  const [parksList, setParksList] = useState([]);
  const [intersections, setIntersections] = useState({});
  const [restrictions, setRestrictions] = useState({});
  const [selectedMethod, setSelectedMethod] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [notice, setNotice] = useState(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef(null);

  const notify = useCallback((type, text) => setNotice({ type, text }), []);

  const cleanedParkList = useMemo(() => {
    return parksList.map((park) => park.replace(/"/g, '').trim());
  }, [parksList])

  useEffect(() => {
    if (cleanedParkList.length > 0) {
      loadRestrictions(cleanedParkList, setRestrictions, selectedMethod);
    }
  }, [cleanedParkList, selectedMethod]);

  useEffect(() => {
    if (map) return;
    initializeMap(setMap);
  }, [map]);

  const message = METHODS.find((m) => m.value === selectedMethod)?.description;

  const handleFile = (file) => {
    if (!selectedMethod) {
      notify('error', 'Antes de subir la ruta, selecciona el medio en el que la vas a realizar.');
      return;
    }
    setAnalyzed(false);
    setParksList([]);
    setIntersections({});
    addGPXToMap(file, map, setSelectedGPXFile, gpxLayers, setGpxLayers, notify);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const checkRoute = () => {
    setNotice(null);
    executeScriptPython(selectedGPXFile, setLoadingScript, setParksList, setIntersections, () => {
      setAnalyzed(true);
      setShowResults(true);
    }, notify);
  };

  const clearLayers = () => {
    removeGPXLayers(map, gpxLayers, setGpxLayers);
    setSelectedGPXFile(null);
    setAnalyzed(false);
    setParksList([]);
    setIntersections({});
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="max-w-2xl">
        <p className="eyebrow">Analizador de rutas</p>
        <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Comprueba tu ruta</h1>
        <p className="mt-4 leading-relaxed text-pine-900/70">
          Descubre si tu recorrido atraviesa algún parque natural de Andalucía y qué normas debes cumplir en él.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[380px_1fr]">
        {/* Panel de pasos */}
        <aside className="card h-fit space-y-8 p-6 sm:p-7">
          <Step n="1" title="¿Cómo harás la ruta?" done={!!selectedMethod}>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Elige tu método para realizar la ruta">
              {METHODS.map(({ value, label, icon }) => {
                const active = selectedMethod === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedMethod(value)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3.5 text-xs font-medium transition ${active
                      ? "border-pine-700 bg-pine-800 text-paper-50 shadow-soft"
                      : "border-pine-900/10 bg-paper-50 text-pine-900/75 hover:border-pine-500/40 hover:bg-white"}`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={icon} /></svg>
                    {label}
                  </button>
                );
              })}
            </div>
            {message && <p className="mt-3 text-xs text-pine-900/60">{message}</p>}
          </Step>

          <Step n="2" title="Sube tu archivo GPX" done={!!selectedGPXFile}>
            <label
              htmlFor="fileInput"
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition ${dragging
                ? "border-pine-500 bg-pine-50"
                : "border-pine-900/10 bg-paper-50 hover:border-pine-500/50 hover:bg-white"}`}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-pine-500"><path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" /></svg>
              {selectedGPXFile ? (
                <span className="mt-3 max-w-full truncate text-sm font-semibold text-pine-900">{selectedGPXFile.name}</span>
              ) : (
                <span className="mt-3 text-sm font-medium text-pine-900">Arrastra tu ruta o <span className="text-pine-600 underline decoration-pine-300 underline-offset-4">elige un archivo</span></span>
              )}
              <span className="mt-1 text-xs text-pine-900/45">Formato .gpx</span>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                id="fileInput"
                accept=".gpx"
                onChange={(event) => handleFile(event.target.files[0])}
              />
            </label>
          </Step>

          <Step n="3" title="Analiza el recorrido" done={analyzed}>
            <div className="flex flex-col gap-2.5">
              <button type="button" className="btn-primary w-full" onClick={checkRoute} disabled={loadingScript || !selectedGPXFile}>
                {loadingScript ? <><span className="spinner h-4 w-4" /> Analizando…</> : "Comprueba tu ruta"}
              </button>
              <div className="grid grid-cols-2 gap-2.5">
                <button type="button" className="btn-secondary" disabled={!analyzed} onClick={() => setShowResults(true)}>
                  Ver resultados
                </button>
                <button type="button" className="btn-secondary" disabled={!analyzed} onClick={() => addIntersectionsToMap(map, intersections, setGpxLayers, notify)}>
                  Ver tramos
                </button>
              </div>
              <button type="button" className="btn-ghost w-full text-clay-600 hover:bg-clay-50" onClick={clearLayers} disabled={gpxLayers.length === 0}>
                Limpiar mapa
              </button>
            </div>
          </Step>

          {notice && (
            <div className={`animate-fade-up rounded-2xl border px-4 py-3 text-sm ${NOTICE_STYLES[notice.type]}`} role="status">
              {notice.text}
            </div>
          )}
        </aside>

        {/* Mapa */}
        <div className="card relative isolate h-[520px] overflow-hidden p-0 lg:h-[680px]">
          <div id="map" />
          {loadingScript && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center bg-paper/60 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-pine-900 shadow-lift">
                <span className="spinner h-4 w-4 text-pine-600" /> Cruzando tu ruta con los parques naturales…
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute left-4 top-4 z-[400] flex flex-col gap-1.5 rounded-2xl bg-white/90 px-3.5 py-2.5 text-[11px] font-medium text-pine-900/75 shadow-soft backdrop-blur">
            <span className="flex items-center gap-2"><span className="h-0.5 w-4 rounded bg-pine-800" />Tu ruta</span>
            <span className="flex items-center gap-2"><span className="h-1 w-4 rounded bg-clay-500" />Tramo en parque</span>
            <span className="flex items-center gap-2"><span className="h-3 w-4 rounded-sm border border-pine-600 bg-pine-500/15" />Parque natural</span>
          </div>
        </div>
      </div>

      <Modal
        open={showResults}
        onClose={() => setShowResults(false)}
        title={parksList.length > 0 ? "Tu ruta atraviesa espacios protegidos" : "Tu ruta no atraviesa parques naturales"}
        subtitle={parksList.length > 0 ? `${parksList.length} ${parksList.length === 1 ? "parque natural" : "parques naturales"} · ${METHODS.find((m) => m.value === selectedMethod)?.label ?? ""}` : undefined}
        footer={
          <>
            {parksList.length > 0 && (
              <button type="button" className="btn-secondary" onClick={() => { setShowResults(false); addIntersectionsToMap(map, intersections, setGpxLayers, notify); }}>
                Ver tramos en el mapa
              </button>
            )}
            <button type="button" className="btn-primary" onClick={() => setShowResults(false)}>Cerrar</button>
          </>
        }
      >
        {parksList.length > 0 ? (
          <div className="space-y-8">
            <ul className="flex flex-wrap gap-2">
              {parksList.map((park) => (
                <li key={park} className="inline-flex items-center gap-2 rounded-full bg-pine-50 px-3.5 py-1.5 text-sm font-medium text-pine-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-pine-500" />{formatParkName(park)}
                </li>
              ))}
            </ul>

            <div className="restrictions space-y-10">
              {parksList.map((park) => {
                const ParkRestrictions = restrictions[park];
                return (
                  <div key={park}>
                    {ParkRestrictions ? <ParkRestrictions /> : <p className="text-sm text-pine-900/60">No hay restricciones disponibles para este parque.</p>}
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-paper px-5 py-4 text-sm leading-relaxed text-pine-900/75">
              <p>
                <strong className="font-semibold text-pine-950">Nota:</strong> las restricciones se basan en la normativa de <strong className="font-semibold text-pine-950">uso público, turismo activo, ecoturismo y educación ambiental</strong> recogida en los <a href="https://www.juntadeandalucia.es/medioambiente/portal/areas-tematicas/espacios-protegidos/gestion-espacios-protegidos/porn-prug-planes-de-gestion/documentos-aprobados" target="_blank" rel="noopener noreferrer" className="font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-900">planes PORN y PRUG</a>.
              </p>
              <p className="mt-2">
                Las actividades que requieren autorización (filmaciones, acampadas organizadas o eventos deportivos) deben solicitarse a la Delegación Territorial competente. Consulta el procedimiento en la <a href="https://www.juntadeandalucia.es/servicios/sede/tramites/procedimientos/detalle/727.html" target="_blank" rel="noopener noreferrer" className="font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-900">web de la Junta de Andalucía</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="mx-auto max-w-md leading-relaxed text-pine-900/70">
              Ningún tramo de la ruta entra en los perímetros de los parques naturales andaluces. ¡Disfruta del recorrido!
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Map;
