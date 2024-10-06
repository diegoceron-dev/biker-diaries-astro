import { useToast } from "@/components/ui/toast";
import { ref, computed } from "vue";

export const useSteppers = () => {
  const { toast } = useToast();
  const loading = ref(false);
  const currentStepCreateEvent = ref(1);

  // Define metodo para actualizar el estado del stepper
  const setCurrentStepCreateEvent = (value: number) => {
    currentStepCreateEvent.value = value;
  };

  // Define metodo para obtener el estado del stepper
  const getCurrentStepCreateEvent = () => {
    return currentStepCreateEvent.value;
  };

  return {
    currentStepCreateEvent,
    loading,
  };
};
