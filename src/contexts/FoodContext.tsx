import { createContext, ReactNode, useEffect, useState } from "react";
import api from "services/api";

export interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  available: boolean;
  image: string;
}

interface FoodProviderProps {
  children: ReactNode;
}

interface FoodContextData {
  foods: FoodProps[];
  handleAddFood(food: FoodProps): void;
  handleDeleteFood(id: number): void;
  handleUpdateFoods(foods: FoodProps[]): void;
}

export const FoodContext = createContext({} as FoodContextData);

export function FoodProvider({ children }: FoodProviderProps) {
  const [foods, setFoods] = useState<FoodProps[]>([]);

  async function handleGetFood() {
    const response = await api.get("/foods");
    setFoods(response.data);
  }

  useEffect(() => {
    handleGetFood();
  }, []);

  function handleUpdateFoods(foods: FoodProps[]) {
    setFoods(foods);
  }

  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  return (
    <FoodContext.Provider
      value={{ foods, handleAddFood, handleDeleteFood, handleUpdateFoods }}
    >
      {children}
    </FoodContext.Provider>
  );
}
