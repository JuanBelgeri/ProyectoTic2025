const API_BASE_URL = 'http://localhost:8080/api';

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const token = localStorage.getItem('authToken');
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        // Try to parse response as JSON
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            // If response is not JSON, return a basic error response
            responseData = {
                success: false,
                message: `HTTP Error: ${response.status} ${response.statusText}`
            };
        }

        // If response is not OK, return the error response instead of throwing
        if (!response.ok) {
            return responseData;
        }

        return responseData;

    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        // Return error response instead of throwing
        return {
            success: false,
            message: error.message || 'Error de conexión'
        };
    }
}

function getCurrentUserEmail() {
    const email = localStorage.getItem('userEmail');
    if (email) return email;
    
    // Fallback: try to get from authUser object
    try {
        const authUser = JSON.parse(localStorage.getItem('authUser') || '{}');
        return authUser.email || '';
    } catch {
        return '';
    }
}

async function registerClient(userData) {
    const response = await apiCall('/auth/register/client', 'POST', userData);

    if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', user.email || userData.email);
        localStorage.setItem('userRole', user.role || 'CLIENT');
        localStorage.setItem('authUser', JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }));
    }

    return response;
}

async function registerAdmin(userData) {
    const adminEmail = getCurrentUserEmail();
    const response = await apiCall(`/auth/register/admin?adminEmail=${encodeURIComponent(adminEmail)}`, 'POST', userData);
    return response;
}

function getCurrentUserRole() {
    return localStorage.getItem('userRole') || '';
}

function isAdmin() {
    return getCurrentUserRole() === 'ADMIN';
}

function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

async function loginUser(email, password) {
    const response = await apiCall('/auth/login', 'POST', {
        email: email,
        password: password
    });

    if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', user.email || email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('authUser', JSON.stringify({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        }));
    }

    return response;
}

function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authUser');
}

async function createPizza(pizzaData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/pizzas?userEmail=${encodeURIComponent(userEmail)}`, 'POST', pizzaData);
}

async function getUserPizzas() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/pizzas?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function getPizzaById(pizzaId) {
    return apiCall(`/pizzas/${pizzaId}`, 'GET');
}

async function deletePizza(pizzaId) {
    return apiCall(`/pizzas/${pizzaId}`, 'DELETE');
}

async function createHamburger(burgerData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/hamburgers?userEmail=${encodeURIComponent(userEmail)}`, 'POST', burgerData);
}

async function getUserHamburgers() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/hamburgers?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function getHamburgerById(burgerId) {
    return apiCall(`/hamburgers/${burgerId}`, 'GET');
}

async function deleteHamburger(burgerId) {
    return apiCall(`/hamburgers/${burgerId}`, 'DELETE');
}

async function getCart() {
    const userEmail = getCurrentUserEmail();
    const response = await apiCall(`/cart?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
    return response.success ? response.data : null;
}

async function addToCart(cartItem) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/cart/add?userEmail=${encodeURIComponent(userEmail)}`, 'POST', cartItem);
}

async function removeFromCart(itemId) {
    return apiCall(`/cart/item/${itemId}`, 'DELETE');
}

async function updateCartQuantity(itemId, quantity) {
    return apiCall(`/cart/item/${itemId}?quantity=${quantity}`, 'PUT');
}

async function clearCart() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/cart/clear?userEmail=${encodeURIComponent(userEmail)}`, 'DELETE');
}

async function getFavorites() {
    const userEmail = getCurrentUserEmail();
    const response = await apiCall(`/favorites?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
    return response.success ? response.data : [];
}

async function addToFavorites(favoriteData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/favorites?userEmail=${encodeURIComponent(userEmail)}`, 'POST', favoriteData);
}

async function removeFromFavorites(favoriteId) {
    return apiCall(`/favorites/${favoriteId}`, 'DELETE');
}

async function checkFavorite(itemType, itemId) {
    const userEmail = getCurrentUserEmail();
    const response = await apiCall(`/favorites/check?userEmail=${encodeURIComponent(userEmail)}&itemType=${itemType}&itemId=${itemId}`, 'GET');
    return response.success ? response.data : false;
}

async function removeFavoriteByItem(itemType, itemId) {
    // First get all favorites to find the one with matching itemType and itemId
    const favorites = await getFavorites();
    const favorite = favorites.find(f => f.itemType === itemType && f.itemId === itemId);
    if (favorite) {
        return await removeFromFavorites(favorite.id);
    }
    return { success: false, message: 'Favorite not found' };
}

async function createOrder(orderData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders?userEmail=${encodeURIComponent(userEmail)}`, 'POST', orderData);
}

async function cancelOrder(orderId) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders/${orderId}/cancel?userEmail=${encodeURIComponent(userEmail)}`, 'POST');
}

async function getUserOrders() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function getOrderById(orderId) {
    return apiCall(`/orders/${orderId}`, 'GET');
}

async function cancelOrder(orderId) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders/${orderId}/cancel?userEmail=${encodeURIComponent(userEmail)}`, 'POST');
}

async function getPizzaSizes() {
    return apiCall('/components/pizza-sizes', 'GET');
}

async function getDoughTypes() {
    return apiCall('/components/dough-types', 'GET');
}

async function getSauces() {
    return apiCall('/components/sauce-types', 'GET');
}

async function getCheeses() {
    return apiCall('/components/cheese-types', 'GET');
}

async function getVegetables() {
    return apiCall('/components/toppings', 'GET');
}

async function getMeatToppings() {
    return apiCall('/components/toppings', 'GET');
}

async function getBreadTypes() {
    return apiCall('/components/bread-types', 'GET');
}

async function getMeatTypes() {
    return apiCall('/components/meat-types', 'GET');
}

async function getToppings() {
    return apiCall('/components/toppings', 'GET');
}

async function getCondiments() {
    return apiCall('/components/condiments', 'GET');
}

async function getAllComponents() {
    const response = await apiCall('/components/all', 'GET');
    return response.success ? response.data : {};
}

async function getAllOrders() {
    const response = await apiCall('/orders/admin/all', 'GET');
    return response.success ? response.data : [];
}

async function getOrdersByStatus(status) {
    const response = await apiCall(`/orders/admin/status/${status}`, 'GET');
    return response.success ? response.data : [];
}

async function getOrdersByDate(date) {
    const response = await apiCall(`/orders/admin/date/${date}`, 'GET');
    return response.success ? response.data : [];
}

async function updateOrderStatus(orderId, status) {
    return apiCall(`/orders/admin/${orderId}/status`, 'PUT', { status: status });
}

async function createComponent(componentType, componentData) {
    return apiCall(`/admin/components/${componentType}`, 'POST', componentData);
}

async function updateComponent(componentType, componentId, updateData) {
    return apiCall(`/admin/components/${componentType}/${componentId}`, 'PUT', updateData);
}

async function deleteComponent(componentType, componentId) {
    return apiCall(`/admin/components/${componentType}/${componentId}`, 'DELETE');
}

async function getUserStats() {
    return apiCall('/admin/users/stats', 'GET');
}

async function getAllUsers() {
    return apiCall('/admin/users', 'GET');
}

async function setUserActive(userId, active) {
    return apiCall(`/admin/users/${userId}/active`, 'PUT', { active: active });
}

async function addUserAddress(addressData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses?userEmail=${encodeURIComponent(userEmail)}`, 'POST', addressData);
}

async function getUserAddresses() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function createAddress(addressData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses?userEmail=${encodeURIComponent(userEmail)}`, 'POST', addressData);
}

async function updateAddress(addressId, addressData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses/${addressId}?userEmail=${encodeURIComponent(userEmail)}`, 'PUT', addressData);
}

async function deleteAddress(addressId) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses/${addressId}?userEmail=${encodeURIComponent(userEmail)}`, 'DELETE');
}

async function addPaymentMethod(paymentData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments?userEmail=${encodeURIComponent(userEmail)}`, 'POST', paymentData);
}

async function getUserPaymentMethods() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function updatePaymentMethod(paymentMethodId, paymentData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments/${paymentMethodId}?userEmail=${encodeURIComponent(userEmail)}`, 'PUT', paymentData);
}

async function deletePaymentMethod(paymentMethodId) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments/${paymentMethodId}?userEmail=${encodeURIComponent(userEmail)}`, 'DELETE');
}