import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useNavigate } from "react-router";
import type { NewCar } from '../models/Car';
import { createCar } from "../services/carService";


interface CarFormData {
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

export default function CreateCarPage() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState<CarFormData>(initialFormData);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = event.target;

    setFormData((currentFromData) => ({
      ...currentFromData,
      [name]:
        type === "number"
          ? value === "" ? null : Number(value)
          : value,
    }));
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

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

    const newCar: NewCar = {
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      doorsNumber: Number(formData.doorsNumber),
      luggageCapacity: Number(formData.luggageCapacity),
      engineCapacity: Number(formData.engineCapacity),
      fuelType: Number(formData.fuelType),
      productionDate: formData.productionDate,
      averageFuelConsumption: Number(formData.averageFuelConsumption),
      bodyType: Number(formData.bodyType)
    };
    try {
      setIsLoading(true);
      setError(null);

      createCar(newCar);

      setFormData(initialFormData);

      navigate("/cars");

    } catch (caughtError) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Nie udało się dodać samochodu.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="car-form" onSubmit={handleSubmit}>
      <h2>Dodaj samochod</h2>


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
          <select
            name="fuelType"
            value={formData.fuelType ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">Wybierz typ paliwa</option>
            <option value={0}>Petrol</option>
            <option value={1}>Diesel</option>
            <option value={2}>Hybrid</option>
            <option value={3}>Electric</option>
            <option value={4}>LSG</option>
          </select>
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
          <select
            name="bodyType"
            value={formData.bodyType ?? ""}
            onChange={handleChange}
            required
          >
            <option value="">Wybierz typ paliwa</option>
            <option value={0}>Hatchback</option>
            <option value={1}>Sedan</option>
            <option value={2}>Kombi</option>
            <option value={3}>SUV</option>
            <option value={4}>Roadster</option>
          </select>
        </label>
      </div>


      {/* type="submit" informuje przeglądarkę, że przycisk służy do zatwierdzania 
      formularza. */}
      <button type="submit">Dodaj samochod</button>
    </form>
  );
}