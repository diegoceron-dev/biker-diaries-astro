import type { ColumnDef } from "@tanstack/vue-table";
import { type Event } from "@/store/events";
import { h } from "vue";
import { Badge } from '@/components/ui/badge'
import DropdownAction from "@/components/vue/events/list/DropdownAction.vue"

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Nombre"),
    cell: ({ row }) => {
      const value = row.getValue("name") as String;
      return h("div", { class: "text-left font-medium" }, value.toString().toUpperCase());
    },
  },
  {
    accessorKey: "description",
    header: () => h("div", { class: "text-left" }, "Descripción"),
    cell: ({ row }) => {
      let value = row.getValue("description") as String;
      value = value.length > 25 ? value.substring(0, 25) + "..." : value;
      return h("div", { class: "text-left font-medium" }, value.toString());
    },
  },
  {
    accessorKey: "startDate",
    header: () => h("div", { class: "text-left" }, "Inicio"),
    cell: ({ row }) => {
      const value = row.getValue("startDate") as String;
      const formattedDate = new Date(value.toString()).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return h("div", { class: "text-left font-medium" }, formattedDate);
    },
  },
  {
    accessorKey: "endDate",
    header: () => h("div", { class: "text-left" }, "Fin"),
    cell: ({ row }) => {
      const value = row.getValue("endDate") as String;
      const formattedDate = new Date(value.toString()).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return h("div", { class: "text-left font-medium" }, formattedDate);
    },
  },
  {
    accessorKey: "eventType",
    header: () => h("div", { class: "text-center" }, "Categoría"),
    cell: ({ row }) => {
      const value = row.getValue("eventType") as String;
      const formattedValue = value.replace(/_/g, " ").toUpperCase();
      return h("div", { class: "text-center font-medium" }, h(Badge, null, formattedValue));
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return h('div', { class: 'relative' }, h(DropdownAction, {
        payment,
        onExpand: row.toggleExpanded,
      }))
    },
  },
];
