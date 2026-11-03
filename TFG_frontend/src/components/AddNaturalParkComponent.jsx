import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";

const FIELDS = [
  { id: "name", label: "Nombre", placeholder: "Sierra de Huétor" },
  { id: "province", label: "Provincia", placeholder: "Granada" },
  { id: "perimeterfile", label: "Archivo de perímetro", placeholder: "sierra_huetor", hint: "Nombre del GeoJSON en src/assets/coordinates, sin extensión." },
];

const AddNaturalParkComponent = ({ id }) => {
  const [park, setPark] = useState({ name: "", province: "", perimeterfile: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    axios.get(`${API_URL}/api/natural_parks/${id}`)
      .then(res => setPark(res.data))
      .catch(error => {
        console.error("Error al cargar parque:", error);
        setError("No se ha podido cargar el parque.");
      });
  }, [id]);

  const handleChange = e => {
    setPark({ ...park, [e.target.id]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const req = id
      ? axios.put(`${API_URL}/api/natural_parks/${id}`, park)
      : axios.post(`${API_URL}/api/natural_parks`, park);

    req
      .then(() => {
        window.location.href = "/managementdb";
      })
      .catch(err => {
        console.error("Error guardando:", err);
        setError(err.response?.status === 403 || err.response?.status === 401
          ? "No tienes permisos para guardar cambios."
          : "No se ha podido guardar el parque.");
        setSaving(false);
      });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-6">
      <a href="/managementdb" className="inline-flex items-center gap-1.5 text-sm font-medium text-pine-700 hover:text-pine-950">
        <span aria-hidden="true">←</span> Volver a la gestión
      </a>
      <h1 className="mt-4 text-4xl font-medium">{id ? "Editar parque natural" : "Nuevo parque natural"}</h1>

      <form className="card mt-8 space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
        {FIELDS.map(({ id: field, label, placeholder, hint }) => (
          <div key={field}>
            <label htmlFor={field} className="label">{label}</label>
            <input
              type="text"
              id={field}
              className="input"
              value={park[field] ?? ""}
              onChange={handleChange}
              placeholder={placeholder}
              required
            />
            {hint && <p className="mt-1.5 text-xs text-pine-900/50">{hint}</p>}
          </div>
        ))}

        {error && <p className="rounded-xl bg-clay-50 px-4 py-3 text-sm text-clay-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <a href="/managementdb" className="btn-secondary">Cancelar</a>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <span className="spinner h-4 w-4" />}
            {id ? "Guardar cambios" : "Crear parque"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNaturalParkComponent;
