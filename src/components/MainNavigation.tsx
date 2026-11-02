import { NavLink } from "react-router";

export function MainNavigation() {
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
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Samochody
      </NavLink>

      <NavLink
        to="/cars/new"
        className={({ isActive }) => (isActive ? "active" : undefined)}
      >
        Dodaj Samochod
      </NavLink>
    </nav>
  );
}
