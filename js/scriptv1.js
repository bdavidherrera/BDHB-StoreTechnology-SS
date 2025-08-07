// Products Data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        description: "El smartphone más avanzado con chip A17 Pro y cámara profesional",
        price: 999,
        image: "../img/iPhone.jpg"
    },
    {
        id: 2,
        name: "MacBook Air M2",
        description: "Laptop ultradelgada con chip M2 y batería de larga duración",
        price: 1199,
        image: "../img/Macbook-air-m2.jpeg"
    },
    {
        id: 3,
        name: "iPad Pro 12.9",
        description: "Tablet profesional con pantalla Liquid Retina XDR",
        price: 1099,
        image: "../img/iPad Pro 12.9.webp"
    },
    {
        id: 4,
        name: "Apple Watch Ultra",
        description: "Reloj inteligente resistente para deportes extremos",
        price: 799,
        image: "../img/Apple_Watch_Ultra.webp"
    },
    {
        id: 5,
        name: "AirPods Pro",
        description: "Auriculares con cancelación activa de ruido",
        price: 249,
        image: "../img/AirPods_Pro.png"
    },
    {
        id: 6,
        name: "Samsung Galaxy S24",
        description: "Smartphone con IA integrada y cámara de 200MP",
        price: 899,
        image: "../img/Samsung_Galaxy_S24.jpg"
    }
];

// Cart functionality
let cart = [];
const SHIPPING_COST = 15.00;

// Load products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showAddedToCartAnimation();
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Tu carrito está vacío</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" class="cart-img">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    Eliminar
                </button>
            </div>
        `).join('');
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart modal
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = cartModal.style.display === 'flex' ? 'none' : 'flex';
}

// Show checkout form
function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    updateCheckoutTotals();
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = 'flex';
    toggleCart();
}

// Toggle checkout modal
function toggleCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = checkoutModal.style.display === 'flex' ? 'none' : 'flex';
}

// Update checkout totals
function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;

    document.getElementById('checkoutSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('shippingCost').textContent = SHIPPING_COST.toFixed(2);
    document.getElementById('checkoutTotal').textContent = total.toFixed(2);
}

// Card formatting functions
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    // Limitar a 16 dígitos
    value = value.substring(0, 16);
    let parts = [];
    for (let i = 0; i < value.length; i += 4) {
        parts.push(value.substring(i, i + 4));
    }
    input.value = parts.join(' ');
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        let month = value.substring(0, 2);
        let year = value.substring(2, 4);
        
        // Validar que el mes sea entre 01 y 12
        if (parseInt(month) > 12) {
            month = '12';
        }
        if (parseInt(month) < 1 && month.length === 2) {
            month = '01';
        }
        
        value = month + year;
        input.value = month + '/' + year;
    } else {
        input.value = value;
    }
}

function formatCVV(input) {
    // Limitar CVV a 3-4 dígitos
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = value.substring(0, 4);
}

// Validar solo letras en el nombre
function formatName(input) {
    // Solo permitir letras, espacios y acentos
    input.value = input.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}

function validateCheckoutForm(formData) {
    const errors = [];
    
    if (!formData.fullName.trim()) {
        errors.push('El nombre completo es requerido');
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Ingresa un correo electrónico válido');
    }

    if (!formData.address.trim()) {
        errors.push('La dirección de envío es requerida');
    }

    if (formData.paymentMethod === 'creditCard') {
        if (!formData.cardNumber || !/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(formData.cardNumber)) {
            errors.push('El número de tarjeta debe tener 16 dígitos');
        }

        if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
            errors.push('Fecha de vencimiento inválida (MM/YY)');
        }

        if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) {
            errors.push('CVV debe tener 3 o 4 dígitos');
        }
    }

    return errors;
}

function processCheckout(formData) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;
    const itemsText = cart.map(item => `${item.name} x${item.quantity}`).join(', ');

    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: formData.fullName,
            email: formData.email,
            address: formData.address
        },
        items: [...cart],
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal,
        shipping: SHIPPING_COST,
        total: total
    };

    setTimeout(() => {
        alert(`¡Pedido confirmado!\n\nNúmero de orden: ${order.id}\nCliente: ${order.customer.name}\nProductos: ${itemsText}\nTotal: $${total.toFixed(2)}\n\n¡Gracias por tu compra!`);
        
        cart = [];
        updateCartUI();
        toggleCheckout();
        document.getElementById('checkoutForm').reset();
        document.getElementById('cardDetails').style.display = 'none';
    }, 1000);
}

function showAddedToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.2)';
    cartIcon.style.background = 'rgba(40, 167, 69, 0.3)';

    setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
        cartIcon.style.background = 'rgba(255,255,255,0.2)';
    }, 300);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({
        behavior: 'smooth'
    });
}

// Event listeners
document.addEventListener('click', function(e) {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (e.target === cartModal) {
        toggleCart();
    }
    
    if (e.target === checkoutModal) {
        toggleCheckout();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartModal = document.getElementById('cartModal');
        const checkoutModal = document.getElementById('checkoutModal');
        
        if (cartModal.style.display === 'flex') {
            toggleCart();
        } else if (checkoutModal.style.display === 'flex') {
            toggleCheckout();
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();

    // Payment method toggle
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            const cardDetails = document.getElementById('cardDetails');
            cardDetails.style.display = this.value === 'creditCard' ? 'block' : 'none';
        });
    });

    // Format inputs
    const fullNameInput = document.getElementById('fullName');
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (fullNameInput) fullNameInput.addEventListener('input', () => formatName(fullNameInput));
    if (cardNumberInput) cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
    if (expiryDateInput) expiryDateInput.addEventListener('input', () => formatExpiryDate(expiryDateInput));
    if (cvvInput) cvvInput.addEventListener('input', () => formatCVV(cvvInput));

    // Form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
                cardNumber: document.getElementById('cardNumber')?.value,
                expiryDate: document.getElementById('expiryDate')?.value,
                cvv: document.getElementById('cvv')?.value
            };

            const errors = validateCheckoutForm(formData);
            
            if (errors.length > 0) {
                alert('Por favor corrige los siguientes errores:\n\n• ' + errors.join('\n• '));
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Procesando...';
            submitBtn.disabled = true;

            processCheckout(formData);

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
});