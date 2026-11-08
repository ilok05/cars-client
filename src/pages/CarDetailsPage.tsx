import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from "../services/carService";
import { useEffect, useState } from "react";
import { useCarUiStore } from '../store/useCarUiStore';
import axios from 'axios';

export default function CarDetailsPage(){
    const { id } = useParams();
    const carId = String(id);
    const [car, setCar] = useState<Car | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // czy jest błąd

    const favoriteCarIds = 
        useCarUiStore(
            (state) =>
                state.favoriteCarIds,
        );
    const toggleFavorite = 
        useCarUiStore(
            (state) =>
                state.toggleFavorite,
        );
    const isFavorite = 
        favoriteCarIds.includes(
            carId
        );

    useEffect(()=>{
        if (!id) {
            setError("Nieprawidłowe ID samochodu.");
            setIsLoading(false);
            return;
        }
        
        const controller = new AbortController();

        async function loadCars(){
            try{
                setIsLoading(true);
                setError(null);
                const loadedCars = await getCarById(carId);
                setCar(loadedCars);
                
            } catch (caughtError){
                if (axios.isCancel(caughtError)) {
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
    },[id]);
    
    if(isLoading){
        return<p>Ładowanie...</p>
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    if (!car) {
        return(
            <section>
               <h1>Nie znaleziono samochodu</h1>
               <Link to="/cars">Wróć do listy</Link>
            </section>
        );
    }
    return(
        <section>
            <div  className='car-details'>
                <h1>
                {car.brand} {car.model}
                </h1>
                <p>Liczba drzwi:<label>{car.doorsNumber}</label></p>
                <p>Ładowność: <label>{car.luggageCapacity}</label></p>
                <p>Pojemność silnika: <label>{car.engineCapacity}</label></p>
                <p>Rodzaj paliwa: <label>{car.fuelType}</label></p>
                <p>Data produkcji: <label>{car.productionDate}</label></p>
                <p>Średnie spalnie paliwa: <label>{car.averageFuelConsumption}</label></p>
                <p>Typ nadwozia: <label>{car.bodyType}</label></p>
            
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
            </div>
        </section>
            
    );
}





