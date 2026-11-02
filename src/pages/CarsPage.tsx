import { Link } from 'react-router';
import type { Car } from "../models/Car";
import { getCars } from "../services/carService";
import { deleteCar } from "../services/carService";
import { useEffect, useState } from "react";


export default function CarsPage(){
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // czy jest błąd


    async function handleDeleteCar(id: string) {
    const usun = window.confirm(
        "Czy na pewno chcesz usunąć ten samochód?"
    );

    if (!usun) return;

    try {
        await deleteCar(id);

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
                if(
                    caughtError instanceof DOMException &&
                    caughtError.name === "AbortError"
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
            {cars.map((car)=>(
                <article>
                    <h2>
                        {car.brand} {car.model}
                    </h2>
                    <Link to={`/cars/${car.id}`}>Szczegóły</Link>
                    <Link to={`/cars/${car.id}/edit`}>Edytuj</Link>
                    <button type="button" onClick={() => {
                        handleDeleteCar(car.id);
                        }}>
                            Usuń
                        </button>
                </article>
            ))}
        </section>
            
    );
}

    