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
import { ArrowUpDown, ChevronDown, TableIcon, BookCopy } from "lucide-vue-next";

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

const props = defineProps<{
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}>();

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
  const cover = row.getValue("cover");
  const color = row.getValue("color") ?? "bg-slate-700/20";

  /*   if (!cover) return "rounded-t-xl bg-slate-700/10 h-[80px]";

  return `relative rounded-t-md bg-cover bg-center ${
    cover ? `bg-[url('${cover}')]` : ""
  }`; */

  return cover ? `bg-black/40 bg-[url('${cover}')] bg-cover bg-center` : color;
};

const getDescription = (description: any) => {
  if (!description) return "No description";
  return description.length > 25
    ? description.substring(0, 25) + "..."
    : description;
};

const handleSee = (row: any) => {
  const event = row.original;

  window.location.href = `/events/${event.id}`;
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
      class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      v-if="modeShowData === 'cards'"
    >
      <Card v-for="(row, index) in table.getRowModel().rows" :key="index">
        <CardHeader
          :class="['relative rounded-t-md', getHeaderClass(row)]"
          @click="handleSee(row)"
        >
          <CardTitle class="text-sm font-bold">
            {{ row.getValue("name") }}
          </CardTitle>
        </CardHeader>
        <CardContent class="text-xs">
          {{ getDescription(row.getValue("description")) }}
        </CardContent>
      </Card>
    </div>

    <div
      class="flex w-full items-center justify-center h-24"
      v-if="modeShowData === 'cards'"
    >
      <span
        :colspan="columns.length"
        class="flex items-center justify-center text-sm text-slate-500 rounded-md w-full h-full"
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
