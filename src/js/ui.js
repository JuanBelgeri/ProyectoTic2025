
function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}


function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}


async function updateCartBadge() {
    const cartLink = document.getElementById('cart-link');
    const mobileCartLink = document.getElementById('mobile-cart-link');
    const cartBadge = document.getElementById('cart-badge');
    
    // Note: Admins only access home.html and admin.html, so this function
    // is only called for client pages where admins never log in
    
    if (!isLoggedIn()) {
        if (cartLink) cartLink.classList.add('hidden');
        if (mobileCartLink) mobileCartLink.classList.add('hidden');
        return;
    }
    
    if (!cartLink && !mobileCartLink) return;

    try {
        const cartData = await getCart();
        if (cartData && cartData.totalItems > 0) {
            if (cartLink) cartLink.classList.remove('hidden');
            if (mobileCartLink) mobileCartLink.classList.remove('hidden');
            if (cartBadge) {
                cartBadge.textContent = cartData.totalItems > 9 ? '9+' : cartData.totalItems;
                cartBadge.classList.remove('hidden');
            }
        } else {
            if (cartLink) cartLink.classList.remove('hidden');
            if (mobileCartLink) mobileCartLink.classList.remove('hidden');
            if (cartBadge) cartBadge.classList.add('hidden');
        }
    } catch (error) {
        if (cartLink) cartLink.classList.remove('hidden');
        if (mobileCartLink) mobileCartLink.classList.remove('hidden');
        if (cartBadge) cartBadge.classList.add('hidden');
    }
}


/**
 * Updates the user profile dropdown menu based on user role.
 * For admins on home.html: Hide all client options, show only logout.
 * For clients on all pages: Show all client options.
 */
function updateDropdownForRole() {
    const dropdownOrders = document.getElementById('dropdown-orders');
    const dropdownFavorites = document.getElementById('dropdown-favorites');
    const dropdownAddresses = document.getElementById('dropdown-addresses');
    const dropdownPayments = document.getElementById('dropdown-payments');
    const dropdownDivider = document.getElementById('dropdown-divider');
    
    if (!dropdownOrders || !dropdownFavorites || !dropdownAddresses || !dropdownPayments) return;
    
    // Check if user is admin (only relevant for home.html)
    const userIsAdmin = isLoggedIn() && typeof isAdmin === 'function' && isAdmin();
    
    if (userIsAdmin) {
        // Admin on home.html: Hide all client options, only show logout
        dropdownOrders.classList.add('hidden');
        dropdownFavorites.classList.add('hidden');
        dropdownAddresses.classList.add('hidden');
        dropdownPayments.classList.add('hidden');
        if (dropdownDivider) dropdownDivider.classList.add('hidden');
    } else {
        // Client: Show all client options
        dropdownOrders.classList.remove('hidden');
        dropdownFavorites.classList.remove('hidden');
        dropdownAddresses.classList.remove('hidden');
        dropdownPayments.classList.remove('hidden');
        if (dropdownDivider) dropdownDivider.classList.remove('hidden');
    }
}


/**
 * Updates navigation buttons based on login status.
 * Note: Admin logic is only needed for home.html (the only page admins access besides admin.html).
 * For all other pages, admins never log in, so client logic is always shown.
 */
function updateNavButtons() {
    const navBtn = document.getElementById('nav-auth-btn');
    const mobileBtn = document.getElementById('mobile-auth-btn');
    const mobileCartLink = document.getElementById('mobile-cart-link');
    const cartLink = document.getElementById('cart-link');
    const builderLink = document.getElementById('builder-link');
    const mobileBuilderLink = document.getElementById('mobile-builder-link');
    const heroBuilderLink = document.getElementById('hero-builder-link');
    const sectionBuilderLink = document.getElementById('section-builder-link');
    const adminPanelLink = document.getElementById('admin-panel-link');
    const userProfileMenu = document.getElementById('user-profile-menu');
    const navAuthBtn = document.getElementById('nav-auth-btn');

    // If no navigation buttons, just update login button state (simpler pages)
    if (!navBtn && !mobileBtn) {
        // Fallback: update login button if it exists
        const btn = document.getElementById('nav-auth-btn');
        if (btn && userProfileMenu) {
            if (isLoggedIn()) {
                userProfileMenu.classList.remove('hidden');
                btn.classList.add('hidden');
                updateCartBadge();
            } else {
                userProfileMenu.classList.add('hidden');
                btn.classList.remove('hidden');
                btn.textContent = 'Ingresar';
                if (cartLink) cartLink.classList.add('hidden');
            }
        }
        return;
    }

    // Always hide admin panel link first, then show if needed (only for home.html)
    if (adminPanelLink) adminPanelLink.classList.add('hidden');

    // Check if user is logged in
    const loggedIn = isLoggedIn();
    
    // Check if user is admin (only relevant for home.html, admins don't access other pages)
    let userIsAdmin = false;
    if (loggedIn && adminPanelLink) { // Only check if admin panel link exists (home.html)
        try {
            userIsAdmin = typeof isAdmin === 'function' && isAdmin();
        } catch (e) {
            console.error('Error checking admin status:', e);
        }
    }

    if (loggedIn) {
        if (navBtn) navBtn.textContent = 'Cerrar sesión';
        if (mobileBtn) mobileBtn.textContent = 'Cerrar sesión';
        
        // Show user profile menu, hide auth button
        if (userProfileMenu) userProfileMenu.classList.remove('hidden');
        if (navAuthBtn) navAuthBtn.classList.add('hidden');
        
        // Admin logic only applies to home.html (where adminPanelLink exists)
        if (userIsAdmin && adminPanelLink) {
            // Admin on home.html: Hide client features, show admin features
            if (mobileCartLink) mobileCartLink.classList.add('hidden');
            if (cartLink) cartLink.classList.add('hidden');
            if (builderLink) builderLink.classList.add('hidden');
            if (mobileBuilderLink) mobileBuilderLink.classList.add('hidden');
            if (heroBuilderLink) heroBuilderLink.classList.add('hidden');
            if (sectionBuilderLink) sectionBuilderLink.classList.add('hidden');
            
            if (adminPanelLink) adminPanelLink.classList.remove('hidden');
            // Update dropdown to hide client options for admin
            updateDropdownForRole();
        } else {
            // Client: Show client features (admins don't access other pages)
            if (mobileCartLink) mobileCartLink.classList.remove('hidden');
            if (cartLink) cartLink.classList.remove('hidden');
            if (builderLink) builderLink.classList.remove('hidden');
            if (mobileBuilderLink) mobileBuilderLink.classList.remove('hidden');
            if (heroBuilderLink) heroBuilderLink.classList.remove('hidden');
            if (sectionBuilderLink) sectionBuilderLink.classList.remove('hidden');
            
            // Admin panel link already hidden above
            updateCartBadge();
        }
        // Update dropdown menu based on role (important for admins on home.html)
        updateDropdownForRole();
    } else {
        // Not logged in: Hide everything except builder links
        if (navBtn) navBtn.textContent = 'Ingresar';
        if (mobileBtn) mobileBtn.textContent = 'Ingresar';
        if (mobileCartLink) mobileCartLink.classList.add('hidden');
        if (cartLink) cartLink.classList.add('hidden');
        // Admin panel link already hidden above
        
        // Hide user profile menu, show auth button
        if (userProfileMenu) userProfileMenu.classList.add('hidden');
        if (navAuthBtn) navAuthBtn.classList.remove('hidden');
        
        // Builder links should be visible when not logged in
        if (builderLink) builderLink.classList.remove('hidden');
        if (mobileBuilderLink) mobileBuilderLink.classList.remove('hidden');
        if (heroBuilderLink) heroBuilderLink.classList.remove('hidden');
        if (sectionBuilderLink) sectionBuilderLink.classList.remove('hidden');
    }
}


function initNavigation() {
    // Auth button handlers
    const navAuthBtn = document.getElementById('nav-auth-btn');
    if (navAuthBtn) {
        navAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                logoutUser();
                setTimeout(() => {
                    updateNavButtons();
                }, 0);
            } else {
                openAuthModal();
            }
        });
    }

    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    if (mobileAuthBtn) {
        mobileAuthBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                logoutUser();
                setTimeout(() => {
                    updateNavButtons();
                }, 0);
            } else {
                openAuthModal();
            }
        });
    }

    // User profile dropdown toggle
    const userProfileBtn = document.getElementById('user-profile-btn');
    const userProfileDropdown = document.getElementById('user-profile-dropdown');
    const profileLogoutBtn = document.getElementById('profile-logout-btn');
    
    if (userProfileBtn && userProfileDropdown) {
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Update dropdown based on user role (admins on home.html only see logout)
            updateDropdownForRole();
            userProfileDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userProfileDropdown.contains(e.target)) {
                userProfileDropdown.classList.add('hidden');
            }
        });
    }
    
    if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
            setTimeout(() => {
                updateNavButtons();
                // Determine correct path based on current page location
                const currentPath = window.location.pathname;
                if (currentPath.includes('/admin/')) {
                    window.location.href = '../home.html';
                } else if (currentPath.includes('/user/') || currentPath.includes('/builder/')) {
                    window.location.href = '../home.html';
                } else {
                    window.location.href = 'home.html';
                }
            }, 0);
        });
    }
}


function initAuthModal() {
    const authModal = document.getElementById('auth-modal');
    if (!authModal) return;

    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    const authClose = document.getElementById('auth-close');

    if (tabLogin && tabRegister && formLogin && formRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.className = 'px-3 py-1 rounded-md bg-primary text-white text-sm font-semibold';
            tabRegister.className = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-semibold';
            formLogin.classList.remove('hidden');
            formRegister.classList.add('hidden');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.className = 'px-3 py-1 rounded-md bg-primary text-white text-sm font-semibold';
            tabLogin.className = 'px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-semibold';
            formRegister.classList.remove('hidden');
            formLogin.classList.add('hidden');
        });

        if (authClose) {
            authClose.addEventListener('click', closeAuthModal);
        }

        authModal.addEventListener('click', (e) => {
            if (e.target.id === 'auth-modal') closeAuthModal();
        });
    }
}


function initAuthLoginForm() {
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email')?.value.trim();
            const password = document.getElementById('login-password')?.value.trim();
            const errorElement = document.getElementById('login-error');
            const submitBtn = document.getElementById('login-submit-btn');

            if (!email || !password) {
                if (errorElement) {
                    errorElement.textContent = 'Por favor completa todos los campos';
                    errorElement.classList.remove('hidden');
                }
                return;
            }

            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Ingresando...';
                }
                if (errorElement) errorElement.classList.add('hidden');

                const response = await loginUser(email, password);

                if (response.success) {
                    if (formLogin) formLogin.reset();
                    if (submitBtn) {
                        submitBtn.textContent = 'Ingresar';
                        submitBtn.disabled = false;
                    }
                    closeAuthModal();
                    updateNavButtons();
                } else {
                    if (errorElement) {
                        errorElement.textContent = response.message || 'Error al ingresar';
                        errorElement.classList.remove('hidden');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Ingresar';
                    }
                }
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = 'Credenciales inválidas o error de conexión';
                    errorElement.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Ingresar';
                }
            }
        });
    }
}

function initAuthRegisterForm() {
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();

            const firstName = document.getElementById('reg-firstName')?.value.trim();
            const lastName = document.getElementById('reg-lastName')?.value.trim();
            const document_val = document.getElementById('reg-document')?.value.trim();
            const birthDate = document.getElementById('reg-birthDate')?.value.trim();
            const phone = document.getElementById('reg-phone')?.value.trim();
            const email = document.getElementById('reg-email')?.value.trim();
            const street = document.getElementById('reg-street')?.value.trim();
            const number = document.getElementById('reg-number')?.value.trim();
            const apartment = document.getElementById('reg-apartment')?.value.trim() || '';
            const city = document.getElementById('reg-city')?.value.trim();
            const postalCode = document.getElementById('reg-postalCode')?.value.trim();
            const addressAdditionalInfo = document.getElementById('reg-addressAdditionalInfo')?.value.trim() || '';
            const paymentType = document.getElementById('reg-paymentType')?.value.trim();
            const cardHolder = document.getElementById('reg-cardHolder')?.value.trim();
            const cardNumber = document.getElementById('reg-cardNumber')?.value.trim();
            const expirationDate = document.getElementById('reg-expirationDate')?.value.trim();
            const password = document.getElementById('reg-password')?.value.trim();

            const errorElement = document.getElementById('register-error');
            const submitBtn = document.getElementById('register-submit-btn');

            if (!firstName || !lastName || !document_val || !birthDate || !phone || !email || !street || !number || !city || !postalCode || !paymentType || !cardHolder || !cardNumber || !expirationDate || password.length < 8) {
                if (errorElement) {
                    errorElement.textContent = 'Por favor completa todos los campos requeridos';
                    errorElement.classList.remove('hidden');
                }
                return;
            }

            const userData = {
                firstName: firstName,
                lastName: lastName,
                document: document_val,
                birthDate: birthDate,
                phone: phone,
                email: email,
                street: street,
                number: number,
                apartment: apartment,
                city: city,
                postalCode: postalCode,
                addressAdditionalInfo: addressAdditionalInfo,
                paymentType: paymentType,
                cardNumber: cardNumber,
                cardHolder: cardHolder,
                expirationDate: expirationDate,
                password: password,
            };

            try {
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Creando cuenta...';
                }
                if (errorElement) errorElement.classList.add('hidden');

                const response = await registerClient(userData);

                if (response.success) {
                    if (formRegister) formRegister.reset();
                    if (submitBtn) {
                        submitBtn.textContent = 'Crear cuenta';
                        submitBtn.disabled = false;
                    }
                    closeAuthModal();
                    updateNavButtons();
                    if (typeof showToast === 'function') {
                        showToast('¡Cuenta creada exitosamente!', 'success');
                    } else {
                        alert('¡Cuenta creada exitosamente!');
                    }
                } else {
                    if (errorElement) {
                        errorElement.textContent = response.message || 'Error al crear cuenta';
                        errorElement.classList.remove('hidden');
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Crear cuenta';
                    }
                }
            } catch (error) {
                if (errorElement) {
                    errorElement.textContent = 'Error al crear cuenta: ' + (error.message || 'Error de conexión');
                    errorElement.classList.remove('hidden');
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Crear cuenta';
                }
            }
        });
    }
}

function initUI() {
    initNavigation();
    initAuthModal();
    initAuthLoginForm();
    initAuthRegisterForm();

    // Update navigation state after a brief delay to ensure api.js is loaded
    setTimeout(() => {
        updateNavButtons();
    }, 0);
}

