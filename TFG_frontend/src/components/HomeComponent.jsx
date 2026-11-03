import React from 'react';

const STEPS = [
    { title: "Elige cómo harás la ruta", text: "Vehículo a motor, bicicleta o a pie: la normativa cambia según el medio." },
    { title: "Carga tu archivo GPX", text: "La ruta se dibuja al momento sobre el mapa, junto a los perímetros de los parques." },
    { title: "Inicia sesión y analízala", text: "Cruzamos tu recorrido con los 23 parques naturales de Andalucía." },
    { title: "Consulta las restricciones", text: "Verás qué parques atraviesas, qué tramos quedan dentro y qué normas aplican." },
];

const STATS = [
    { value: "23", label: "parques naturales" },
    { value: "8", label: "zonas de reserva A" },
    { value: "8", label: "provincias andaluzas" },
];

const TECH = ["Astro", "React", "Tailwind CSS", "Leaflet", "OpenStreetMap", "Spring Boot", "GeoPandas", "MySQL", "Auth0"];

const HomeComponent = () => {
    return (
        <>
            {/* Hero */}
            <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:pt-10">
                <div className="relative isolate overflow-hidden rounded-[2rem] bg-pine-950">
                    <img
                        src="/SierraHuetor_Otonio_Pilarflores.jpg"
                        alt="Paisaje del Parque Natural Sierra de Huétor en otoño, fotografía de Pilar Flores"
                        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-pine-950 via-pine-950/80 to-pine-950/10" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-pine-950/70 via-transparent to-transparent" />

                    <div className="max-w-2xl px-6 py-20 sm:px-12 md:py-28 lg:py-32">
                        <p className="eyebrow animate-fade-up text-pine-200">Parques naturales de Andalucía</p>
                        <h1 className="mt-4 animate-fade-up font-display text-4xl font-medium leading-[1.08] text-paper-50 [animation-delay:80ms] sm:text-5xl lg:text-6xl">
                            Recorre la naturaleza <em className="font-normal text-pine-200">sabiendo dónde pisas</em>.
                        </h1>
                        <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-pine-50/80 [animation-delay:160ms] sm:text-lg">
                            Sube tu ruta GPX y descubre en segundos si atraviesa algún espacio protegido y qué normativa
                            debes respetar en cada tramo.
                        </p>
                        <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:240ms]">
                            <a href="/map" className="btn bg-paper-50 text-pine-950 shadow-lift hover:bg-white">
                                Comprueba tu ruta
                                <span aria-hidden="true">→</span>
                            </a>
                            <a href="/naturalParks" className="btn border border-white/20 text-paper-50 hover:bg-white/10">
                                Explorar parques
                            </a>
                        </div>
                    </div>

                    <p className="absolute bottom-4 right-6 hidden text-[11px] text-white/50 sm:block">
                        Sierra de Huétor en otoño · Foto: Pilar Flores
                    </p>
                </div>

                {/* Cifras */}
                <dl className="mx-auto -mt-10 grid max-w-3xl grid-cols-3 divide-x divide-pine-900/5 rounded-3xl border border-pine-900/5 bg-white/90 shadow-lift backdrop-blur sm:-mt-12">
                    {STATS.map(({ value, label }) => (
                        <div key={label} className="px-3 py-5 text-center sm:py-6">
                            <dt className="sr-only">{label}</dt>
                            <dd className="font-display text-3xl text-pine-900 sm:text-4xl">{value}</dd>
                            <dd className="mt-1 text-xs text-pine-900/60 sm:text-sm">{label}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            {/* Cómo funciona */}
            <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
                <div className="max-w-2xl">
                    <p className="eyebrow">Cómo funciona</p>
                    <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Cuatro pasos para planificar con responsabilidad</h2>
                    <p className="mt-4 leading-relaxed text-pine-900/70">
                        Como usuario no registrado puedes visualizar tus rutas en el mapa. Para analizarlas y detectar
                        intersecciones con los parques naturales, inicia sesión.
                    </p>
                </div>

                <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map(({ title, text }, i) => (
                        <li key={title} className="card group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                            <span className="font-display text-sm text-pine-400">0{i + 1}</span>
                            <h3 className="mt-6 font-sans text-base font-semibold text-pine-950">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-pine-900/65">{text}</p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Por qué */}
            <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
                <div className="grid items-center gap-10 rounded-[2rem] bg-pine-100/60 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <p className="eyebrow">Por qué ParkTracker</p>
                        <h2 className="mt-3 text-3xl font-medium sm:text-4xl">La normativa, en un solo lugar</h2>
                    </div>
                    <div className="space-y-4 leading-relaxed text-pine-900/75">
                        <p>
                            Centralizamos la normativa sobre <strong className="font-semibold text-pine-950">uso público, turismo activo,
                            ecoturismo y educación ambiental</strong> de cada parque natural andaluz.
                        </p>
                        <p>
                            Toda la información procede del <em>Plan de Ordenación de los Recursos Naturales</em> (PORN) y del
                            <em> Plan Rector de Uso y Gestión</em> (PRUG) de cada espacio. Así evitas sanciones y contribuyes a su conservación.
                        </p>
                    </div>
                </div>
            </section>

            {/* Sobre el proyecto */}
            <section className="mx-auto max-w-6xl px-4 pt-24 sm:px-6">
                <div className="grid gap-5 lg:grid-cols-3">
                    <div className="card p-8 lg:col-span-2">
                        <p className="eyebrow">Sobre el proyecto</p>
                        <h2 className="mt-3 text-2xl font-medium sm:text-3xl">Un Trabajo Fin de Grado de la Universidad de Granada</h2>
                        <p className="mt-4 leading-relaxed text-pine-900/70">
                            Desarrollado por Alberto Cámara a partir de lo aprendido en el Grado en Ingeniería Informática y del
                            estudio continuo de nuevas tecnologías. Las rutas se pueden crear con <strong className="font-semibold text-pine-950">OSRM</strong>,
                            una herramienta de código abierto, y el seguimiento del proyecto se ha hecho en GitHub.
                        </p>
                        <a href="mailto:parktracker.contact@gmail.com" className="btn-secondary mt-6">
                            parktracker.contact@gmail.com
                        </a>
                    </div>
                    <div className="card p-8">
                        <p className="eyebrow">Tecnologías</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {TECH.map((t) => (
                                <li key={t} className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-pine-800">{t}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomeComponent;
