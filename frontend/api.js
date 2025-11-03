const API_BASE_URL = 'http://localhost:8081/api';

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
}

function getCurrentUserEmail() {
    return localStorage.getItem('userEmail') || '';
}

async function registerClient(userData) {
    const response = await apiCall('/auth/register/client', 'POST', userData);

    if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userEmail', response.data.email || userData.email);
        localStorage.setItem('userRole', response.data.role || 'CLIENT');
    }

    return response;
}

async function registerAdmin(userData) {
    const response = await apiCall('/auth/register/admin', 'POST', userData);

    if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userEmail', response.data.email || userData.email);
        localStorage.setItem('userRole', response.data.role || 'ADMIN');
    }

    return response;
}

async function loginUser(email, password) {
    const response = await apiCall('/auth/login', 'POST', {
        email: email,
        password: password
    });

    if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userEmail', response.data.email || email);
        localStorage.setItem('userRole', response.data.role);
    }

    return response;
}

function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
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
    return apiCall(`/cart?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function addToCart(cartItem) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/cart/add?userEmail=${encodeURIComponent(userEmail)}`, 'POST', cartItem);
}

async function removeFromCart(itemId) {
    return apiCall(`/cart/item/${itemId}`, 'DELETE');
}

async function updateCartQuantity(itemId, quantity) {
    return apiCall(`/cart/item/${itemId}`, 'PUT', { quantity: quantity });
}

async function clearCart() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/cart/clear?userEmail=${encodeURIComponent(userEmail)}`, 'DELETE');
}

async function getFavorites() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/favorites?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function addToFavorites(favoriteData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/favorites?userEmail=${encodeURIComponent(userEmail)}`, 'POST', favoriteData);
}

async function removeFromFavorites(favoriteId) {
    return apiCall(`/favorites/${favoriteId}`, 'DELETE');
}

async function createOrder(orderData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders?userEmail=${encodeURIComponent(userEmail)}`, 'POST', orderData);
}

async function getUserOrders() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function getOrderById(orderId) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/orders/${orderId}?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
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
    return apiCall('/components/all', 'GET');
}

async function getAllOrders() {
    return apiCall('/admin/orders', 'GET');
}

async function getOrdersByStatus(status) {
    return apiCall(`/admin/orders/status/${status}`, 'GET');
}

async function getOrdersByDate(date) {
    return apiCall(`/admin/orders/date/${date}`, 'GET');
}

async function updateOrderStatus(orderId, status) {
    return apiCall(`/admin/orders/${orderId}/status`, 'PUT', { status: status });
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

async function createComponent(componentType, componentData) {
    return apiCall(`/admin/components/${componentType}`, 'POST', componentData);
}

async function updateComponentPrice(componentType, componentId, newPrice) {
    return apiCall(`/admin/components/${componentType}/${componentId}`, 'PUT', { price: newPrice });
}

async function setComponentActive(componentType, componentId, active) {
    return apiCall(`/admin/components/${componentType}/${componentId}/active`, 'PUT', { active: active });
}

async function addUserAddress(addressData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses?userEmail=${encodeURIComponent(userEmail)}`, 'POST', addressData);
}

async function getUserAddresses() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/addresses?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function deleteAddress(addressId) {
    return apiCall(`/users/addresses/${addressId}`, 'DELETE');
}

async function addPaymentMethod(paymentData) {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments?userEmail=${encodeURIComponent(userEmail)}`, 'POST', paymentData);
}

async function getUserPaymentMethods() {
    const userEmail = getCurrentUserEmail();
    return apiCall(`/users/payments?userEmail=${encodeURIComponent(userEmail)}`, 'GET');
}

async function deletePaymentMethod(paymentMethodId) {
    return apiCall(`/users/payments/${paymentMethodId}`, 'DELETE');
}