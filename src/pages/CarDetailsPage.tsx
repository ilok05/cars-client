import { Link, useParams } from 'react-router';
import type { Car } from '../models/Car';
import { getCarById } from "../services/carService";
import { useEffect, useState } from "react";


export default function CarDetailsPage(){
    const { id } = useParams();
    const carId = String(id);
    const [cars, setCars] = useState<Car | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // czy jest błąd

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
                setCars(loadedCars);   
            } catch (caughtError){
                if(
                    caughtError instanceof DOMException &&
                    caughtError.name === "AbrtError"
                ){
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

    if (!cars) {
        return(
            <section>
               <h1>Nie znaleziono samochodu</h1>
               <Link to="/cars">Wróć do listy</Link>
            </section>
        );
    }
    return(
        <section>
            <h1>
                {cars.brand} {cars.model}
            </h1>
            <p>Liczba drzwi: {cars.doorsNumber}</p>
            <p>Ładowność: {cars.luggageCapacity}</p>
            <p>Pojemność silnika: {cars.engineCapacity}</p>
            <p>Rodzaj paliwa: {cars.fuelType}</p>
            <p>Data produkcji: {cars.productionDate}</p>
            <p>Średnie spalnie paliwa: {cars.averageFuelConsumption}</p>
            <p>Typ nadwozia: {cars.bodyType}</p>
            <Link to={`/cars/${cars.id}/edit`}>Edytuj</Link>
            
        </section>
            
    );
}





