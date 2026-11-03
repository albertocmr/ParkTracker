import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Logger from "./Logger.jsx";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/createTrack", label: "Crea tu ruta" },
  { href: "/map", label: "Comprueba tu ruta" },
  { href: "/naturalParks", label: "Parques naturales" },
];

const isActive = (href, currentPath = "") =>
  href === "/" ? currentPath === "/" : currentPath.startsWith(href);

const NavLinks = ({ currentPath }) => {
  const { isAuthenticated, user } = useAuth0();
  const [open, setOpen] = useState(false);

  const roles = user?.["https://parktracker.local/roles"] || [];
  const isAuthorized = isAuthenticated && roles.includes("ADMIN");

  const links = isAuthorized ? [...LINKS, { href: "/managementdb", label: "Gestión" }] : LINKS;

  const linkClass = (href) =>
    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive(href, currentPath)
        ? "bg-pine-800 text-paper-50"
        : "text-pine-900/70 hover:bg-pine-800/5 hover:text-pine-950"
    }`;

  return (
    <>
      {/* Escritorio */}
      <nav className="hidden flex-1 items-center justify-between md:flex">
        <ul className="mx-auto flex items-center gap-1">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a href={href} className={linkClass(href)} aria-current={isActive(href, currentPath) ? "page" : undefined}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <Logger />
      </nav>

      {/* Móvil */}
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-pine-900 hover:bg-pine-800/5 md:hidden"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-pine-900/5 bg-paper px-4 pb-5 pt-2 shadow-lift md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className={`block ${linkClass(href)}`}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-pine-900/5 pt-4">
            <Logger />
          </div>
        </div>
      )}
    </>
  );
};

export default NavLinks;
