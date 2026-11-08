import { NavLink } from "react-router";
import { useCarUiStore } from "../store/useCarUiStore";

export function MainNavigation() {
  const favoriteCount =
    useCarUiStore(
      (state) =>
        state.favoriteCarIds.length,
    );
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

      <span className="favorite-counter">
        Ulubione: {favoriteCount}
      </span>
    </nav>
  );
}
