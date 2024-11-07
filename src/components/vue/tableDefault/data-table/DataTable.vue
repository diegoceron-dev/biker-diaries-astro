<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  FlexRender,
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import {
  ArrowUpDown,
  ChevronDown,
  TableIcon,
  BookCopy,
  EarthLock,
  Earth,
} from "lucide-vue-next";

import { h, ref } from "vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, valueUpdater } from "@/lib/utils";
import type { EventType } from "@auth/core/types";
import type { Event } from "@/store/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useSanitize } from "@/composables/utilities/useSanitize";

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();

const { sanitizeHtml } = useSanitize();

const columnHelper = createColumnHelper<EventType>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const modeShowData = ref<"table" | "cards">("cards");

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    columnPinning: {
      // left: ["name"],
    },
  },
});

const getColumnNameFromString = (str: string): string | null => {
  const regex = /h\("div",\s*{[^}]*},\s*"([^"]+)"\)/;
  const match = str.match(regex);
  return match ? match[1] : null;
};

const getHeaderClass = (row: any) => {
  const cover = getCover(row);
  const color = getColor(row);

  return cover ? `bg-black/40 bg-[url('${cover}')] bg-cover bg-center` : color;
};

const getDescription = (row: any) => {
  const descriptionRow = row.getValue("description") as string;
  const descriptionSanitized = sanitizeHtml(
    descriptionRow || "No description..."
  );
  const value =
    descriptionSanitized.length > 150
      ? `${descriptionSanitized.substring(0, 150)}...`
      : descriptionSanitized;

  return value;
};

const getCover = (row: any) => {
  const original = JSON.stringify(row.original);
  const newValue = Object.assign({}, JSON.parse(original));
  const cover = newValue.cover?.replace(/\?_a=DATAg1AAZAA0$/, "");

  return cover;
};

const getColor = (row: any) => {
  const original = JSON.stringify(row.original);
  const newValue = Object.assign({}, JSON.parse(original));
  const color = newValue.color ?? "bg-indigoBrand";

  return color;
};

const handleSee = (row: any) => {
  const event = row.original;

  window.location.href = `/events/${event.id}`;
};

const dates = (startDateItem: Date, endDateItem: Date) => {
  if (!startDateItem || !endDateItem) return "";

  // Asegurarse de que las fechas sean Date válidas
  const startDate = new Date(startDateItem);
  const endDate = new Date(endDateItem);

  // Agregar un día a cada fecha
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 1);

  // Opciones para formatear la fecha
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Mexico_City", // Ajusta la zona horaria si es necesario
  };

  // Convertir la fecha de inicio
  const start = startDate.toLocaleDateString("es-ES", options);

  // Convertir la fecha de fin
  const end = endDate.toLocaleDateString("es-ES", options);

  return `${start} - ${end}`;
};
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center pb-4 m-1">
      <Input
        class="max-w-sm"
        placeholder="Buscar"
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        autofocus
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />

      <!--   {{ modeShowData }} -->
      <DropdownMenu v-if="modeShowData === 'table'">
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columnas <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="
              (value) => {
                column.toggleVisibility(!!value);
              }
            "
          >
            {{ getColumnNameFromString(column.columnDef.header?.toString()!) }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        class="flex items-center ml-auto bg-secondary rounded-lg hover:cursor-pointer transition-all duration-200 ease-in-out"
      >
        <!-- Ícono de tabla -->
        <span
          @click="modeShowData = 'table'"
          :class="[
            'flex items-center justify-center p-2 rounded-l-lg',
            modeShowData === 'table' ? 'bg-transparent' : 'bg-white/30',
          ]"
        >
          <TableIcon
            :class="[
              'h-5 w-5',
              modeShowData === 'table' ? 'text-slate-600' : 'text-slate-600 ',
            ]"
          />
        </span>
        <!-- Ícono de cards -->
        <span
          @click="modeShowData = 'cards'"
          :class="[
            'flex items-center justify-center p-2 rounded-r-lg',
            modeShowData === 'cards' ? 'bg-transparent' : 'bg-white/30',
          ]"
        >
          <BookCopy
            :class="[
              'h-5 w-5',
              modeShowData === 'cards' ? 'text-slate-600' : 'text-slate-600',
            ]"
          />
        </span>
      </div>
    </div>

    <!-- Cards Aqui -->
    <div
      class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2"
      v-if="modeShowData === 'cards'"
    >
      <Card
        v-for="(row, index) in table.getRowModel().rows"
        :key="index"
        class="!cursor-pointer transition duration-200 ease-in-out transform hover:scale-105"
        @click="handleSee(row)"
      >
        <CardHeader :class="['relative rounded-t-md', getHeaderClass(row)]">
          <CardTitle
            class="flex flex-row justify-between gap-2 text-sm text-white font-semibold z-10"
          >
            <span>{{ row.getValue("name") }}</span>
            <span v-if="row.getValue('isPublic')">
              <Earth :size="16" />
            </span>
            <span v-else>
              <EarthLock :size="16" />
            </span>
          </CardTitle>
         <div class="flex flex-row justify-end space-x-2 pt-2">
          <span
            class="z-10 bg-white/20 backdrop-blur-md border border-white/50 rounded-full shadow-lg px-2 py-1 text-xs text-white"
          >
            {{ dates(row.getValue("startDate"), row.getValue("endDate")) }}
          </span>
         </div>
          <div
            class="absolute inset-0 rounded-t-md bg-gradient-to-t from-black/60 to-transparent"
          ></div>
        </CardHeader>
        <CardContent class="text-xs">
          {{ getDescription(row) }}
        </CardContent>
      </Card>
    </div>

    <div
      class="flex w-full items-center justify-center h-24"
      v-if="modeShowData === 'cards' && !data.length"
    >
      <span
        :colspan="columns.length"
        class="flex items-center justify-center text-sm text-slate-500 rounded-md w-full h-full bg-card"
      >
        Sin Resultados.
      </span>
    </div>

    <div
      class="rounded-md border border-slate-400 shadow-md"
      v-if="modeShowData === 'table'"
    >
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              :class="
                cn(
                  { 'bg-transparent hover:bg-transparent hover:rounded': true },
                  { sticky: header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
                )
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="
                    cn(
                      { 'sticky bg-input/90': cell.column.getIsPinned() },
                      cell.column.getIsPinned() === 'left'
                        ? 'left-0'
                        : 'right-0'
                    )
                  "
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ row.original }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center text-slate-500"
            >
              Sin Resultados.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div
      class="flex items-center justify-end space-x-2 py-4"
      v-if="table.getRowModel().rows?.length"
    >
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Siguiente
        </Button>
      </div>
    </div>
  </div>
</template>
