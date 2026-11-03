import React from 'react';

const PrivacyPolicyComponent = () => {
    return (
        <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
            <p className="eyebrow">Legal</p>
            <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Política de Privacidad</h1>

            <section className="card mt-10 space-y-6 p-6 leading-relaxed text-pine-900/75 sm:p-10">
                <p>
                    En <strong>ParkTracker</strong>, respetamos tu privacidad y nos comprometemos a proteger tus datos personales.
                    Esta política explica qué información recopilamos, cómo la usamos y cuáles son tus derechos.
                </p>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">1. Responsable del tratamiento</h2>
                    <p>
                        El responsable del tratamiento de tus datos es usuario creador y desarrollador del proyecto ParkTracker.
                        Puedes contactar a través de correo electrónico: <a href="mailto:parktracker.contact@gmail.com" className="font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950">parktracker.contact@gmail.com</a>.
                    </p>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">2. Datos que recopilamos</h2>
                    <ul className="ml-5 list-disc space-y-1.5 marker:text-pine-400">
                        <li>Nombre y correo electrónico al registrarte con Auth0.</li>
                        <li>Datos técnicos como IP, navegador y tipo de dispositivo (anónimos, con fines analíticos).</li>
                    </ul>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">3. ¿Cómo usamos tus datos?</h2>
                    <ul className="ml-5 list-disc space-y-1.5 marker:text-pine-400">
                        <li>Autenticación y control de acceso a funciones avanzadas.</li>
                        <li>Evaluación de rutas frente a zonas protegidas.</li>
                        <li>Mejorar la experiencia de usuario y el rendimiento de la plataforma.</li>
                    </ul>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">4. Servicios de terceros</h2>
                    <p>Utilizamos herramientas de terceros para ofrecer funcionalidad y seguridad:</p>
                    <ul className="ml-5 list-disc space-y-1.5 marker:text-pine-400">
                        <li><strong>Auth0:</strong> Autenticación segura.</li>
                        <li><strong>Vercel (si aplica):</strong> Despliegue y alojamiento.</li>
                        <li><strong>Leaflet + OpenStreetMap:</strong> Visualización geoespacial.</li>
                    </ul>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">5. Conservación de datos</h2>
                    <p>
                        Tus datos se conservarán el tiempo necesario para los fines descritos, o según lo exija la ley vigente.
                    </p>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">6. Tus derechos</h2>
                    <p>Como usuario, tienes derecho a:</p>
                    <ul className="ml-5 list-disc space-y-1.5 marker:text-pine-400">
                        <li>Acceder a tus datos personales.</li>
                        <li>Rectificar o eliminar tus datos.</li>
                        <li>Retirar tu consentimiento en cualquier momento.</li>
                    </ul>
                    <p className="mt-2">Para ejercerlos, ponte en contacto con la siguiente dirección de correo: <a href="mailto:parktracker.contact@gmail.com" className="font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950">parktracker.contact@gmail.com</a>.</p>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">7. Seguridad y acceso restringido</h2>
                    <p>
                        El inicio de sesión mediante Auth0 es obligatorio para acceder a las funcionalidades avanzadas (como el análisis de rutas) con el fin de:
                    </p>
                    <ul className="ml-5 list-disc space-y-1.5 marker:text-pine-400">
                        <li>Prevenir el uso indebido de la plataforma por bots o usuarios malintencionados.</li>
                        <li>Garantizar la integridad de los datos y el correcto funcionamiento del sistema.</li>
                        <li>Ofrecer una experiencia personalizada y segura.</li>
                    </ul>
                </div>

                <div className="border-t border-pine-900/5 pt-6">
                    <h2 className="mb-3 text-xl font-medium sm:text-2xl">8. Cambios en esta política</h2>
                    <p>
                        Esta política puede verse sujeta a cambios de manera ocasional. Cualquier cambio se publicará en esta página y, en caso de que sea relevante, será notificado por correo.
                    </p>
                    <p className="mt-3 text-sm text-pine-900/45">Última actualización: mayo de 2025</p>
                </div>
            </section>
        </div>
    );
};

export default PrivacyPolicyComponent;
