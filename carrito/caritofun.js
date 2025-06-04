// carrito/js/caritofun.js
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsListElement = document.getElementById('cart-items-list');
    const orderSummaryDetailsElement = document.getElementById('order-summary-details');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const emptyCartMessageElement = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');

    // Función para cargar el carrito desde localStorage
    function loadCart() {
        const cartData = localStorage.getItem('shoppingCart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Función para guardar el carrito en localStorage
    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart(cart); // Volver a renderizar el carrito después de cualquier cambio
    }

    // Función para renderizar (mostrar) el carrito en la página
    function renderCart(cart) {
        cartItemsListElement.innerHTML = ''; // Limpiar lista actual
        orderSummaryDetailsElement.innerHTML = ''; // Limpiar resumen actual
        let totalPrice = 0;

        if (cart.length === 0) {
            emptyCartMessageElement.style.display = 'block';
            cartItemsListElement.style.display = 'none';
            orderSummaryDetailsElement.parentElement.style.display = 'none'; // Ocultar todo el aside
            checkoutButton.disabled = true;
            checkoutButton.style.opacity = '0.5';
        } else {
            emptyCartMessageElement.style.display = 'none';
            cartItemsListElement.style.display = 'block';
            orderSummaryDetailsElement.parentElement.style.display = 'block'; // Mostrar aside
            checkoutButton.disabled = false;
            checkoutButton.style.opacity = '1';


            cart.forEach(item => {
                // Crear tarjeta para la lista de items
                const itemCard = document.createElement('div');
                itemCard.classList.add('cart-item-card');
                itemCard.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <p class="item-price">Precio: S/ ${item.price.toFixed(2)}</p>
                        <p class="item-rating">Calificación: ${item.rating}</p>
                    </div>
                    <div class="item-quantity">
                        <label for="quantity-${item.id}">Cantidad:</label>
                        <input type="number" id="quantity-${item.id}" data-id="${item.id}" name="quantity" min="1" value="${item.quantity}" class="quantity-input">
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Eliminar</button>
                `;
                cartItemsListElement.appendChild(itemCard);

                // Crear item para el resumen del pedido
                const summaryItem = document.createElement('div');
                summaryItem.classList.add('summary-item');
                const itemSubtotal = item.price * item.quantity;
                summaryItem.innerHTML = `
                    <span class="item-name">${item.name} (x${item.quantity})</span>
                    <span class="item-total-price">S/ ${itemSubtotal.toFixed(2)}</span>
                `;
                orderSummaryDetailsElement.appendChild(summaryItem);

                totalPrice += itemSubtotal;
            });
        }

        cartTotalPriceElement.textContent = `S/ ${totalPrice.toFixed(2)}`;
        addEventListenersToCartItems();
    }

    // Función para manejar el cambio de cantidad
    function handleQuantityChange(event) {
        const itemId = event.target.dataset.id;
        const newQuantity = parseInt(event.target.value);
        let cart = loadCart();

        if (newQuantity >= 1) {
            const itemIndex = cart.findIndex(item => item.id === itemId);
            if (itemIndex > -1) {
                cart[itemIndex].quantity = newQuantity;
                saveCart(cart);
            }
        } else {
            // Si la cantidad es menor a 1, restaurar a 1 o eliminar (decide tu lógica)
            // Por ahora, restauramos al valor anterior si es inválido o simplemente no hacemos nada
            // o podrías eliminarlo si llega a 0.
            event.target.value = cart.find(item => item.id === itemId).quantity; // Restaura el valor
        }
    }

    // Función para manejar la eliminación de un item
    function handleRemoveItem(event) {
        const itemId = event.target.dataset.id;
        let cart = loadCart();
        cart = cart.filter(item => item.id !== itemId);
        saveCart(cart);
    }

    // Función para agregar event listeners a los botones de cantidad y eliminar
    function addEventListenersToCartItems() {
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
            input.addEventListener('input', (e) => { // Para actualizar mientras se escribe si es necesario
                 if (parseInt(e.target.value) < 1 && e.target.value !== "") {
                    e.target.value = 1; // Forzar mínimo 1 si el usuario intenta borrar o poner 0
                }
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }


    // Cargar y mostrar el carrito al iniciar la página
    let shoppingCart = loadCart();
    renderCart(shoppingCart);

    // Event listener para el botón "Hacer pedido"
    if(checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (shoppingCart.length > 0) {
                alert('¡Pedido realizado!\n(Esta es una simulación. Aquí iría la lógica para procesar el pago, enviar al backend, etc.)');
                // Opcional: Vaciar el carrito después del pedido
                // shoppingCart = [];
                // saveCart(shoppingCart);
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }
});

