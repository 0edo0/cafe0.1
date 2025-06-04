document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DEL DOM ---
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle'); // Botón en la sidebar
    const sidebarToggleMain = document.getElementById('sidebarToggleMain'); // Botón en el main content
    const mainContent = document.getElementById('mainContent');
    const menuProductCategoriesContainer = document.getElementById('menuProductCategories');

    // --- DATOS DEL MENÚ (Desde localStorage) ---
    // Usaremos una clave similar a la del carrito, pero para los productos del menú en sí.
    // Si ya tienes una forma de guardar los productos del menú para `menu.html`, usa esa misma clave.
    // Por ahora, asumiré que los productos se guardan en un array bajo la clave 'menuProducts'.
    // Y que cada producto tiene: id, name, price, imgSrc, description, category, rating.
    const MENU_PRODUCTS_LS_KEY = 'menuProducts'; // Clave para localStorage

    let menuProducts = loadMenuProducts(); // Cargar productos al iniciar

    // --- FUNCIONALIDAD DE LA SIDEBAR ---
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 480;
        if (isMobile) {
            sidebar.classList.toggle('open'); // Para superposición en móvil
        } else {
            sidebar.classList.toggle('collapsed');
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    if (sidebarToggleMain) {
        sidebarToggleMain.addEventListener('click', toggleSidebar);
    }

    // --- CARGA Y VISUALIZACIÓN DE PRODUCTOS DEL MENÚ ---

    // Función para cargar productos desde localStorage
    function loadMenuProducts() {
        const productsData = localStorage.getItem(MENU_PRODUCTS_LS_KEY);
        // Si no hay productos, devolvemos un array de ejemplo para que veas cómo funciona.
        // En una aplicación real, esto vendría de una base de datos o estaría vacío.
        if (!productsData || JSON.parse(productsData).length === 0) {
            console.warn("No se encontraron productos en localStorage. Usando datos de ejemplo.");
            // Datos de ejemplo si localStorage está vacío o no tiene 'menuProducts'
            return [
                { id: 'espresso-01', name: 'Espresso', price: 2.50, imgSrc: 'https://raw.githubusercontent.com/0edo0/imagnes_aplicacion_wed/refs/heads/main/menu/cafes/expreso_i.png', description: 'Un café concentrado y fuerte.', category: 'cafes', rating: '★★★★★' },
                { id: 'americano-02', name: 'Café americano', price: 3.00, imgSrc: 'https://raw.githubusercontent.com/0edo0/imagnes_aplicacion_wed/refs/heads/main/menu/cafes/cafe_americano.png', description: 'Espresso diluido con agua caliente.', category: 'cafes', rating: '★★★★☆' },
                { id: 'torta-choco-03', name: 'Torta de Chocolate', price: 5.00, imgSrc: 'https://raw.githubusercontent.com/0edo0/imagnes_aplicacion_wed/refs/heads/main/menu/tortas/tortade%20chocolate.png', description: 'Deliciosa torta de chocolate.', category: 'tortas', rating: '★★★★★' },
                { id: 'sandwich-pavo-04', name: 'Sandwich de Pavo', price: 4.50, imgSrc: 'https://raw.githubusercontent.com/0edo0/imagnes_aplicacion_wed/refs/heads/main/menu/sandwuches/sandwich%20de%20pavo.png', description: 'Sandwich de pavo y vegetales.', category: 'sandwiches', rating: '★★★★☆' },
                { id: 'jugo-naranja-05', name: 'Jugo de Naranja', price: 3.20, imgSrc: 'https://raw.githubusercontent.com/0edo0/imagnes_aplicacion_wed/refs/heads/main/menu/bebidas/jugo%20de%20maracuya.png', description: 'Jugo de naranja natural y refrescante.', category: 'bebidas', rating: '★★★★★' }
            ];
        }
        return JSON.parse(productsData);
    }

    // Función para guardar productos en localStorage (la usarás más adelante con el CRUD)
    function saveMenuProducts(products) {
        localStorage.setItem(MENU_PRODUCTS_LS_KEY, JSON.stringify(products));
    }

    // Función para renderizar los productos en el DOM
    function renderMenuProducts() {
        if (!menuProductCategoriesContainer) return;
        menuProductCategoriesContainer.innerHTML = ''; // Limpiar contenedor

        // Agrupar productos por categoría
        const productsByCategory = menuProducts.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});

        // Capitalizar nombres de categoría para mostrar (puedes tener un mapeo más elegante)
        const categoryDisplayNames = {
            cafes: "Cafés",
            bebidas: "Bebidas",
            tortas: "Tortas",
            sandwiches: "Sandwiches"
        };

        // Iterar sobre las categorías y crear los bloques
        for (const categoryKey in productsByCategory) {
            if (productsByCategory.hasOwnProperty(categoryKey)) {
                const categoryName = categoryDisplayNames[categoryKey] || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
                const products = productsByCategory[categoryKey];

                const categoryBlock = document.createElement('div');
                categoryBlock.classList.add('category-block');
                categoryBlock.innerHTML = `<h3>${categoryName}</h3>`;

                const productsGrid = document.createElement('div');
                productsGrid.classList.add('products-grid');
                productsGrid.id = `products-${categoryKey}`; // ID para posible referencia futura

                products.forEach(product => {
                    const productCard = document.createElement('article');
                    productCard.classList.add('product-card-admin');
                    productCard.dataset.productId = product.id; // Guardar ID en el elemento

                    // Limitar descripción para la tarjeta
                    const shortDescription = product.description.length > 60
                        ? product.description.substring(0, 57) + "..."
                        : product.description;

                    productCard.innerHTML = `
                        <img src="${product.imgSrc}" alt="${product.name}">
                        <div class="product-info-admin">
                            <h4>${product.name}</h4>
                            <p class="price">S/ ${parseFloat(product.price).toFixed(2)}</p>
                            <p class="description-admin-card">${shortDescription}</p>
                            <!-- Podrías mostrar el rating si lo tienes:
                            <p class="rating-admin-card">Rating: ${product.rating || 'N/A'}</p>
                            -->
                        </div>
                        <div class="product-actions-admin">
                            <button class="btn btn-edit" data-id="${product.id}">Editar</button>
                            <button class="btn btn-delete" data-id="${product.id}">Eliminar</button>
                        </div>
                    `;
                    productsGrid.appendChild(productCard);
                });

                categoryBlock.appendChild(productsGrid);
                menuProductCategoriesContainer.appendChild(categoryBlock);
            }
        }
    }

    // --- INICIALIZACIÓN ---
    renderMenuProducts(); // Mostrar los productos al cargar la página


    // --- (Aquí irá la lógica del Formulario CRUD y Previsualización de Imagen más adelante) ---

});