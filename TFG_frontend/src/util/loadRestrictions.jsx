import ParkRestrictions, { NORMATIVA } from "../components/ParkRestrictions";

export const loadRestrictions = async (parks, setRestrictions, selectedMethod) => {
    const restrictionsMap = {};
    for (const park of parks) {
      if (!park.trim()) continue;

      if (NORMATIVA[park]) {
        restrictionsMap[park] = () => <ParkRestrictions slug={park} selectedMethod={selectedMethod} />;
      } else {
        console.warn(`No se encontraron restricciones para: ${park}`);
        restrictionsMap[park] = () => <div>No hay restricciones disponibles.</div>;
      }
    }
    setRestrictions(restrictionsMap);
  };
