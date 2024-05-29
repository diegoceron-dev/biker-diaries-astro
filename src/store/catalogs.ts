// src/store/catalogs.ts

import { map } from 'nanostores';

// Tipo de datos para los elementos del catálogo de eventos
export type Catalog = {
  id: string;
  description: string;
};

// Función para leer desde localStorage (solo en el cliente)
function loadCatalogFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const savedCatalog = localStorage.getItem('typeEventCatalog');
    return savedCatalog ? JSON.parse(savedCatalog) : {};
  }
  return {};
}

// Estado del catálogo de eventos, usando un mapa para almacenar los elementos
export const typeEventCatalog = map<Record<string, Catalog>>(loadCatalogFromLocalStorage());

// Función para agregar o actualizar un elemento en el catálogo
export const setCatalogItem = (item: Catalog) => {
  typeEventCatalog.setKey(item.id, item);
};

// Función para agregar o actualizar múltiples elementos en el catálogo
export const setCatalogItems = (items: Catalog[]) => {
  for (const item of items) {
    typeEventCatalog.setKey(item.id, item);
  }
};

// Suscribirse a cambios en el catálogo de eventos para guardar en localStorage
if (typeof window !== 'undefined') {
  typeEventCatalog.subscribe((newItems) => {
    localStorage.setItem('typeEventCatalog', JSON.stringify(newItems));
    // console.log('Catálogo actualizado:', newItems);
  });
}
