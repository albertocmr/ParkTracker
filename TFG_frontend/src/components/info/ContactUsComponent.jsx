import React, { useState } from 'react';

const link = "font-medium text-pine-700 underline decoration-pine-300 underline-offset-4 hover:text-pine-950";

const ContactUsComponent = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = form;
    const subject = encodeURIComponent(`Mensaje de ${name} (${email})`);
    const mailtoLink = `mailto:parktracker.contact@gmail.com?subject=${subject}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
      <p className="eyebrow">Contacto</p>
      <h1 className="mt-3 text-4xl font-medium sm:text-5xl">Contáctanos</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-pine-900/70">
        ¿Tienes preguntas, sugerencias o quieres colaborar? Puedes enviarnos un mensaje directamente usando el siguiente formulario.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="label">Nombre</label>
              <input id="contact-name" type="text" name="name" required value={form.name} onChange={handleChange} className="input" />
            </div>
            <div>
              <label htmlFor="contact-email" className="label">Correo electrónico</label>
              <input id="contact-email" type="email" name="email" required value={form.email} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label htmlFor="contact-message" className="label">Mensaje</label>
            <textarea id="contact-message" name="message" required rows="6" value={form.message} onChange={handleChange} className="input resize-y" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Enviar mensaje</button>
          </div>
        </form>

        <aside className="h-fit rounded-3xl bg-pine-100/60 p-6 sm:p-8">
          <h2 className="text-xl font-medium">También puedes contactarme por:</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-pine-900/55">Correo directo</dt>
              <dd className="mt-1"><a href="mailto:parktracker.contact@gmail.com" className={link}>parktracker.contact@gmail.com</a></dd>
            </div>
            <div>
              <dt className="text-pine-900/55">Repositorio del proyecto</dt>
              <dd className="mt-1"><a href="https://github.com/albertocmr/ParkTracker" target="_blank" rel="noopener noreferrer" className={link}>GitHub</a></dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
};

export default ContactUsComponent;
