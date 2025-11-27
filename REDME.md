# TechFlow - E-commerce de Insumos Tecnológicos

## Descripción del Proyecto

Este proyecto es la **Entrega Final** del curso de **Front-End JS** y simula un sitio web de e-commerce dinámico dedicado a la venta de insumos y accesorios de tecnología.

El objetivo es integrar todos los conocimientos adquiridos a lo largo del curso:

1.  **Estructura Semántica y CSS/Diseño:** Uso de HTML Semántico, Flexbox y Grid, y Diseño Responsivo mediante Media Queries.
2.  **Interactividad con JavaScript:** Implementación completa de la lógica de un carrito de compras.
3.  **Persistencia de Datos:** Uso de `localStorage` para mantener el estado del carrito al recargar la página.
4.  **Asincronía y APIs:** Consumo de una API REST (`https://fakestoreapi.com/products`) para renderizar el catálogo de productos dinámicamente.
5.  **Accesibilidad y SEO:** Implementación de prácticas como el uso de `alt` en imágenes y metaetiquetas.

## Estructura del Repositorio

* `index.html`: Estructura principal, con el formulario de contacto y los contenedores de productos/carrito.
* `styles.css`: Estilos, diseño responsivo, Flexbox y CSS Grid.
* `script.js`: Toda la lógica JavaScript (Fetch, DOM, LocalStorage y Carrito).
* `REDME.md`: Documentación del proyecto.

## Funcionalidades Clave

* **Catálogo Dinámico:** Los productos se cargan directamente desde una API al visitar la página.
* **Carrito Persistente:** Los usuarios pueden añadir productos y el carrito se mantiene guardado en el navegador (`localStorage`) entre sesiones.
* **Gestión del Carrito:** Permite aumentar/disminuir cantidades y eliminar productos, actualizando el total de la compra en tiempo real.
* **Formulario Funcional:** El formulario utiliza Formspree para el envío de datos.