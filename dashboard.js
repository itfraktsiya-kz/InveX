// Функции для личного кабинета
function loadUserStartups() {
    if (!appState.currentUser) return;
    
    const userStartups = appState.startups.filter(startup => startup.author === appState.currentUser.id);
    const myStartupsGrid = document.getElementById('myStartupsGrid');
    const emptyState = document.getElementById('emptyStartupsState');
    
    if (!myStartupsGrid) return;
    
    if (userStartups.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        myStartupsGrid.innerHTML = '';
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    myStartupsGrid.innerHTML = userStartups.map(startup => `
        <div class="startup-card" data-id="${startup.id}">
            <div class="startup-image">
                ${startup.logo ? 
                    `<img src="${startup.logo}" alt="${startup.name}">` : 
                    `<i class="fas fa-rocket"></i>`
                }
            </div>
            <div class="startup-header">
                <h4 class="startup-name">${startup.name}</h4>
                <span class="startup-date">${formatDate(startup.createdAt)}</span>
            </div>
            <p class="startup-goal">${startup.goal}</p>
            <div class="startup-tags">
                <span class="tag category">${startup.category}</span>
                <span class="tag stage">${startup.stage}</span>
            </div>
            <div class="startup-actions">
                <button class="btn btn-outline btn-small edit-startup" data-id="${startup.id}">
                    <i class="fas fa-edit"></i> Редактировать
                </button>
                <button class="btn btn-text btn-small delete-startup" data-id="${startup.id}">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        </div>
    `).join('');
}

// Инициализация личного кабинета
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем стартапы пользователя при входе в кабинет
    if (appState.currentUser) {
        loadUserStartups();
    }
    
    // Обновляем личный кабинет при изменении пользователя
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'dashboardPage' && target.classList.contains('active')) {
                    loadUserStartups();
                }
            }
        });
    });
    
    const dashboardPage = document.getElementById('dashboardPage');
    if (dashboardPage) {
        observer.observe(dashboardPage, { attributes: true });
    }
});