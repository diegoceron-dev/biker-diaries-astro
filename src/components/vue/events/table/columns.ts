import type { ColumnDef } from "@tanstack/vue-table";
import { type Event } from "@/store/events";
import { h } from "vue";
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "name",
    header: () => h("div", { class: "text-left" }, "Name"),
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
    header: () => h("div", { class: "text-left" }, "Start Date"),
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
    header: () => h("div", { class: "text-left" }, "End Date"),
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
    header: () => h("div", { class: "text-center" }, "Event Type"),
    cell: ({ row }) => {
      const value = row.getValue("eventType") as String;
      const formattedValue = value.replace(/_/g, " ").toUpperCase();
      return h("div", { class: "text-center font-medium" }, h(Badge, null, formattedValue));
    },
  },
  {
    accessorKey: "actions",
    header: () => h("div", { class: "text-center" }, "Actions"),
    cell: ({ row }) => {
/*       const value = row.getValue("eventType") as String;
      const formattedValue = value.replace(/_/g, " ").toUpperCase();
      return h("div", { class: "text-center font-medium" }, h(Badge, null, formattedValue)); */
      
    },
  },
];
