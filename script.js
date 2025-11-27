// ===================================================
// VARIABLES GLOBALES
// ===================================================
let productosGlobales = []; // Almacenará los productos de la API
const URL_API = 'https://fakestoreapi.com/products?limit=12'; // API pública
const productosContainer = document.getElementById('productos-container');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoDetalle = document.getElementById('carrito-detalle');
const contactForm = document.getElementById('contact-form');

// ===================================================
// INICIALIZACIÓN
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();     // Llama a la API y renderiza
    actualizarContador();  // Inicializa el contador con LocalStorage
    // Opcional: renderizarCarrito(); si quieres mostrar el detalle al inicio.
});

// ===================================================
// PARTE 1: FETCH API Y RENDERIZADO DINÁMICO (Req 7)
// ===================================================

async function cargarProductos() {
    try {
        const response = await fetch(URL_API);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        productosGlobales = await response.json();
        renderizarProductos(productosGlobales);

    } catch (error) {
        console.error("Error al cargar la API:", error);
        productosContainer.innerHTML = '<p class="error-msg">Lo sentimos, no pudimos cargar los productos en este momento. Por favor, revisa la conexión.</p>';
    }
}

function renderizarProductos(productos) {
    productosContainer.innerHTML = ''; 
    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        // Renderizado con data-atributos para el carrito
        card.innerHTML = `
            <img src="${producto.image}" alt="Imagen de ${producto.title}" loading="lazy">
            <h3>${producto.title}</h3>
            <p class="price">$${producto.price.toFixed(2)}</p>
            <button class="btn-add-cart" 
                    data-id="${producto.id}" 
                    data-nombre="${producto.title}" 
                    data-precio="${producto.price}">
                Añadir al Carrito
            </button>
        `;
        productosContainer.appendChild(card);
    });

    cargarEventosAgregar(); 
}

// ===================================================
// PARTE 2: CARRITO Y LOCALSTORAGE (Req 8)
// ===================================================

// Funciones de Persistencia
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    // Guarda el objeto en LocalStorage como JSON string (Requisito 8)
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    actualizarContador();
    // Vuelve a renderizar el detalle del carrito
    renderizarCarrito(); 
}

function actualizarContador() {
    const carrito = obtenerCarrito();
    // Suma las cantidades de todos los productos (Requisito 8)
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0); 
    contadorCarrito.textContent = totalItems;
}

function agregarAlCarrito(idProducto, nombre, precio) {
    let carrito = obtenerCarrito();
    const productoExistente = carrito.find(prod => prod.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad++; // Edición de Cantidades (Req 9)
    } else {
        carrito.push({ 
            id: idProducto, 
            nombre: nombre, 
            precio: precio, 
            cantidad: 1 
        });
    }

    guardarCarrito(carrito);
    alert(`🛒 ${nombre} añadido. ¡Total en carrito: ${contadorCarrito.textContent}!`);
}

function cargarEventosAgregar() {
    document.querySelectorAll('.btn-add-cart').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseFloat(e.target.getAttribute('data-precio'));
            
            agregarAlCarrito(id, nombre, precio);
        });
    });
}

// ===================================================
// PARTE 3: VISUALIZACIÓN Y EDICIÓN DEL CARRITO (Req 9)
// ===================================================

function renderizarCarrito() {
    const carrito = obtenerCarrito();
    let html = '<h3>Detalle de Carrito</h3>';

    if (carrito.length === 0) {
        html += '<p class="empty-cart-msg">El carrito está vacío. ¡Añade productos!</p>';
        carritoDetalle.innerHTML = html;
        return;
    }

    let totalCompra = 0;
    
    // Generación de la tabla de productos (Requisito 9)
    html += '<table><thead><tr><th>Producto</th><th>Cant.</th><th>Total</th><th></th></tr></thead><tbody>';

    carrito.forEach(prod => {
        const subtotal = prod.precio * prod.cantidad;
        totalCompra += subtotal;
        
        html += `
            <tr data-id="${prod.id}">
                <td>${prod.nombre}</td>
                <td class="qty-control">
                    <button class="btn-qty" data-id="${prod.id}" data-action="decrease">-</button>
                    ${prod.cantidad}
                    <button class="btn-qty" data-id="${prod.id}" data-action="increase">+</button>
                </td>
                <td>$${subtotal.toFixed(2)}</td>
                <td><button class="btn-remove" data-id="${prod.id}">X</button></td>
            </tr>
        `;
    });

    // Total Dinámico (Requisito 9)
    html += `
        </tbody>
        <tfoot>
            <tr>
                <td colspan="2">Total Final:</td>
                <td colspan="2" class="total-final">$${totalCompra.toFixed(2)}</td>
            </tr>
        </tfoot>
        </table>
        <button id="vaciar-carrito" class="btn-clear-cart">Vaciar Carrito</button>
    `;

    carritoDetalle.innerHTML = html;
    cargarEventosEdicion();
}

function cargarEventosEdicion() {
    // Escucha eventos de edición y eliminación
    carritoDetalle.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.getAttribute('data-id'));

        if (target.classList.contains('btn-qty')) {
            const action = target.getAttribute('data-action');
            editarCantidad(id, action);
        } else if (target.classList.contains('btn-remove')) {
            eliminarProducto(id);
        } else if (target.id === 'vaciar-carrito') {
            vaciarCarrito();
        }
    });
}

function editarCantidad(id, action) {
    let carrito = obtenerCarrito();
    const index = carrito.findIndex(prod => prod.id === id);

    if (index !== -1) {
        if (action === 'increase') {
            carrito[index].cantidad++;
        } else if (action === 'decrease') {
            carrito[index].cantidad--;
            if (carrito[index].cantidad < 1) {
                carrito.splice(index, 1); 
            }
        }
    }
    guardarCarrito(carrito);
}

function eliminarProducto(id) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(prod => prod.id !== id);
    guardarCarrito(carrito);
    alert('Producto eliminado del carrito.');
}

function vaciarCarrito() {
    localStorage.removeItem('carrito');
    guardarCarrito([]);
    alert('El carrito ha sido vaciado.');
}

// ===================================================
// PARTE 4: FORMULARIO Y VALIDACIÓN (Req 7 DOM)
// ===================================================
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        
        // Validación DOM (Ejemplo de manipulación de DOM - Req 7)
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailInput.value)) {
            e.preventDefault(); 
            alert('Por favor, ingresa un formato de correo electrónico válido.');
            emailInput.focus();
        } 
        
        // Si la validación pasa, Formspree (action en HTML) maneja el envío.
        // Simulación de mensaje de éxito post-envío:
        if (!e.defaultPrevented) {
             setTimeout(() => {
                // Esto se ejecuta después de que Formspree envía los datos
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                contactForm.reset();
            }, 100);
        }
    });
}