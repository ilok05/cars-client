import { Link, useParams, useNavigate } from 'react-router';
import type { NewCar } from '../models/Car';
import { getCarById, updateCar } from "../services/carService";
import { useEffect, useState,  type ChangeEvent, type SubmitEvent } from "react";
import axios from 'axios';

interface CarFormData{
    brand: string;
    model: string;
    doorsNumber: number | null;
    luggageCapacity: number | null;
    engineCapacity: number | null;
    fuelType: number | null;
    productionDate: string;
    averageFuelConsumption: number | null;
    bodyType: number | null;
}

const initialFormData: CarFormData = {
    brand: "",
    model: "",
    doorsNumber: null,
    luggageCapacity: null,
    engineCapacity: null,
    fuelType: null,
    productionDate: "",
    averageFuelConsumption: null,
    bodyType: null,

};

export default function EditCarPage(){
    const {id} = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CarFormData>(initialFormData)
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(()=>{
        const controller = new AbortController();

        async function loadCar() {
            if (!id) {
                setError("Nieprawidłowe ID samochodu.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const car = await getCarById(
                    id,
                    controller.signal
                );

                setFormData({
                    brand: car.brand,
                    model: car.model,
                    doorsNumber: car.doorsNumber,
                    luggageCapacity: car.luggageCapacity,
                    engineCapacity: car.engineCapacity,
                    fuelType: car.fuelType,
                    // Pole date wymaga formatu YYYY-MM-DD
                    productionDate: car.productionDate.slice(0, 10),
                    averageFuelConsumption: car.averageFuelConsumption,
                    bodyType: car.bodyType,
                });
            } catch (caughtError) {
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
        loadCar();
        return () => controller.abort();
    },[id]);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value, type } = event.target;

        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]:
                type === "number"
                    ? value === "" ? null : Number(value)
                    : value,
        }));
    }

    // Wysłanie zmienionych danych do API
    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!id) {
            setError("Nieprawidłowe ID samochodu.");
            return;
        }

        if (
            formData.doorsNumber === null ||
            formData.luggageCapacity === null ||
            formData.engineCapacity === null ||
            formData.fuelType === null ||
            formData.averageFuelConsumption === null ||
            formData.bodyType === null
        ) {
            setError("Uzupełnij wszystkie pola liczbowe.");
            return;
        }

        const car: NewCar = {
            brand: formData.brand.trim(),
            model: formData.model.trim(),
            doorsNumber: formData.doorsNumber,
            luggageCapacity: formData.luggageCapacity,
            engineCapacity: formData.engineCapacity,
            fuelType: formData.fuelType,
            productionDate: formData.productionDate,
            averageFuelConsumption: formData.averageFuelConsumption,
            bodyType: formData.bodyType,
        };

        try {
            setIsSaving(true);
            setError(null);

            await updateCar(id, car);

            // Przejście do szczegółów zaktualizowanego samochodu
            navigate(`/cars/${id}`);
        } catch (caughtError) {
            if (caughtError instanceof Error) {
                setError(caughtError.message);
            } else {
                setError("Nie udało się zaktualizować samochodu.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <p>Ładowanie danych samochodu...</p>;
    }

    if (error && !formData.brand && !formData.model) {
        return (
            <section>
                <p>{error}</p>
                <Link to="/cars">Powrót do listy samochodów</Link>
            </section>
        );
    }
    return (
        <form className="car-form" onSubmit={handleSubmit}>
            <h2>Edytuj samochód</h2>

            {error && <p className="error">{error}</p>}

            <div className="form-group">
                <label>
                    Marka
                    <input 
                        name="brand"
                        type="text"
                        value={formData.brand}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Model
                    <input
                        name="model"
                        type="text"
                        value={formData.model}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Lizcba drzwi
                    <input
                        name="doorsNumber"
                        type="number"
                        value={formData.doorsNumber ?? ""}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Ładowność
                    <input
                        name="luggageCapacity"
                        type="number"
                        value={formData.luggageCapacity ?? ""}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Pojemnosc silnika
                    <input
                        name="engineCapacity"
                        type="number"
                        value={formData.engineCapacity ?? ""}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Typ paliwa
                    <input
                        name="fuelType"
                        type="number"
                        value={formData.fuelType ?? ""}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Data Produkcji
                    <input
                    name="productionDate"
                    type="date"
                    value={formData.productionDate}
                    onChange={handleChange}
                    required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Spalanie paliwa
                    <input
                    name="averageFuelConsumption"
                    type="number"
                    value={formData.averageFuelConsumption ?? ""}
                    onChange={handleChange}
                    required
                    />
                </label>
            </div>
            <div className="form-group">
                <label>
                    Typ nadwozia
                    <input
                    name="bodyType"
                    type="number"
                    value={formData.bodyType ?? ""}
                    onChange={handleChange}
                    required
                    />
                </label>
            </div>

            <button type="submit" disabled={isSaving}>
                {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>

            <Link to={`/cars/${id}`}>Anuluj</Link>
        </form>
    );
}