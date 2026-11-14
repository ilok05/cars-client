import { Link } from "react-router";
import type { Car } from "../models/Car";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

type CarCardProps = {
    car: Car;
    onDelete: (id: string) => void;
};



export default function CarCard({ car, onDelete }: CarCardProps) {

    const user = useAuthStore((state) => state.user);
    const isAdmin = user?.roles.includes("Admin") ?? false;

    const favoriteCarIdsByUser = useCarUiStore(
        (state) =>
            state.favoriteCarIdsByUser,
    );

    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];

    const isFavorite = favoriteCarIds.includes(
        car.id,
    );

    const toggleFavorite = useCarUiStore(
        (state) =>
            state.toggleFavorite,
    );
    return (
        <article className="car-card">
            <h2>
                {car.brand} {car.model}
            </h2>

            <Link to={`/cars/${car.id}`}>Szczegóły</Link>
            <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>

            <button
                type="button"
                className={
                    isFavorite ? 'favorite-button active-favorite' : 'favorite-button'
                }
                onClick={() => { if (user) { toggleFavorite(user.id, car.id); } }}
            >
                {
                    isFavorite ? 'Ulubiony' : 'Ulubione'
                }
            </button>


            {isAdmin && (
                <button
                    type="button"
                    onClick={() => onDelete(car.id)}
                >
                    Usuń
                </button>
            )}
        </article>
    );
}