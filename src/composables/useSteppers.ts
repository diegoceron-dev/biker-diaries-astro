import { useToast } from "@/components/ui/toast";
import { currentStepStore, loadingStore, setCurrentStep, setLoading } from "@/store/stepperStore";
import { computed } from "vue";
import { useStore } from '@nanostores/vue';

export const useSteppers = () => {
  const { toast } = useToast();

  // Usa el store de nanostores para acceder al estado reactivo
  const currentStepCreateEvent = useStore(currentStepStore);
  const loading = useStore(loadingStore);

  // Define un método para actualizar el estado del stepper
  const setCurrentStepCreateEvent = (value: number) => {
    setCurrentStep(value);
    toast({ description: `Step changed to ${value}` });
  };

  // Define un método para actualizar el estado de carga
  const setLoadingState = (value: boolean) => {
    setLoading(value);
  };

  return {
    currentStepCreateEvent,
    loading,
    setCurrentStepCreateEvent,
    setLoadingState,
  };
};
