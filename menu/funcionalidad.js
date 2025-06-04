// menu/js/funcionalidad.js
document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const cartCountElement = document.getElementById('cart-count');

    // Función para cargar el carrito desde localStorage
    function loadCart() {
        const cartData = localStorage.getItem('shoppingCart');
        // Si no hay nada, devuelve un array vacío.
        // Si hay algo, lo parsea (convierte de string JSON a objeto/array JavaScript)
        return cartData ? JSON.parse(cartData) : [];
    }

    // Función para guardar el carrito en localStorage
    function saveCart(cart) {
        // Convierte el array/objeto JavaScript a un string JSON para guardarlo
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCount(cart); // Actualiza el contador visual en el header
        // No es estrictamente necesario llamar a updateMenuSelectionStates aquí
        // porque el clic ya maneja la clase '.selected' del item individual.
        // Pero si hubiera otra forma de modificar el carrito (ej. desde otra página
        // y luego volviendo aquí sin recargar), sería útil.
        // updateMenuSelectionStates(cart);
    }

    // Función para actualizar el contador del carrito en el header
    function updateCartCount(cart) {
        if (cartCountElement) { // Asegurarse que el elemento exista
            cartCountElement.textContent = cart.length;
        }
    }

    // Función para reflejar la selección del carrito en los items del menú al cargar la página
    function updateMenuSelectionStates(cart) {
        menuItems.forEach(itemElement => {
            const itemId = itemElement.dataset.id;
            // .some() verifica si al menos un elemento en el array 'cart' cumple la condición
            const isInCart = cart.some(cartItem => cartItem.id === itemId);
            if (isInCart) {
                itemElement.classList.add('selected');
            } else {
                itemElement.classList.remove('selected');
            }
        });
    }

    // --- Lógica principal al cargar la página ---
    let shoppingCart = loadCart();     // Cargar el carrito al iniciar
    updateCartCount(shoppingCart);     // Actualizar contador inicial
    updateMenuSelectionStates(shoppingCart); // Actualizar selección visual inicial de ítems

    // Añadir Event Listeners a cada item del menú
    menuItems.forEach(itemElement => {
        itemElement.addEventListener('click', () => {
            // Obtener los datos del ítem desde los data-attributes del HTML
            const itemId = itemElement.dataset.id;
            const itemName = itemElement.dataset.name;
            const itemPrice = parseFloat(itemElement.dataset.price); // Convertir a número
            const itemImgSrc = itemElement.dataset.imgSrc;

            // Obtener la descripción (más robusto por si la estructura cambia un poco)
            const itemDescriptionElement = itemElement.querySelector('.item-details .description');
            const itemDescription = itemDescriptionElement ? itemDescriptionElement.textContent : 'Descripción no disponible.';

            // Obtener la calificación (estrellas)
            const itemRatingElement = itemElement.querySelector('.item-details .rating .stars');
            const itemRating = itemRatingElement ? itemRatingElement.textContent : 'N/A';

            // Verificar si el ítem ya está en el carrito
            // .findIndex() devuelve el índice del primer elemento que cumple la condición, o -1 si no se encuentra.
            const existingItemIndex = shoppingCart.findIndex(cartItem => cartItem.id === itemId);

            if (existingItemIndex > -1) {
                // El ítem ya está en el carrito, así que lo removemos (acción de deseleccionar)
                shoppingCart.splice(existingItemIndex, 1); // Elimina 1 elemento en la posición existingItemIndex
                itemElement.classList.remove('selected');    // Quita la clase visual
            } else {
                // El ítem no está en el carrito, así que lo agregamos (acción de seleccionar)
                const newItem = {
                    id: itemId,
                    name: itemName,
                    price: itemPrice,
                    imgSrc: itemImgSrc,
                    description: itemDescription,
                    rating: itemRating,
                    quantity: 1 // Por defecto, la cantidad es 1 al agregar al carrito desde el menú
                };
                shoppingCart.push(newItem);        // Agrega el nuevo ítem al array
                itemElement.classList.add('selected'); // Añade la clase visual
            }

            saveCart(shoppingCart); // Guardar el estado actualizado del carrito en localStorage y actualizar contador
        });
    });
});