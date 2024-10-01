import type { ColumnDef } from "@tanstack/vue-table";
import { type Event } from "@/store/events";
import { h } from "vue";
import { Badge } from "@/components/ui/badge";
//@ts-ignore
import DropdownAction from "@/components/vue/events/list/DropdownAction.vue";
import { useEvent } from "@/composables/services/useEvents";

const useEvents = useEvent();

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Nombre"),
    cell: ({ row }) => {
      const value = row.getValue("name") as String;
      return h("div", { class: "text-left font-medium" }, value.toString());
    },
  },
  /* 
  {
    accessorKey: "description",
    header: () => h("div", { class: "text-left" }, "Descripción"),
    cell: ({ row }) => {
      let value = row.getValue("description") as String;
      value = value.length > 25 ? value.substring(0, 25) + "..." : value;
      return h("div", { class: "text-left font-medium" }, value.toString());
    },
  }, 
  */
  {
    accessorKey: "startDate",
    header: () => h("div", { class: "text-left" }, "Inicio"),
    cell: ({ row }) => {
      const value = row.getValue("startDate") as String;
      const formattedDate = new Date(value.toString()).toLocaleDateString(
        "es-ES",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
      return h("div", { class: "text-left font-medium" }, formattedDate);
    },
  },
  {
    accessorKey: "endDate",
    header: () => h("div", { class: "text-left" }, "Fin"),
    cell: ({ row }) => {
      const value = row.getValue("endDate") as String;
      const formattedDate = new Date(value.toString()).toLocaleDateString(
        "es-ES",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
      return h("div", { class: "text-left font-medium" }, formattedDate);
    },
  },
  {
    accessorKey: "userId",
    header: () => h("div", { class: "text-left" }, "User Id"),
    cell: ({ row }) => {
      const value = row.getValue("userId") as String;
     
      return h("div", { class: "text-left font-medium" }, value.toString());
    },
  },
  {
    accessorKey: "eventType",
    header: () => h("div", { class: "text-center" }, "Categoría"),
    cell: ({ row }) => {
      const value = row.getValue("eventType") as String;
      const formattedValue = value.replace(/_/g, " ").toUpperCase();
      return h(
        "div",
        { class: "text-center font-medium" },
        h(Badge, null, formattedValue)
      );
    },
  },
  {
    accessorKey: "status",
    header: () => h("div", { class: "text-center" }, "Status"),
    cell: ({ row }) => {
      const value = row.getValue("status") as String;

      // Definir clases de Tailwind CSS basadas en el valor del status
      const statusClasses = {
        upcoming: "bg-indigo-200 text-indigo-800", // un tono claro de índigo para que combine bien con el tema
        cancelled: "bg-red-200 text-red-800", // un rojo desaturado para evitar choque fuerte con el índigo
        ongoing: "bg-purple-300 text-purple-800", // más intenso para destacar, pero en la misma gama
        completed: "bg-cyan-300 text-cyan-800", // un verde azulado que complementa el índigo
      };

      // Seleccionar la clase correspondiente o usar la clase por defecto
      const selectedClass =
        statusClasses[value as keyof typeof statusClasses] ||
        statusClasses.upcoming;

      return h(
        "div",
        { class: `text-center font-medium` },
        h(
          "span",
          {
            class: `px-2 py-1 rounded-full text-xs font-normal ${selectedClass}`,
          },
          value.toUpperCase()
        )
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;

      const handleCancel = async () => {
        await useEvents.cancelEvent(event);
        await useEvents.getMyEvents(event.userId!);
      };

      const handleSee = () => {
        window.location.href = `/events/${event.id}`;
      };

      return h(
        "div",
        { class: "relative" },
        h(DropdownAction, {
          event,
          onCancel: handleCancel,
          onSee: handleSee,
        })
      );
    },
  },
];
