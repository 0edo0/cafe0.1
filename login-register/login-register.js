document.addEventListener('DOMContentLoaded', () => {
    const USERS_LS_KEY = 'cafeUsers'; // Clave para guardar usuarios en localStorage

    // --- FUNCIONES AUXILIARES ---
    function getUsersFromLocalStorage() {
        const usersData = localStorage.getItem(USERS_LS_KEY);
        return usersData ? JSON.parse(usersData) : [];
    }

    function saveUsersToLocalStorage(users) {
        localStorage.setItem(USERS_LS_KEY, JSON.stringify(users));
    }

    // --- MANEJO DEL FORMULARIO DE INICIO DE SESIÓN ---
    const loginForm = document.getElementById('login');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar que se envíe el formulario

            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Validación simple de campos vacíos
            if (!email || !password) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            const users = getUsersFromLocalStorage();
            const foundUser = users.find(user => user.email === email);

            if (foundUser) {
                // En una aplicación real, la contraseña se compararía hasheada.
                // Aquí es una comparación directa (NO SEGURO PARA PRODUCCIÓN).
                if (foundUser.password === password) {
                    alert('¡Inicio de sesión exitoso!');
                    // Opcional: Guardar estado de sesión del usuario
                    sessionStorage.setItem('loggedInUser', JSON.stringify({ email: foundUser.email }));
                    // Redirigir a la página principal o panel de administración
                    window.location.href = "../menuadminitracion/admiinicio.html"; // O a donde necesites
                } else {
                    alert('Contraseña incorrecta.');
                    passwordInput.value = ''; // Limpiar campo de contraseña
                    passwordInput.focus();
                }
            } else {
                alert('Usuario no encontrado. Por favor, regístrese.');
                emailInput.focus();
            }
        });
    }

    // --- MANEJO DEL FORMULARIO DE REGISTRO ---
    const registerForm = document.getElementById('register');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar que se envíe el formulario

            const emailInput = document.getElementById('register-email');
            const passwordInput = document.getElementById('register-password');
            const confirmPasswordInput = document.getElementById('confirm-password');

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Validación simple de campos vacíos
            if (!email || !password || !confirmPassword) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            // Validación de formato de email (muy básica)
            if (!email.includes('@') || !email.includes('.')) {
                alert('Por favor, ingrese un correo electrónico válido.');
                emailInput.focus();
                return;
            }

            // Validación de longitud de contraseña (ejemplo)
            if (password.length < 6) {
                alert('La contraseña debe tener al menos 6 caracteres.');
                passwordInput.focus();
                return;
            }

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                confirmPasswordInput.value = '';
                confirmPasswordInput.focus();
                return;
            }

            const users = getUsersFromLocalStorage();
            const existingUser = users.find(user => user.email === email);

            if (existingUser) {
                alert('Este correo electrónico ya está registrado. Por favor, inicie sesión o use otro correo.');
                emailInput.focus();
                return;
            }

            // Crear nuevo usuario
            // En una aplicación real, la contraseña NUNCA se guarda en texto plano.
            // Se guardaría un hash de la contraseña.
            const newUser = {
                email: email,
                password: password // ¡NO SEGURO PARA PRODUCCIÓN!
            };

            users.push(newUser);
            saveUsersToLocalStorage(users);

            alert('¡Registro exitoso! Ahora puede iniciar sesión.');
            // Opcional: Redirigir automáticamente a la página de login
            window.location.href = "login.html"; // Asegúrate que esta sea la ruta correcta a tu login.html
        });
    }
});