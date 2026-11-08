import { Link } from "react-router";
import type { Car } from "../models/Car";
import { useCarUiStore } from "../store/useCarUiStore";

type CarCardProps = {
    car: Car;
    onDelete: (id: string) => void;
};



export default function CarCard({ car, onDelete }: CarCardProps) {
    const isFavorite = useCarUiStore(
    (state) =>
        state.favoriteCarIds.includes(
            car.id,
        ),
    );

    const toggleFavorite = useCarUiStore(
        (state)  => 
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
                onClick={() => toggleFavorite(car.id)}
            >
                {
                    isFavorite ? 'Ulubiony':'Ulubione'
                }
            </button>

            <button
                type="button"
                onClick={() => onDelete(car.id)}
            >
                Usuń
            </button>
        </article>
    );
}