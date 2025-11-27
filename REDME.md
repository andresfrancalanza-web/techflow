# TechFlow - E-commerce de Insumos Tecnológicos

## Descripción del Proyecto

Este proyecto es la **Entrega Final** del curso de **Front-End JS** y simula un sitio web de e-commerce dinámico dedicado a la venta de insumos y accesorios de tecnología.

El objetivo principal es demostrar la integración de los conocimientos adquiridos, incluyendo la manipulación del DOM, asincronía (`fetch`), persistencia de datos (`localStorage`), y el uso de Flexbox/Grid para un diseño responsivo y moderno.

## Estructura del Repositorio

* `index.html`: Estructura principal, con el formulario de contacto, contenedores de productos y el nuevo **Modal de Autenticación**.
* `styles.css`: Estilos, diseño responsivo, Flexbox/Grid, y los nuevos estilos para el **logo moderno** y el **fondo tecnológico** del *Hero Banner*.
* `script.js`: Toda la lógica JavaScript (Fetch, DOM, LocalStorage, Carrito) y la **Lógica de Autenticación/Precios Diferenciados**.
* `REDME.md`: Documentación del proyecto.

## Funcionalidades Clave

### 🛒 Carrito de Compras Persistente
* Los productos se añaden al carrito y las cantidades se gestionan de forma dinámica.
* El carrito se mantiene guardado en el navegador (`localStorage`) entre sesiones (Requisito 8).
* Permite aumentar/disminuir cantidades y eliminar productos (Requisito 9).

### 🚀 Catálogo Dinámico con Fetch API
* Los productos se cargan dinámicamente utilizando la función `fetch()` para consumir la API pública: `https://fakestoreapi.com/products?limit=12` (Requisito 7).
* Los productos se renderizan en el DOM.

### 🔐 Autenticación y Precios Diferenciados (Nuevo Requisito)
* Se ha implementado una simulación de inicio de sesión a través de un Modal de Autenticación.
* **Credenciales de Prueba:** Usuario: `admin`, Contraseña: `123`.
* Al iniciar sesión con estas credenciales, la variable de estado del usuario cambia a `mayorista`.
* **Precios Diferenciados:** Si el usuario es `mayorista`, se aplica un **15% de descuento** en todos los productos del catálogo al momento de la renderización (Requisito Funcional).

### ✨ Estilo y Diseño
* **Logo Modernizado:** El logo de "TechFlow" es más grande y utiliza un efecto de neón para mayor impacto.
* **Fondo Tecnológico:** El *Hero Banner* tiene un fondo con un degradado moderno.
* **Multimedia Actualizada:** Se ha incorporado el video de YouTube solicitado.
* **Diseño Responsivo:** Se utilizan Media Queries para garantizar la correcta visualización en todos los dispositivos (Requisito 4).

### 📧 Formulario de Contacto
* Formulario funcional utilizando Formspree.io y validación simple del email mediante manipulación del DOM (Requisito 7).
