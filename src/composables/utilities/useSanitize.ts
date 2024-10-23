import { useToast } from "@/components/ui/toast";

export const useSanitize = () => {
  const { toast } = useToast();

  const sanitizeHtml = (htmlString: string) => {
    // Crear un nuevo DOMParser
    const parser = new DOMParser();

    // Parsear el HTML como un documento
    const doc = parser.parseFromString(htmlString, "text/html");

    // Extraer solo el contenido de texto, ignorando las etiquetas HTML
    const sanitizedText = doc.body.textContent || "";

    return sanitizedText.trim();
  };

  return {sanitizeHtml};
};
