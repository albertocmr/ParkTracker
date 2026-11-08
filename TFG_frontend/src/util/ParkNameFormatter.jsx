
export const parkNameMap = {
  "bahia cadiz": "Parque Natural Bahía de Cádiz",
  "cabo de gata nijar": "Parque Natural Cabo de Gata-Níjar",
  "del estrecho": "Parque Natural del Estrecho",
  "despeniaperros": "Parque Natural Despeñaperros",
  "los alcornocales": "Parque Natural Los Alcornocales",
  "montes malaga": "Parque Natural Montes de Málaga",
  "natural doniana": "Parque Natural de Doñana",
  "sierra andujar": "Parque Natural Sierra de Andújar",
  "sierra aracena": "Parque Natural Sierra de Aracena y Picos de Aroche",
  "sierra baza": "Parque Natural Sierra de Baza",
  "sierra cardenia montoro": "Parque Natural Sierra de Cardeña y Montoro",
  "sierra castril": "Parque Natural Sierra de Castril",
  "sierra cazorla": "Parque Natural Sierras de Cazorla, Segura y Las Villas",
  "sierra grazalema": "Parque Natural Sierra de Grazalema",
  "sierra hornachuelos": "Parque Natural Sierra de Hornachuelos",
  "sierra huetor": "Parque Natural Sierra de Huétor",
  "sierra magina": "Parque Natural Sierra Mágina",
  "sierra maria los velez": "Parque Natural Sierra María-Los Vélez",
  "sierra nevada": "Parque Natural de Sierra Nevada",
  "sierra nieves": "Parque Natural Sierra de las Nieves",
  "sierra norte sevilla": "Parque Natural Sierra Morena de Sevilla",
  "sierra tejeda": "Parque Natural Sierras de Tejeda, Almijara y Alhama",
  "sierras subbeticas": "Parque Natural Sierras Subbéticas"
};


export function formatParkName(rawName) {
  if (!rawName) return "";
  const normalized = rawName
    .toLowerCase()
    .replace(/_/g, " ")
    .trim();

  if (parkNameMap[normalized]) {
    return parkNameMap[normalized];
  }

  const capitalized = normalized
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `Parque Natural ${capitalized}`;
}