import React from 'react';

const link = "font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950";

const AboutUsComponent = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
      <p className="eyebrow">Sobre nosotros</p>
      <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Sobre ParkTracker</h1>

      <div className="mt-10 space-y-5">
        <section className="card p-6 sm:p-8">
          <p className="leading-relaxed text-pine-900/75">
            <strong className="font-semibold text-pine-950">ParkTracker</strong> es una iniciativa desarrollada como parte de un Trabajo de Fin de Grado en el grado Ingeniería Informática, con el objetivo de promover un uso responsable de los espacios naturales.
          </p>
          <p className="mt-4 leading-relaxed text-pine-900/75">
            Este proyecto surge de la pasión por la naturaleza y la tecnología. Con ParkTracker buscamos facilitar a los usuarios la planificación de rutas respetuosas con el medioambiente, basándonos en la normativa de los planes: <strong className="font-semibold text-pine-950">Plan de Ordenación de los Recursos Naturales (PORN)</strong> y los <strong className="font-semibold text-pine-950">Plan Rectores de Uso y Gestión (PRUG)</strong>.
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-medium">¿Quién está detrás?</h2>
            <p className="mt-3 leading-relaxed text-pine-900/75">
              Soy Alberto, estudiante de último curso de Ingeniería Informática en Universidad de Granada. Este portal web es el resultado de meses de desarrollo y aprendizaje, con el objetivo de unir la tecnología, la sostenibilidad y la utilidad pública.
            </p>
          </section>

          <section className="card p-6 sm:p-8">
            <h2 className="text-2xl font-medium">Créditos y tecnologías utilizadas</h2>
            <p className="mt-3 leading-relaxed text-pine-900/75">
              Este proyecto ha sido posible gracias al uso de tecnologías como <strong className="font-semibold text-pine-950">React, Astro, Tailwind, Leaflet, OpenStreetMap</strong> y <strong className="font-semibold text-pine-950">OSRM</strong>. Agradezco especialmente la documentación pública de los planes de uso y gestión proporcionados por la Junta de Andalucía.
            </p>
          </section>
        </div>

        <section className="rounded-3xl bg-pine-100/60 p-6 sm:p-8">
          <h2 className="text-2xl font-medium">Contacto</h2>
          <p className="mt-3 leading-relaxed text-pine-900/75">
            ¿Tienes alguna duda o sugerencia? Escríbeme a <a href="mailto:parktracker.contact@gmail.com" className={link}>parktracker.contact@gmail.com</a> o visita el <a href="https://github.com/albertocmr/ParkTracker" target="_blank" rel="noopener noreferrer" className={link}>repositorio en GitHub</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsComponent;
