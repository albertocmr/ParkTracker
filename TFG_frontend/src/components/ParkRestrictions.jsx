import { PARKS } from "../data/parks.js";

// Normativa de cada parque (src/data/normativa/<parque>.json), contrastada con su PORN y PRUG vigentes.
// Cada norma indica los medios a los que afecta (general, motor, bike, hike, otras), su régimen y su fuente.
export const NORMATIVA = Object.fromEntries(
  Object.entries(import.meta.glob("../data/normativa/*.json", { eager: true, import: "default" }))
    .map(([path, data]) => [path.split("/").pop().replace(".json", ""), data])
);

const METHODS = { "1": "motor", "2": "bike", "3": "hike" };

const METHOD_NAMES = {
  motor: "Vehículo a motor.",
  bike: "Bicicleta.",
  hike: "Senderismo.",
  all: "Todas las restricciones (vehículos a motor, ciclismo y senderismo)",
};

// Orden en que se muestran los regímenes
const SECTIONS = [
  ["prohibida", "Prohibiciones en el parque natural"],
  ["autorizacion", "Requieren autorización"],
  ["comunicacion_previa", "Requieren comunicación previa"],
  ["condicion", "Normas de uso"],
];

const Sections = ({ title, items }) => (
  <section className="mb-4 mt-4 p-2">
    <h2 className="ms-4 mb-2"><u>{title}</u></h2>
    <ul className="list-group mb-4 border border-dark">
      {items.map((item, index) => (
        <li key={index} className={`list-group-item ${index % 2 === 0 ? "list-group-item-dark" : ""}`}>
          {item.texto}
        </li>
      ))}
    </ul>
  </section>
);

const ParkRestrictions = ({ slug, selectedMethod }) => {
  const data = NORMATIVA[slug];
  if (!data) return <div>No hay restricciones disponibles.</div>;

  const methodKey = METHODS[selectedMethod] ?? "all";
  const name = PARKS[slug]?.name ?? slug.replace(/_/g, " ");

  // Con un medio elegido se muestran sus normas; sin medio, todas (las generales aparte)
  const normas = data.normas.filter((n) =>
    methodKey === "all" ? !n.medios.includes("general") : n.medios.includes(methodKey)
  );
  const generales = data.normas.filter((n) => n.medios.includes("general"));

  return (
    <div className="container shadow p-3">
      <div className="card-container">
        <h3 className="mb-4">Restricciones del Parque Natural {name}.</h3>
        <h4>Método seleccionado: {METHOD_NAMES[methodKey]}</h4>
        {methodKey === "all" && generales.length > 0 && <Sections title="Normas Generales" items={generales} />}
        {SECTIONS.map(([regimen, title]) => {
          const items = normas.filter((n) => n.regimen === regimen);
          return items.length > 0 && <Sections key={regimen} title={title} items={items} />;
        })}
        {normas.length === 0 && <p>El plan no establece normas específicas para este medio.</p>}
      </div>
    </div>
  );
};

export default ParkRestrictions;
