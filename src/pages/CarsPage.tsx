import type { Car } from "../models/Car";
import { getCars } from "../services/carService";
import { deleteCar } from "../services/carService";
import { useEffect, useState } from "react";
import axios from 'axios';
import CarCard from "../components/CarCard";
import { useCarUiStore } from "../store/useCarUiStore";
import { useAuthStore } from "../store/useAuthStore";

export default function CarsPage(){
    const user = useAuthStore((state) => state.user);
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // czy jest błąd

    const searchTerm = useCarUiStore((state) => state.searchTerm);
    const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
    const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
    const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
    const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
    const favoriteCarIds = user ? favoriteCarIdsByUser[user.id] ?? [] : [];

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const visibleCars = cars.filter((car) => {
        const matchesSearch = car.brand.toLowerCase().includes(normalizedSearch) || car.model.toLowerCase().includes(normalizedSearch);
        const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);
        return(
            matchesSearch && matchesFavorite
        );
    });

    const removeFavorite =
        useCarUiStore(
            (state) =>
                state.removeFavorite,
        );

    async function handleDeleteCar(id: string) {
        const usun = window.confirm(
            "Czy na pewno chcesz usunąć ten samochód?"
        );

        if (!usun) return;

        try {
            await deleteCar(id);

            if(user){
                removeFavorite(user.id, id);
            }
            setCars(
                (currentCars) => 
                    currentCars.filter(
                        (car) =>
                            car.id !== id,
                    ),
            );

            const updatedCars = await getCars();
            setCars(updatedCars);

        } catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            } else {
                setError("Nie udało się usunąć samochodu.");
            }
        }
    }

    useEffect(()=>{
        const controller = new AbortController();

        async function loadCars(){
            try{
                setIsLoading(true);
                setError(null);
                const loadedCars = await getCars(controller.signal);
                setCars(loadedCars);   
            } catch (caughtError){
                if(axios.isCancel(caughtError)){
                    return;
                }

                if (caughtError instanceof Error) {
                    setError(caughtError.message);
                } else {
                    setError("Wystąpił nieznany błąd.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        loadCars();

        return () => {
            controller.abort();
        };
    },[]);
    
    if(isLoading){
        return<p>Ładowanie...</p>
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (cars.length === 0) {
        return <p>Nie znaleziono samochodów.</p>;
    }
    return(
        <section className="cars-grid">

            <div className="cars-toolbar">
                <input 
                    type = "search" 
                    placeholder="Szukaj po marce lub modelu..."
                    value={searchTerm}
                    onChange={(event) => 
                        setSearchTerm(
                            event.target.value,
                       )
                    }
                />
                <label className="favorite-filter">
                    <input
                        type="checkbox"
                        checked={
                            showFavoritesOnly
                        }
                        onChange={(event) => 
                            setShowFavoritesOnly(
                                event.target.checked,
                            )
                        }
                    />
                    Tylko ulubione
                </label>
            </div>
            {visibleCars.map((car) => (
                <CarCard
                    key={car.id}
                    car={car}
                    onDelete={handleDeleteCar}
                />
            ))}

        </section>

        
            
    );
}

    