// Authentication utility functions

function isLoggedIn() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

