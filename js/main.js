document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    function addToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        
        // Notificación
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 start-50 translate-middle-x mb-3 alert alert-success fade show';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${name} añadida al carrito`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
        
        updateCartUI();
    }

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'd-flex justify-content-between align-items-center mb-2';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <div>
                    <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-name="${item.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price * item.quantity;
        });
        
        // Actualizar contador
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        // Eventos para eliminar
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromCart(button.getAttribute('data-name'));
            });
        });
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        updateCartUI();
    }

    // WhatsApp
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('¡Añade pizzas al carrito primero!');
            return;
        }
        
        const phone = '3435188936';
        let message = '¡Hola Toccis\'s! Quiero pedir:\n\n';
        cart.forEach(item => {
            message += `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\n*Total:* $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
        
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        cart = [];
        updateCartUI();
    });
});

// Validación del Formulario de Contacto (si existe en la página)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.querySelector('input[type="text"]');
        const email = this.querySelector('input[type="email"]');
        const message = this.querySelector('textarea');
        let isValid = true;

        // Resetear errores
        document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

        // Validar nombre
        if (!name.value.trim()) {
            showError(name, 'Por favor ingresa tu nombre');
            isValid = false;
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showError(email, 'Ingresa un email válido');
            isValid = false;
        }

        // Validar mensaje
        if (!message.value.trim()) {
            showError(message, 'Por favor escribe tu mensaje');
            isValid = false;
        }

        // Envío exitoso
        if (isValid) {
            // Simular envío (en un proyecto real, usarías AJAX/Fetch)
            const successAlert = `
                <div class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <i class="fas fa-check-circle me-2"></i> ¡Mensaje enviado! Te responderemos pronto.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            contactForm.insertAdjacentHTML('afterend', successAlert);
            contactForm.reset();
        }
    });

    // Función para mostrar errores
    function showError(input, message) {
        input.classList.add('is-invalid');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
}