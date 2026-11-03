import { useAuth0 } from "@auth0/auth0-react";

const Logger = () => {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (isLoading) {
    return <span className="spinner h-4 w-4 text-pine-400" role="status" aria-label="Cargando sesión" />;
  }

  return isAuthenticated ? (
    <div className="flex items-center gap-3">
      <img src={user.picture} alt="" className="h-8 w-8 rounded-full ring-2 ring-white" referrerPolicy="no-referrer" />
      <span className="max-w-[10rem] truncate text-sm font-medium text-pine-900">{user.name}</span>
      <button
        className="btn-ghost btn-sm"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Salir
      </button>
    </div>
  ) : (
    <button className="btn-primary btn-sm" onClick={() => loginWithRedirect()}>
      Iniciar sesión
    </button>
  );
};

export default Logger;
