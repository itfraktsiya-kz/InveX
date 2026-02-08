// Если у вас есть отдельный файл auth.js, добавьте туда этот код
// Или объедините с script.js

// Дополнительные функции аутентификации
function checkAuthStatus() {
    const user = localStorage.getItem('startupHub_user');
    if (user) {
        appState.currentUser = JSON.parse(user);
        return true;
    }
    return false;
}

function requireAuth(redirectTo = 'home') {
    if (!appState.currentUser) {
        showNotification('Пожалуйста, войдите в систему', 'error');
        showLoginModal();
        navigateTo(redirectTo);
        return false;
    }
    return true;
}

// Инициализация аутентификации
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем статус аутентификации при загрузке
    checkAuthStatus();
    
    // Обработка защищенных страниц
    const protectedPages = ['publish', 'dashboard'];
    const currentPage = window.location.hash.substring(1) || 'home';
    
    if (protectedPages.includes(currentPage) && !appState.currentUser) {
        showNotification('Для доступа к этой странице требуется авторизация', 'error');
        showLoginModal();
        navigateTo('home');
    }
});