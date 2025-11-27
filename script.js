// ===================================================
// VARIABLES GLOBALES Y DOM
// ===================================================
let productosGlobales = []; 
const URL_API = 'https://fakestoreapi.com/products?limit=12'; 
const productosContainer = document.getElementById('productos-container');
const contadorCarrito = document.getElementById('contador-carrito');
const carritoDetalle = document.getElementById('carrito-detalle');
const contactForm = document.getElementById('contact-form');

// Nuevas variables para Autenticación (Requisito Nuevo)
const authModal = document.getElementById('auth-modal');
const btnLoginRegister = document.getElementById('btn-login-register');
const closeModal = document.getElementById('close-modal');
const authForm = document.getElementById('auth-form');
const btnLogout = document.getElementById('btn-logout');
const welcomeUserSpan = document.getElementById('welcome-user');

let isLoggedIn = false;
let userType = 'normal'; // Inicialmente normal

// ===================================================
// INICIALIZACIÓN
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();     // Verifica si hay un usuario logueado al iniciar
    cargarProductos();     // Llama a la API y renderiza con precios correctos
    actualizarContador();  // Inicializa el contador con LocalStorage
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
    
    // Carga el estado de autenticación ANTES de renderizar
    checkAuthStatus(); 
    
    productos.forEach(producto => {
        
        let precioFinal = producto.price;
        let discountMsg = '';

        // Lógica de Precios Diferenciados (Requisito Nuevo)
        if (isLoggedIn && userType === 'mayorista') {
            const descuento = 0.15; // 15% de descuento
            precioFinal = precioFinal * (1 - descuento);
            discountMsg = `<span class="discount-badge">15% OFF Mayorista!</span>`;
        }
        
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${producto.image}" alt="Imagen de ${producto.title}" loading="lazy">
            <h3>${producto.title}</h3>
            ${discountMsg}
            <p class="price">$${precioFinal.toFixed(2)}</p>
            <button class="btn-add-cart" 
                    data-id="${producto.id}" 
                    data-nombre="${producto.title}" 
                    data-precio="${precioFinal}"> 
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

function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    return carritoJSON ? JSON.parse(carritoJSON) : [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
    actualizarContador();
    renderizarCarrito(); 
}

function actualizarContador() {
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, prod) => acc + prod.cantidad, 0); 
    contadorCarrito.textContent = totalItems;
}

function agregarAlCarrito(idProducto, nombre, precio) {
    let carrito = obtenerCarrito();
    const productoExistente = carrito.find(prod => prod.id === idProducto);

    if (productoExistente) {
        productoExistente.cantidad++; 
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
    let html = '<h3>Tu Carrito de Compras</h3>';

    if (carrito.length === 0) {
        html += '<p class="empty-cart-msg">El carrito está vacío. ¡Añade productos!</p>';
        carritoDetalle.innerHTML = html;
        return;
    }

    let totalCompra = 0;
    
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
        
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailInput.value)) {
            e.preventDefault(); 
            alert('Por favor, ingresa un formato de correo electrónico válido.');
            emailInput.focus();
        } 
        
        if (!e.defaultPrevented) {
             setTimeout(() => {
                alert('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.');
                contactForm.reset();
            }, 100);
        }
    });
}


// ===================================================
// PARTE 5: LÓGICA DE AUTENTICACIÓN (NUEVO)
// ===================================================

function checkAuthStatus() {
    const user = localStorage.getItem('userTechFlow');
    if (user) {
        isLoggedIn = true;
        userType = 'mayorista';
        const userData = JSON.parse(user);
        
        // Muestra el nombre y oculta el botón de Login
        btnLoginRegister.classList.add('hidden');
        welcomeUserSpan.textContent = `Hola, ${userData.username}! (Mayorista)`;
        welcomeUserSpan.classList.remove('hidden');
        btnLogout.classList.remove('hidden');
    } else {
        isLoggedIn = false;
        userType = 'normal';
        // Muestra el botón de Login y oculta el nombre/logout
        btnLoginRegister.classList.remove('hidden');
        welcomeUserSpan.classList.add('hidden');
        btnLogout.classList.add('hidden');
    }
}

// Handlers para el Modal
btnLoginRegister.addEventListener('click', () => {
    // Si ya está logueado, permite hacer Logout desde el modal
    if(isLoggedIn) {
        authModal.classList.remove('hidden');
    } else {
        // Si no está logueado, muestra el formulario de Login
        authModal.classList.remove('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
});

closeModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

// Handler para el Login
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // Simulación de credenciales: 
    if (usernameInput === 'admin' && passwordInput === '123') {
        localStorage.setItem('userTechFlow', JSON.stringify({ username: usernameInput, loggedIn: true }));
        
        // Vuelve a cargar productos para aplicar descuentos
        cargarProductos(); 
        
        authModal.classList.add('hidden');
        alert('Acceso exitoso. ¡Bienvenido a precios mayoristas!');
    } else {
        alert('Credenciales incorrectas. Intenta "admin" y "123".');
    }
});

// Handler para el Logout
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('userTechFlow');
    localStorage.removeItem('carrito'); // Opcional: vaciar el carrito al cerrar sesión
    
    // Vuelve a cargar productos para quitar descuentos y vacía el carrito
    cargarProductos(); 
    
    authModal.classList.add('hidden');
    alert('Sesión cerrada. Los precios han vuelto a la tarifa normal.');
});
