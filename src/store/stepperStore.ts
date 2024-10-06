import { atom } from 'nanostores';

// Define un estado global para el stepper
export const currentStepStore = atom<number>(1);

// Puedes agregar más propiedades si es necesario
export const loadingStore = atom<boolean>(false);

// Funciones para modificar el estado
export const setCurrentStep = (step: number) => {
  currentStepStore.set(step);
};

export const setLoading = (isLoading: boolean) => {
  loadingStore.set(isLoading);
};
