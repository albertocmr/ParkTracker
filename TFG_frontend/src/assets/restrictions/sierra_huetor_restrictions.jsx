const generalRules = [
  "El desarrollo de actividades de turismo en el medio rural, de turismo activo y de ecoturismo por parte de empresas se regirá por la normativa vigente, en particular por lo establecido en el Decreto 20/2002, de 29 de enero, y en la Orden de 20 de marzo de 2003, conjunta de las Consejerías de Turismo y Deporte y de Medio Ambiente, y las disposiciones establecidas en el Plan de Ordenación de los Recursos Naturales y en el Plan Rector de Uso y Gestión del Parque Natural Sierra de Huétor.",
  "La Consejería de Turismo, Comercio y Deporte y de Medio Ambiente podrán regular mediante Orden conjunta las obligaciones y condiciones medioambientales para la práctica de aquellas actividades que en el futuro sean declaradas como actividades de turismo activo o ecoturismo.",
  "La práctica y el desarrollo de las actividades de uso público y educación ambiental se realizará asegurando la conservación del patrimonio natural y cultural."
];
const rulesByMethod = {
  motor: [
    "Circulación campo a través o fuera de los caminos permitidos de vehículos a motor.",
    "Circulación de vehículos terrestres a motor por caminos rurales de anchura inferior a 2 metros, ni por servidumbres de los dominios públicos hidráulicos, cortafuegos y fajas auxiliares, vías forestales de extracción de madera y cauces secos e inundados.",
    "Los vehículos no podrán salirse de los caminos, excepto en los lugares previstos para ello.",
    "En caminos de tierra, la velocidad máxima será de 40 km/h, salvo indicación expresa que establezca un límite diferente.",
    "No se circulará a más de 20 km/h en las inmediaciones de los animales.",
    "No se interceptará el movimiento de los grupos de animales.",
    "No se producirán ruidos o sonidos que puedan perturbar a la fauna.",
    "No se utilizará iluminación artificial alguna.",
    "No se arrojarán alimentos ni se realizarán cebados en lugares de tránsito habitual de animales.",
    "No se utilizarán sistemas de atracción, captura o repulsión de animales.",
    "Caravanas organizadas de 4 o más vehículos a motor.",
    "La circulación de quads vinculada a actividades de uso público o turismo activo.",
  ],
  bike: [
    "El acceso y tránsito será libre por los viales de la red pública de caminos, exceptuando los que presenten señalización que indique expresamente una restricción o limitación de paso.",
    "Circulación campo a través o fuera de los caminos permitidos de bicicleta.",
    "No se interceptará el movimiento de los grupos de animales.",
    "No se producirán ruidos o sonidos que puedan perturbar a la fauna.",
    "No se arrojarán alimentos ni se realizarán cebados en lugares de tránsito habitual de animales."
  ],
  hike: [
    "El acceso y tránsito será libre por los viales de la red pública de caminos, exceptuando los que presenten señalización que indique expresamente una restricción o limitación de paso.",
    "No se interceptará el movimiento de los grupos de animales.",
    "No se producirán ruidos o sonidos que puedan perturbar a la fauna.",
    "No se arrojarán alimentos ni se realizarán cebados en lugares de tránsito habitual de animales.",
    "No se utilizarán sistemas de atracción, captura o repulsión de animales.",
    "No se utilizará iluminación artificial alguna.",
    "Acampadas o campamentos juveniles de los comtemplados en el Decreto 45/2000.",
    "La apertura de nuevas vías o escuelas de escalada en paredes y el equipamiento o el desequipamiento de las existentes.",
    "Está prohibido el vivaqueo, entendiendo por tal la actividad de pasar la noche al aire libre utilizando el material específico para ello (saco de dormir, funda de vivac o tiendas de campaña de pequeño tamaño)."
  ]
};


const additionalRules = [
  "Cualquier actividad que se realice en las Zonas de Reserva (A).",
  "Cualquier actividad permitida que se realice fuera de los equipamientos básicos y complementarios que requieran la instalación de dotaciones, incluso cuando éstas sean provisionales.",
  "La realización de cualquier tipo de competición deportiva, prueba o exhibición organizada.",
  "Las actividades recreativas, o relacionadas con ellas, que empleen helicópteros ultraligeros, aviones, avionetas y cualquier vehículo aéreo con motor",
  "El paracaidismo.",
  "Las actividades aeronáuticas siguientes: parapente, ala delta, vuelo sin motor y globo aerostático.",
  "El establecimento de áreas de despegue o aterrizaje, así como la señalización de las mismas, para actividades aeronáuticas sin motor.",
  "La instalación de infraestructuras y equipamientos permanentes para el uso público, el turismo o la educación ambiental.",
  "El descenso de cursos de agua en cualquier tipo de embarcación o artefacto flotante.",
  "Aquellas romerías o concentraciones de carácter popular que hayan comenzado a tener lugar durante los últimos 10 años o se vayan a iniciar en el futuro.",
];

const Sections = ({ title, items }) => (
  <section className="mb-4 mt-4 p-2">
    <h2 className="ms-4 mb-2"><u>{title}</u></h2>
    <ul className="list-group mb-4 border border-dark">
      {items.map((item, index) => (
        <li key={index} className={`list-group-item ${index % 2 === 0 ? "list-group-item-dark" : ""}`}>
          {item}
        </li>
      ))}
    </ul>
  </section>
);

const SierraHuetorRestrictions = ({ selectedMethod }) => {
  const methodKey =
    selectedMethod === "1" ? "motor" : selectedMethod === "2" ? "bike" : selectedMethod === "3" ? "hike" : "all";

  const methodNames = {
    motor: "Vehículo a motor.",
    bike: "Bicicleta.",
    hike: "Senderismo.",
    all: "Todas las restricciones (vehículos a motor, ciclismo y senderismo)"
  };

  const combinedRules = methodKey === "all"
    ? Array.from(new Set([
      ...rulesByMethod.motor,
      ...rulesByMethod.bike,
      ...rulesByMethod.hike,
      ...additionalRules
    ]))
    : rulesByMethod[methodKey] || [];

  return (
    <div className="container shadow p-3">
      <div className='card-container'>
        <h3 className="mb-4">Restricciones del Parque Natural Sierra de Huétor.</h3>
        <h4>Método seleccionado: {methodNames[methodKey]}</h4>
        {methodKey === "all" && (
          <Sections title="Normas Generales" items={generalRules} />
        )}
        <Sections title="Prohibiciones en el parque natural." items={combinedRules} />
      </div>
    </div>
  );
};

export default SierraHuetorRestrictions;
