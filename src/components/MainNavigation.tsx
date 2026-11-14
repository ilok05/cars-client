import { NavLink, useNavigate } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

export function MainNavigation() {
  const navigate = useNavigate();

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const logout =
    useAuthStore(
      (state) => state.logout,
    );

  const favoriteCount =
    useCarUiStore(
      (state) =>
        user ? (
          state.favoriteCarIdsByUser[
            user.id
          ] ?? []
        ).length : 0,
    );

  function handleLogout() {
    logout();
    navigate('/login');
  }


  return (
    <nav className="navigation">
      <NavLink
        to="/"
        end
        /* className dynamicznie ustala klasę CSS na podstawie stanu linku */
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Strona główna
      </NavLink>

      {user && (
        <>
          <NavLink
            to="/cars"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Samochody
          </NavLink>

          <NavLink
            to="/cars/new"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Dodaj Samochod
          </NavLink>
        </>
      )}
      <NavLink
        to="/about"
        end
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        O Aplikacji
      </NavLink>

      {user ? (
        <>
          <span className="favorite-counter">
            Ulubione: {favoriteCount}
          </span>

          <span className="user-info">
            {user.userName}
            {' ('}
            {user.roles.join(', ')}
            {')'}
          </span>

          <button
            type="button"
            className="nav-button"
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}>
            Logowanie
          </NavLink>
          <NavLink
            to="/register"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}>
            Rejestracja
          </NavLink>
        </>
      )}
    </nav>
  );
}
