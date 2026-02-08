// ==================== ОСНОВНЫЕ ПЕРЕМЕННЫЕ И СОСТОЯНИЕ ====================
const appState = {
    currentUser: null,
    startups: [],
    filteredStartups: [],
    currentPage: 'home',
    theme: 'dark',
    language: 'ru',
    categories: ['IT', 'AI', 'FinTech', 'EdTech', 'Health', 'Eco', 'Ecommerce', 'Other'],
    stages: ['idea', 'mvp', 'beta', 'ready', 'scaling'],
    isSidebarCollapsed: false,
    drafts: [],
    mentors: [],
    currentPageNumber: 1,
    startupsPerPage: 12,
    courses: {
        ru: [],
        en: []
    }
};

// ==================== DOM ЭЛЕМЕНТЫ ====================
let sidebar;
let mainContent;
let sidebarToggle;
let navLinks;
let pages;
let pageTitle;
let themeToggle;
let languageSelect;
let searchInput;
let searchBox;
let authButtons;
let userMenu;
let loginBtn;
let registerBtn;
let logoutBtn;
let userEmail;
let authModal;
let authModalClose;
let startupDetailModal;
let modalDetailClose;
let collapsedMenuButton;
let sidebarOverlay;
let menuToggle;
let headerUserName;
let userNameDisplay;

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация приложения...');
    initApp();
    loadStartups();
    loadCourses();
    loadMentors();
    setupEventListeners();
    updateUI();
    
    // Для мобильных устройств
    if ('ontouchstart' in window) {
        setupTouchEvents();
    }
});

// ==================== УПРАВЛЕНИЕ МОБИЛЬНОЙ НАВИГАЦИЕЙ ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    
    if (menuToggle && sidebar && sidebarOverlay) {
        // Открытие/закрытие sidebar на мобильных
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
            document.body.classList.add('sidebar-open');
        });
        
        // Закрытие sidebar через overlay
        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
        
        // Закрытие sidebar кнопкой внутри sidebar (если есть)
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.remove('active');
                sidebarOverlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            });
        }
        
        // Закрытие sidebar при нажатии на ссылку внутри него (опционально)
        const navLinks = sidebar.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 1024) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        });
    }
});

// ==================== НАСТРОЙКА ОБРАБОТЧИКОВ ДЛЯ КАСАНИЙ ====================
function setupTouchEvents() {
    document.addEventListener('touchstart', function(e) {
        if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('.nav-link')) {
            e.target.style.webkitTapHighlightColor = 'rgba(255, 122, 0, 0.1)';
        }
    }, { passive: true });
}

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ====================
function initApp() {
    // Получаем DOM элементы
    sidebar = document.getElementById('sidebar');
    mainContent = document.getElementById('mainContent');
    sidebarToggle = document.getElementById('sidebarToggle');
    navLinks = document.querySelectorAll('.nav-link');
    pages = document.querySelectorAll('.page');
    pageTitle = document.getElementById('pageTitle');
    themeToggle = document.getElementById('themeToggle');
    languageSelect = document.getElementById('languageSelect');
    searchInput = document.getElementById('searchInput');
    searchBox = document.getElementById('searchBox');
    authButtons = document.getElementById('authButtons');
    userMenu = document.getElementById('userMenu');
    loginBtn = document.getElementById('loginBtn');
    registerBtn = document.getElementById('registerBtn');
    logoutBtn = document.getElementById('logoutBtn');
    userEmail = document.getElementById('userEmail');
    authModal = document.getElementById('authModal');
    authModalClose = document.getElementById('authModalClose');
    startupDetailModal = document.getElementById('startupDetailModal');
    modalDetailClose = document.getElementById('modalDetailClose');
    menuToggle = document.getElementById('menuToggle');
    headerUserName = document.getElementById('headerUserName');
    userNameDisplay = document.getElementById('userNameDisplay');
    collapsedMenuButton = document.getElementById('collapsedMenuButton');
    sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Проверяем сохранённого пользователя
    const savedUser = localStorage.getItem('startupHub_user');
    if (savedUser) {
        try {
            appState.currentUser = JSON.parse(savedUser);
            console.log('Загружен пользователь:', appState.currentUser);
        } catch (e) {
            console.error('Ошибка загрузки пользователя:', e);
            localStorage.removeItem('startupHub_user');
        }
    }
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('startupHub_theme');
    if (savedTheme) {
        appState.theme = savedTheme;
        document.body.setAttribute('data-theme', savedTheme);
        updateThemeIcon();
    }
    
    // Проверяем сохранённый язык
    const savedLanguage = localStorage.getItem('startupHub_language') || 'ru';
    if (savedLanguage) {
        appState.language = savedLanguage;
        if (languageSelect) languageSelect.value = savedLanguage;
    }
    
    // Проверяем состояние боковой панели
    const savedSidebarState = localStorage.getItem('startupHub_sidebar_collapsed');
    if (savedSidebarState === 'true') {
        appState.isSidebarCollapsed = true;
        if (sidebar) sidebar.classList.add('collapsed');
        if (mainContent) mainContent.classList.add('full-width');
    }
    
    // Настройка начального состояния для мобильных
    if (window.innerWidth <= 1024) {
        closeSidebar();
        if (menuToggle) menuToggle.style.display = 'flex';
    } else {
        if (menuToggle) menuToggle.style.display = 'none';
    }
    
    updateCollapsedMenuButton();
    
    // Обработка изменения размера окна
    window.addEventListener('resize', handleResize);
}

// ==================== ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА ====================
function handleResize() {
    if (window.innerWidth > 1024) {
        if (menuToggle) menuToggle.style.display = 'none';
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    } else {
        if (menuToggle) menuToggle.style.display = 'flex';
    }
    
    updateCollapsedMenuButton();
}

// ==================== ПЕРЕКЛЮЧЕНИЕ БОКОВОЙ ПАНЕЛИ ====================
function toggleSidebar() {
    if (window.innerWidth <= 1024) {
        if (sidebar.classList.contains('collapsed')) {
            openSidebar();
        } else {
            closeSidebar();
        }
    } else {
        if (sidebar.classList.contains('collapsed')) {
            openSidebar();
            localStorage.setItem('startupHub_sidebar_collapsed', 'false');
        } else {
            closeSidebar();
            localStorage.setItem('startupHub_sidebar_collapsed', 'true');
        }
    }
}

// ==================== ФУНКЦИЯ ОТКРЫТИЯ САЙДБАРА ====================
function openSidebar() {
    if (sidebar) sidebar.classList.remove('collapsed');
    if (mainContent) mainContent.classList.remove('full-width');
    appState.isSidebarCollapsed = false;
    
    if (window.innerWidth <= 1024) {
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.classList.add('sidebar-open');
    }
    
    updateCollapsedMenuButton();
}

// ==================== ФУНКЦИЯ ЗАКРЫТИЯ САЙДБАРА ====================
function closeSidebar() {
    if (sidebar) sidebar.classList.add('collapsed');
    if (mainContent) mainContent.classList.add('full-width');
    appState.isSidebarCollapsed = true;
    
    if (window.innerWidth <= 1024) {
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
    
    updateCollapsedMenuButton();
}

// ==================== ОБНОВЛЕНИЕ КНОПКИ СКРЫТОГО МЕНЮ ====================
function updateCollapsedMenuButton() {
    if (!collapsedMenuButton) return;
    
    if (sidebar && sidebar.classList.contains('collapsed') && window.innerWidth > 1024) {
        collapsedMenuButton.style.display = 'flex';
    } else {
        collapsedMenuButton.style.display = 'none';
    }
}

// ==================== НАСТРОЙКА ОБРАБОТЧИКОВ СОБЫТИЙ ====================
function setupEventListeners() {
    // Переключение боковой панели
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    if (collapsedMenuButton) {
        collapsedMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            openSidebar();
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar();
        });
    }
    
    // Навигация
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
            
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });
    
    // Переключение темы
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Смена языка
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Поиск
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Аутентификация
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showLoginModal();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showRegisterModal();
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
    
    if (authModalClose) {
        authModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            hideAuthModal();
        });
    }
    
    if (modalDetailClose) {
        modalDetailClose.addEventListener('click', function(e) {
            e.preventDefault();
            hideStartupDetailModal();
        });
    }
    
    // Клик вне модального окна
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            hideAuthModal();
        }
        if (e.target === startupDetailModal) {
            hideStartupDetailModal();
        }
    });
    
    // Формы аутентификации
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin(e);
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister(e);
        });
    }
    
    // Форма публикации стартапа
    const startupForm = document.getElementById('startupForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    
    if (startupForm) {
        startupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleStartupSubmit(e);
        });
    }
    
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveDraft();
        });
    }
    
    // Фильтры в каталоге
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }
    
    // Кнопки на главной
    const exploreStartupsBtn = document.getElementById('exploreStartupsBtn');
    const publishStartupBtn = document.getElementById('publishStartupBtn');
    const viewAllStartups = document.getElementById('viewAllStartups');
    
    if (exploreStartupsBtn) {
        exploreStartupsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('catalog');
        });
    }
    
    if (publishStartupBtn) {
        publishStartupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (appState.currentUser) {
                navigateTo('publish');
            } else {
                showLoginModal();
            }
        });
    }
    
    if (viewAllStartups) {
        viewAllStartups.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('catalog');
        });
    }
    
    // Обработка вкладок аутентификации
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Кнопка "Стать ментором"
    const becomeMentorBtn = document.getElementById('becomeMentorBtn');
    if (becomeMentorBtn) {
        becomeMentorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            becomeMentor();
        });
    }
    
    // Пагинация
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changePage(-1);
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changePage(1);
        });
    }
    
    // Кнопки фильтров курсов
    document.querySelectorAll('.course-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            filterCourses(lang);
        });
    });
    
    // Настройка динамических обработчиков
    setupDynamicEventListeners();
    
    // Настройка обработчиков личного кабинета
    setupDashboardListeners();
    
    // Обработчики для карточек обучения
    setupLearningCardListeners();
    
    // Telegram бот кнопка
    const telegramBotLink = document.getElementById('telegramBotLink');
    if (telegramBotLink) {
        telegramBotLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://t.me/EduSratup_bot', '_blank');
        });
    }
    
    // Кнопка AI-рекомендаций
    const getRecommendationsBtn = document.getElementById('getRecommendationsBtn');
    if (getRecommendationsBtn) {
        getRecommendationsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            getAIRecommendations();
        });
    }
    
    // Добавляем обработчики для кнопок, которые могли быть созданы динамически
    setTimeout(() => {
        bindAllButtons();
    }, 500);
}

// ==================== ПРИВЯЗКА ВСЕХ КНОПОК ====================
function bindAllButtons() {
    // Кнопки лайков
    document.querySelectorAll('.interaction-btn.like').forEach(btn => {
        if (!btn.dataset.bound) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const startupId = this.closest('.startup-card')?.getAttribute('data-id');
                if (startupId) {
                    toggleLike(startupId, this);
                }
            });
            btn.dataset.bound = 'true';
        }
    });
    
    // Карточки стартапов
    document.querySelectorAll('.startup-card').forEach(card => {
        if (!card.dataset.bound) {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.interaction-btn')) {
                    const startupId = this.getAttribute('data-id');
                    if (startupId) {
                        showStartupDetailModal(startupId);
                    }
                }
            });
            card.dataset.bound = 'true';
        }
    });
    
    // Кнопки редактирования/удаления в личном кабинете
    document.querySelectorAll('.edit-startup, .delete-startup').forEach(btn => {
        if (!btn.dataset.bound) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const startupId = this.getAttribute('data-id');
                if (startupId) {
                    if (this.classList.contains('edit-startup')) {
                        editStartup(startupId);
                    } else if (this.classList.contains('delete-startup')) {
                        deleteStartup(startupId);
                    }
                }
            });
            btn.dataset.bound = 'true';
        }
    });
    
    // Кнопки вкладок личного кабинета
    document.querySelectorAll('.dashboard-menu-btn').forEach(btn => {
        if (!btn.dataset.bound) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const tabName = this.getAttribute('data-tab');
                switchDashboardTab(tabName);
            });
            btn.dataset.bound = 'true';
        }
    });
    
    // Карточки обучения
    document.querySelectorAll('.learning-card').forEach(card => {
        if (!card.dataset.bound) {
            card.addEventListener('click', function() {
                const stage = this.getAttribute('data-stage');
                openLearningStage(stage);
            });
            card.dataset.bound = 'true';
        }
    });
    
    // Карточки курсов
    document.querySelectorAll('.course-card').forEach(card => {
        if (!card.dataset.bound) {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.course-filter-btn')) {
                    const courseLink = this.getAttribute('data-link');
                    if (courseLink && courseLink !== '#') {
                        window.open(courseLink, '_blank');
                    }
                }
            });
            card.dataset.bound = 'true';
        }
    });
}

// ==================== НАСТРОЙКА ДИНАМИЧЕСКИХ ОБРАБОТЧИКОВ ====================
function setupDynamicEventListeners() {
    document.addEventListener('click', function(e) {
        // Карточки стартапов
        const startupCard = e.target.closest('.startup-card');
        if (startupCard) {
            const startupId = startupCard.getAttribute('data-id');
            if (startupId && !e.target.closest('.interaction-btn')) {
                showStartupDetailModal(startupId);
            }
            return;
        }
        
        // Карточки курсов
        const courseCard = e.target.closest('.course-card');
        if (courseCard) {
            const courseLink = courseCard.getAttribute('data-link');
            if (courseLink && courseLink !== '#' && !e.target.closest('.course-filter-btn')) {
                window.open(courseLink, '_blank');
            }
            return;
        }
        
        // Лайки
        const likeBtn = e.target.closest('.interaction-btn.like');
        if (likeBtn) {
            e.preventDefault();
            const startupId = likeBtn.closest('.startup-card').getAttribute('data-id');
            if (startupId) {
                toggleLike(startupId, likeBtn);
            }
            return;
        }
        
        // Комментарии
        const commentBtn = e.target.closest('.interaction-btn.comment');
        if (commentBtn) {
            e.preventDefault();
            const startupId = commentBtn.closest('.startup-card').getAttribute('data-id');
            if (startupId) {
                const startup = appState.startups.find(s => s.id == startupId);
                if (startup) {
                    showStartupDetailModal(startupId);
                    setTimeout(() => {
                        const commentInput = document.getElementById('commentInput');
                        if (commentInput) commentInput.focus();
                    }, 300);
                }
            }
            return;
        }
        
        // Кнопки в личном кабинете
        const editStartupBtn = e.target.closest('.edit-startup');
        if (editStartupBtn) {
            e.preventDefault();
            const startupId = editStartupBtn.getAttribute('data-id');
            editStartup(startupId);
            return;
        }
        
        const deleteStartupBtn = e.target.closest('.delete-startup');
        if (deleteStartupBtn) {
            e.preventDefault();
            const startupId = deleteStartupBtn.getAttribute('data-id');
            deleteStartup(startupId);
            return;
        }
        
        // Кнопки вкладок личного кабинета
        const dashboardMenuBtn = e.target.closest('.dashboard-menu-btn');
        if (dashboardMenuBtn) {
            e.preventDefault();
            const tabName = dashboardMenuBtn.getAttribute('data-tab');
            switchDashboardTab(tabName);
            return;
        }
        
        // Карточки обучения
        const learningCard = e.target.closest('.learning-card');
        if (learningCard) {
            const stage = learningCard.getAttribute('data-stage');
            openLearningStage(stage);
            return;
        }
        
        // Карточки информации
        const infoCard = e.target.closest('.info-card');
        if (infoCard) {
            const infoTitle = infoCard.querySelector('h4')?.textContent;
            if (infoTitle) {
                console.log(`Открытие информации: ${infoTitle}`);
            }
            return;
        }
    });
}

// ==================== НАСТРОЙКА ОБРАБОТЧИКОВ ЛИЧНОГО КАБИНЕТА ====================
function setupDashboardListeners() {
    const addNewStartupBtn = document.getElementById('addNewStartupBtn');
    if (addNewStartupBtn) {
        addNewStartupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('publish');
        });
    }
    
    const publishFirstStartupBtn = document.getElementById('publishFirstStartupBtn');
    if (publishFirstStartupBtn) {
        publishFirstStartupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo('publish');
        });
    }
    
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (appState.currentUser) {
                appState.currentUser.name = document.getElementById('profileName').value || appState.currentUser.name;
                appState.currentUser.email = document.getElementById('profileEmail').value || appState.currentUser.email;
                appState.currentUser.bio = document.getElementById('profileBio').value;
                appState.currentUser.role = document.getElementById('profileRole').value;
                
                localStorage.setItem('startupHub_user', JSON.stringify(appState.currentUser));
                updateUI();
            }
        });
    }
    
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Функция смены пароля в разработке');
        });
    }
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const theme = this.getAttribute('data-theme');
            appState.theme = theme;
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('startupHub_theme', theme);
            
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            
            updateThemeIcon();
            
            console.log(`Тема изменена на: ${theme}`);
        });
    });
    
    const dashboardLangSelect = document.getElementById('dashboardLanguage');
    if (dashboardLangSelect) {
        dashboardLangSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Привязка Telegram кнопки
    const linkTelegramBtn = document.getElementById('linkTelegramBtn');
    if (linkTelegramBtn) {
        linkTelegramBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openTelegramLinkForm();
        });
    }
    
    // Сохранение Telegram username
    const saveTelegramUsernameBtn = document.getElementById('saveTelegramUsername');
    if (saveTelegramUsernameBtn) {
        saveTelegramUsernameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveTelegramUsername();
        });
    }
}

// ==================== ОТКРЫТИЕ ФОРМЫ ПРИВЯЗКИ TELEGRAM ====================
function openTelegramLinkForm() {
    if (!appState.currentUser) {
        showNotification('Сначала необходимо войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    const telegramUsernameInput = document.getElementById('telegramUsernameInput');
    if (telegramUsernameInput) {
        telegramUsernameInput.style.display = 'block';
        document.getElementById('telegramUsername').focus();
    }
}

// ==================== СОХРАНЕНИЕ TELEGRAM USERNAME ====================
function saveTelegramUsername() {
    const telegramUsernameInput = document.getElementById('telegramUsername');
    const telegramUsername = telegramUsernameInput?.value.trim();
    
    if (!telegramUsername) {
        showNotification('Введите Telegram username', 'error');
        return;
    }
    
    if (!telegramUsername.startsWith('@')) {
        showNotification('Telegram username должен начинаться с @', 'error');
        return;
    }
    
    // Сохраняем Telegram username в профиле пользователя
    if (appState.currentUser) {
        appState.currentUser.telegramUsername = telegramUsername;
        localStorage.setItem('startupHub_user', JSON.stringify(appState.currentUser));
        
        showNotification(`Telegram ${telegramUsername} успешно привязан`, 'success');
        
        // Скрываем поле ввода
        const telegramUsernameInputContainer = document.getElementById('telegramUsernameInput');
        if (telegramUsernameInputContainer) {
            telegramUsernameInputContainer.style.display = 'none';
        }
        
        // Обновляем статус Telegram
        updateTelegramStatus();
        
        // Очищаем поле
        telegramUsernameInput.value = '';
    }
}

// ==================== ОБНОВЛЕНИЕ СТАТУСА TELEGRAM ====================
function updateTelegramStatus() {
    const telegramStatusText = document.getElementById('telegramStatusText');
    const telegramLinkStatusText = document.getElementById('telegramLinkStatusText');
    
    if (appState.currentUser && appState.currentUser.telegramUsername) {
        const username = appState.currentUser.telegramUsername;
        if (telegramStatusText) {
            telegramStatusText.textContent = `Telegram: ${username}`;
            telegramStatusText.style.color = '#10B981';
        }
        if (telegramLinkStatusText) {
            telegramLinkStatusText.textContent = `Telegram: ${username}`;
            telegramLinkStatusText.style.color = '#10B981';
        }
    } else {
        if (telegramStatusText) {
            telegramStatusText.textContent = 'Telegram не привязан';
            telegramStatusText.style.color = 'var(--text-secondary)';
        }
        if (telegramLinkStatusText) {
            telegramLinkStatusText.textContent = 'Telegram не привязан';
            telegramLinkStatusText.style.color = 'var(--text-secondary)';
        }
    }
}

// ==================== НАСТРОЙКА ОБРАБОТЧИКОВ ДЛЯ КАРТОЧЕК ОБУЧЕНИЯ ====================
function setupLearningCardListeners() {
    document.querySelectorAll('.learning-card').forEach(card => {
        card.addEventListener('click', function() {
            const stage = this.getAttribute('data-stage');
            openLearningStage(stage);
        });
    });
}

// ==================== ЗАГРУЗКА СТАРТАПОВ ====================
function loadStartups() {
    const savedStartups = localStorage.getItem('startupHub_startups');
    if (savedStartups) {
        try {
            appState.startups = JSON.parse(savedStartups);
            console.log('Загружено стартапов:', appState.startups.length);
        } catch (e) {
            console.error('Ошибка загрузки стартапов:', e);
            appState.startups = [];
            localStorage.removeItem('startupHub_startups');
        }
    } else {
        appState.startups = [];
        console.log('Стартапов нет, создаем пустой массив');
    }
    
    const savedDrafts = localStorage.getItem('startupHub_drafts');
    if (savedDrafts) {
        try {
            appState.drafts = JSON.parse(savedDrafts);
        } catch (e) {
            console.error('Ошибка загрузки черновиков:', e);
            appState.drafts = [];
            localStorage.removeItem('startupHub_drafts');
        }
    } else {
        appState.drafts = [];
    }
    
    const savedLikes = localStorage.getItem('startupHub_likes');
    if (savedLikes) {
        try {
            const likesData = JSON.parse(savedLikes);
            appState.startups.forEach(startup => {
                if (likesData[startup.id]) {
                    startup.likes = likesData[startup.id].count;
                    startup.likedByUser = likesData[startup.id].likedByUser;
                } else {
                    startup.likes = startup.likes || 0;
                    startup.likedByUser = false;
                }
                startup.comments = startup.comments || [];
                startup.rating = startup.rating || calculateRating(startup);
            });
        } catch (e) {
            console.error('Ошибка загрузки лайков:', e);
            localStorage.removeItem('startupHub_likes');
        }
    } else {
        appState.startups.forEach(startup => {
            startup.likes = startup.likes || 0;
            startup.likedByUser = false;
            startup.comments = startup.comments || [];
            startup.rating = startup.rating || calculateRating(startup);
        });
    }
    
    appState.filteredStartups = [...appState.startups];
    updateAllStartupGrids();
    updateStats();
}

// ==================== ЗАГРУЗКА МЕНТОРОВ ====================
function loadMentors() {
    const savedMentors = localStorage.getItem('startupHub_mentors');
    if (savedMentors) {
        try {
            appState.mentors = JSON.parse(savedMentors);
        } catch (e) {
            console.error('Ошибка загрузки менторов:', e);
            appState.mentors = [];
            localStorage.removeItem('startupHub_mentors');
        }
    } else {
        appState.mentors = [];
    }
    
    updateMentorsList();
}

// ==================== ЗАГРУЗКА КУРСОВ ====================
function loadCourses() {
    appState.courses.ru = [
        {
            id: 1,
            number: "01",
            title: "Startup School — Astana Hub",
            description: "Курс по запуску стартапа с нуля",
            language: "RU",
            price: "~9990 ₸",
            studentPrice: "~1990 ₸ (до 23 лет)",
            image: "https://tse4.mm.bing.net/th/id/OIP.kVfmbuMmhympVg6iU1l0uwAAAA?w=400&h=200&rs=1&pid=ImgDetMain&o=7&rm=3",
            link: "https://astanahub.com/ru/l/startupschool?utm_source=chatgpt.com",
            category: "Полный курс"
        },
        {
            id: 2,
            number: "02",
            title: "Stepik — предпринимательство",
            description: "Интерактивные курсы по бизнес-основам",
            language: "RU",
            price: "Бесплатно",
            studentPrice: "",
            image: "https://static.tildacdn.com/tild3237-6335-4932-a538-383365376633/stepik_logotype_blac.svg",
            link: "https://stepik.org/",
            category: "Основы"
        },
        {
            id: 3,
            number: "03",
            title: "Wizape — венчурное предпринимательство",
            description: "Курсы по финансированию стартапов",
            language: "RU",
            price: "Бесплатно",
            studentPrice: "",
            image: "https://wizape.com/logo.png",
            link: "https://wizape.com/",
            category: "Финансы"
        },
        {
            id: 4,
            number: "04",
            title: "Бесплатные курсы по запуску",
            description: "Вводный уровень для начинающих",
            language: "RU",
            price: "Бесплатно",
            studentPrice: "",
            image: "https://web-machine.agency/images/case-studies/startup/startup.svg",
            link: "https://edu.partnerkin.com/c/free/zapusk-startapa?utm_source=chatgpt.com",
            category: "Начальный"
        },
        {
            id: 5,
            number: "05",
            title: "AstanaHub LMS — предпринимательство",
            description: "Образовательные курсы для стартаперов",
            language: "RU",
            price: "Разная",
            studentPrice: "",
            image: "https://www.fintechfestival.sg/hs-fs/hubfs/astana.png?width=1200&height=600&name=astana.png",
            link: "https://edu.astanahub.com/?utm_source=chatgpt.com",
            category: "Практика"
        }
    ];
    
    appState.courses.en = [
        {
            id: 6,
            number: "01",
            title: "Coursera — Entrepreneurship",
            description: "Free introductory courses on entrepreneurship",
            language: "EN",
            price: "Free (audit)",
            studentPrice: "$30-$60 for certificate",
            image: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.jpg",
            link: "https://www.coursera.org/courses?query=entrepreneurship&skills=Entrepreneurship&utm_source=chatgpt.com",
            category: "Introductory"
        },
        {
            id: 7,
            number: "02",
            title: "Launching Innovative Business",
            description: "Coursera course on launching startups",
            language: "EN",
            price: "Free (audit)",
            studentPrice: "$30-$60 for certificate",
            image: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.jpg",
            link: "https://www.coursera.org/courses?query=entrepreneurship",
            category: "Launch"
        },
        {
            id: 8,
            number: "03",
            title: "Business Strategy & Innovation",
            description: "Advanced courses on strategy and innovation",
            language: "EN",
            price: "Free (audit)",
            studentPrice: "$30+ for certificate",
            image: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.jpg",
            link: "https://www.coursera.org/browse/business/entrepreneurship?utm_source=chatgpt.com",
            category: "Strategy"
        },
        {
            id: 9,
            number: "04",
            title: "Udemy — Entrepreneurship",
            description: "Affordable courses on entrepreneurship",
            language: "EN",
            price: "$9.99-$14.99",
            studentPrice: "",
            image: "https://wallpapercave.com/wp/wp13996901.jpg",
            link: "https://www.coursera.org/courses?query=free&skills=Entrepreneurship&utm_source=chatgpt.com",
            category: "Affordable"
        },
        {
            id: 10,
            number: "05",
            title: "Free Entrepreneurship Courses",
            description: "Coursera free courses collection",
            language: "EN",
            price: "Free or paid certificate",
            studentPrice: "$30-$60 for certificate",
            image: "https://logos-world.net/wp-content/uploads/2023/08/Coursera-Logo.jpg",
            link: "https://www.coursera.org/courses?query=free&skills=Entrepreneurship&utm_source=chatgpt.com",
            category: "Collection"
        }
    ];
    
    renderCourses();
}

// ==================== СОХРАНЕНИЕ ДАННЫХ ====================
function saveStartupsToStorage() {
    try {
        localStorage.setItem('startupHub_startups', JSON.stringify(appState.startups));
        localStorage.setItem('startupHub_drafts', JSON.stringify(appState.drafts || []));
        
        const likesData = {};
        appState.startups.forEach(startup => {
            if (startup.likes !== undefined) {
                likesData[startup.id] = {
                    count: startup.likes,
                    likedByUser: startup.likedByUser || false
                };
            }
        });
        localStorage.setItem('startupHub_likes', JSON.stringify(likesData));
        console.log('Стартапы сохранены в localStorage');
    } catch (e) {
        console.error('Ошибка сохранения стартапов:', e);
    }
}

function saveMentorsToStorage() {
    try {
        localStorage.setItem('startupHub_mentors', JSON.stringify(appState.mentors));
    } catch (e) {
        console.error('Ошибка сохранения менторов:', e);
    }
}

// ==================== ОБНОВЛЕНИЕ ВСЕХ СЕТОК СТАРТАПОВ ====================
function updateAllStartupGrids() {
    console.log('Обновление всех сеток стартапов...');
    
    // Получаем только опубликованные стартапы (не черновики)
    const publishedStartups = appState.startups.filter(startup => !startup.isDraft);
    console.log('Опубликованные стартапы:', publishedStartups.length);
    
    // Обновляем статистику
    const totalStartups = document.getElementById('totalStartups');
    const totalMentors = document.getElementById('totalMentors');
    const totalDeals = document.getElementById('totalDeals');
    if (totalStartups) totalStartups.textContent = publishedStartups.length;
    if (totalMentors) totalMentors.textContent = appState.mentors.length;
    if (totalDeals) totalDeals.textContent = 0;
    
    // Топ проектов по рейтингу
    const topRatedStartupsContainer = document.getElementById('topRatedStartups');
    if (topRatedStartupsContainer) {
        if (publishedStartups.length === 0) {
            topRatedStartupsContainer.innerHTML = createEmptyStartupState('Топ проектов по рейтингу');
        } else {
            const topRated = [...publishedStartups]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);
            renderStartupGrid('topRatedStartups', topRated);
        }
    }
    
    // Топ лайков за неделю
    const topLikedStartupsContainer = document.getElementById('topLikedStartups');
    if (topLikedStartupsContainer) {
        if (publishedStartups.length === 0) {
            topLikedStartupsContainer.innerHTML = createEmptyStartupState('Топ лайков за неделю');
        } else {
            const topLiked = [...publishedStartups]
                .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                .slice(0, 6);
            renderStartupGrid('topLikedStartups', topLiked);
        }
    }
    
    // Последние стартапы
    const latestStartupsContainer = document.getElementById('latestStartups');
    if (latestStartupsContainer) {
        if (publishedStartups.length === 0) {
            latestStartupsContainer.innerHTML = createEmptyStartupState('Последние стартапы');
        } else {
            const latestStartups = [...publishedStartups]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6);
            renderStartupGrid('latestStartups', latestStartups);
        }
    }
    
    // Рекомендуемые проекты
    const featuredStartupsContainer = document.getElementById('featuredStartups');
    if (featuredStartupsContainer) {
        if (publishedStartups.length === 0) {
            featuredStartupsContainer.innerHTML = createEmptyStartupState('Рекомендуемые проекты');
        } else {
            const featuredStartups = [...publishedStartups]
                .filter(startup => (startup.rating || 0) >= 4.0)
                .slice(0, 6);
            renderStartupGrid('featuredStartups', featuredStartups);
        }
    }
    
    // Каталог с пагинацией
    updateCatalogGrid();
    
    // Топ менторов
    updateTopMentors();
    
    // Менторы для инвесторов
    updateInvestorsMentors();
    
    // Доступные менторы
    updateAvailableMentors();
    
    if (appState.currentUser) {
        renderUserStartups();
        updateDashboardStats();
    }
    
    // Перепривязываем все кнопки после обновления
    setTimeout(bindAllButtons, 100);
}

// ==================== СОЗДАНИЕ ПУСТОГО СОСТОЯНИЯ ДЛЯ СТАРТАПОВ ====================
function createEmptyStartupState(sectionTitle) {
    const message = appState.language === 'kz' ? 'Стартаптар табылмады' :
                   appState.language === 'en' ? 'No startups found' :
                   'Стартапы не найдены';
    
    const description = appState.language === 'kz' ? 'Бірінші стартапты жариялаңыз' : 
                      appState.language === 'en' ? 'Be the first to publish a startup' : 
                      'Опубликуйте первый стартап';
    
    const buttonText = appState.language === 'kz' ? 'Стартап жариялау' : 
                      appState.language === 'en' ? 'Publish Startup' : 
                      'Опубликовать стартап';
    
    return `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
            <i class="fas fa-rocket" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
            <h5 style="margin-bottom: 10px; color: var(--text-primary);">${sectionTitle}</h5>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">${message}</p>
            <p style="color: var(--text-tertiary); margin-bottom: 30px;">${description}</p>
            <button class="btn btn-primary" onclick="navigateTo('publish')" style="margin-top: 10px;">
                <i class="fas fa-plus"></i>
                ${buttonText}
            </button>
        </div>
    `;
}

// ==================== ОБНОВЛЕНИЕ КАТАЛОГА С ПАГИНАЦИЕЙ ====================
function updateCatalogGrid() {
    console.log('Обновление каталога...');
    const publishedStartups = appState.filteredStartups.filter(startup => !startup.isDraft);
    console.log('Фильтрованные стартапы для каталога:', publishedStartups.length);
    
    const startIndex = (appState.currentPageNumber - 1) * appState.startupsPerPage;
    const endIndex = startIndex + appState.startupsPerPage;
    const startupsToShow = publishedStartups.slice(startIndex, endIndex);
    
    renderStartupGrid('catalogStartups', startupsToShow);
    
    // Обновляем пагинацию
    updatePagination();
}

// ==================== ОБНОВЛЕНИЕ ПАГИНАЦИИ ====================
function updatePagination() {
    const publishedStartups = appState.filteredStartups.filter(startup => !startup.isDraft);
    const totalPages = Math.ceil(publishedStartups.length / appState.startupsPerPage);
    const paginationCurrent = document.querySelector('.pagination-current');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (paginationCurrent) {
        paginationCurrent.textContent = appState.currentPageNumber;
    }
    
    if (prevPageBtn) {
        prevPageBtn.disabled = appState.currentPageNumber === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = appState.currentPageNumber === totalPages || totalPages === 0;
    }
}

// ==================== СМЕНА СТРАНИЦЫ ====================
function changePage(direction) {
    const publishedStartups = appState.filteredStartups.filter(startup => !startup.isDraft);
    const totalPages = Math.ceil(publishedStartups.length / appState.startupsPerPage);
    const newPage = appState.currentPageNumber + direction;
    
    if (newPage < 1 || newPage > totalPages) return;
    
    appState.currentPageNumber = newPage;
    updateCatalogGrid();
    
    const catalogPage = document.getElementById('catalogPage');
    if (catalogPage && catalogPage.classList.contains('active')) {
        catalogPage.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== РЕНДЕРИНГ СЕТКИ СТАРТАПОВ ====================
function renderStartupGrid(containerId, startups) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    console.log(`Рендеринг ${startups.length} стартапов в контейнере ${containerId}`);
    
    if (startups.length === 0) {
        let message = '';
        if (containerId === 'catalogStartups') {
            message = appState.language === 'kz' ? 'Стартаптар табылмады' :
                     appState.language === 'en' ? 'No startups found' :
                     'Стартапы не найдены';
        } else {
            message = appState.language === 'kz' ? 'Жобалар жоқ' :
                     appState.language === 'en' ? 'No projects' :
                     'Проекты отсутствуют';
        }
        
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <i class="fas fa-rocket" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">${message}</h5>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    ${appState.language === 'kz' ? 'Бірінші стартапты жариялаңыз' : 
                     appState.language === 'en' ? 'Be the first to publish a startup' : 
                     'Опубликуйте первый стартап'}
                </p>
                <button class="btn btn-primary" onclick="navigateTo('publish')" style="margin-top: 10px;">
                    <i class="fas fa-plus"></i>
                    ${appState.language === 'kz' ? 'Стартап жариялау' : 
                     appState.language === 'en' ? 'Publish Startup' : 
                     'Опубликовать стартап'}
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = startups.map(startup => createStartupCardHTML(startup)).join('');
}

// ==================== СОЗДАНИЕ HTML КАРТОЧКИ СТАРТАПА ====================
function createStartupCardHTML(startup) {
    // Создаем инициалы для логотипа
    const initials = startup.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    const backgroundColor = `hsl(${startup.id % 360}, 70%, 60%)`;
    
    const logoHtml = `
        <div class="startup-initials" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-color: ${backgroundColor}; color: white; font-weight: bold; font-size: 24px; border-radius: 8px;">
            ${initials}
        </div>
    `;
    
    const isLiked = startup.likedByUser || false;
    const likesCount = startup.likes || 0;
    const commentsCount = startup.comments ? startup.comments.length : 0;
    const rating = startup.rating || 3.0;
    
    // Форматируем дату
    const formattedDate = formatDate(startup.createdAt);
    
    // Определяем цвет для стадии
    let stageColor = '#6B7280'; // По умолчанию серый
    if (startup.stage === 'idea') stageColor = '#F59E0B'; // Желтый
    else if (startup.stage === 'mvp') stageColor = '#3B82F6'; // Синий
    else if (startup.stage === 'ready') stageColor = '#10B981'; // Зеленый
    else if (startup.stage === 'scaling') stageColor = '#8B5CF6'; // Фиолетовый
    
    return `
        <div class="startup-card clickable" data-id="${startup.id}" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; cursor: pointer; transition: all 0.3s ease; display: flex; flex-direction: column; height: 100%;">
            <div class="startup-image" style="width: 60px; height: 60px; border-radius: 8px; margin-bottom: 16px; overflow: hidden; background-color: var(--bg-tertiary);">
                ${logoHtml}
            </div>
            
            <div class="startup-header" style="margin-bottom: 12px;">
                <h4 class="startup-name" style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: var(--text-primary); line-height: 1.3; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${startup.name}
                </h4>
                <p class="startup-goal" style="font-size: 14px; color: var(--text-secondary); margin: 0; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                    ${startup.goal}
                </p>
            </div>
            
            <div class="rating" style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <div class="rating-stars" style="display: flex; gap: 2px;">
                    ${renderStars(rating)}
                </div>
                <span class="rating-value" style="font-size: 14px; font-weight: 600; color: var(--text-primary);">
                    ${rating.toFixed(1)}
                </span>
            </div>
            
            <div class="startup-interactions" style="display: flex; gap: 16px; margin-bottom: 16px;">
                <button class="interaction-btn like ${isLiked ? 'liked' : ''}" data-id="${startup.id}" style="display: flex; align-items: center; gap: 6px; background: none; border: none; color: ${isLiked ? '#EF4444' : 'var(--text-secondary)'}; font-size: 13px; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: all 0.2s ease;">
                    <i class="fas fa-heart"></i>
                    <span>${likesCount}</span>
                </button>
                <button class="interaction-btn comment" style="display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--text-secondary); font-size: 13px; cursor: pointer; padding: 6px 12px; border-radius: 6px; transition: all 0.2s ease;">
                    <i class="fas fa-comment"></i>
                    <span>${commentsCount}</span>
                </button>
            </div>
            
            <div class="startup-tags" style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <span class="tag category" style="background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    ${startup.category}
                </span>
                <span class="tag stage" style="background-color: ${stageColor}20; color: ${stageColor}; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                    ${getStageLabel(startup.stage)}
                </span>
            </div>
            
            <div class="startup-meta" style="margin-top: auto; display: flex; justify-content: space-between; color: var(--text-tertiary); font-size: 12px; padding-top: 12px; border-top: 1px solid var(--border-color);">
                <span>${formattedDate}</span>
                <span>${startup.views || 0} ${appState.language === 'kz' ? 'көрілім' : appState.language === 'en' ? 'views' : 'просмотров'}</span>
            </div>
        </div>
    `;
}

// ==================== ПОЛУЧЕНИЕ НАЗВАНИЯ СТАДИИ ====================
function getStageLabel(stage) {
    const stages = {
        'idea': { ru: 'Идея', kz: 'Идея', en: 'Idea' },
        'mvp': { ru: 'MVP', kz: 'MVP', en: 'MVP' },
        'beta': { ru: 'Бета', kz: 'Бета', en: 'Beta' },
        'ready': { ru: 'Готово', kz: 'Даяр', en: 'Ready' },
        'scaling': { ru: 'Масштабирование', kz: 'Масштабтау', en: 'Scaling' }
    };
    
    return stages[stage] ? stages[stage][appState.language] || stages[stage].ru : stage;
}

// ==================== РАСЧЕТ РЕЙТИНГА ====================
function calculateRating(startup) {
    if (appState.startups.length === 0) {
        return 3.0;
    }
    
    const publishedStartups = appState.startups.filter(s => !s.isDraft);
    if (publishedStartups.length === 0) {
        return 3.0;
    }
    
    const likesWeight = 0.4;
    const commentsWeight = 0.3;
    const viewsWeight = 0.2;
    const ageWeight = 0.1;
    
    const maxLikes = Math.max(...publishedStartups.map(s => s.likes || 0));
    const maxComments = Math.max(...publishedStartups.map(s => (s.comments || []).length));
    const maxViews = Math.max(...publishedStartups.map(s => s.views || 0));
    
    const likesScore = maxLikes > 0 ? (startup.likes || 0) / maxLikes * 5 : 0;
    const commentsScore = maxComments > 0 ? (startup.comments || []).length / maxComments * 5 : 0;
    const viewsScore = maxViews > 0 ? (startup.views || 0) / maxViews * 5 : 0;
    
    const ageInDays = startup.createdAt ? (new Date() - new Date(startup.createdAt)) / (1000 * 60 * 60 * 24) : 0;
    const ageScore = ageInDays < 30 ? 5 : ageInDays < 90 ? 4 : ageInDays < 180 ? 3 : 2;
    
    const totalScore = (
        likesScore * likesWeight +
        commentsScore * commentsWeight +
        viewsScore * viewsWeight +
        ageScore * ageWeight
    );
    
    return Math.min(5, Math.max(1, totalScore));
}

// ==================== ПУБЛИКАЦИЯ СТАРТАПА ====================
function handleStartupSubmit(e) {
    e.preventDefault();
    
    if (!appState.currentUser) {
        showNotification('Сначала необходимо зарегистрироваться', 'error');
        showLoginModal();
        return;
    }
    
    // Получаем значения из формы
    const formData = {
        id: Date.now(),
        name: document.getElementById('startupName').value.trim(),
        goal: document.getElementById('startupGoal').value.trim(),
        description: document.getElementById('startupDescription').value.trim(),
        category: document.getElementById('startupCategory').value,
        stage: document.getElementById('startupStage').value,
        teamSize: document.getElementById('teamSize').value ? parseInt(document.getElementById('teamSize').value) : null,
        projectCost: document.getElementById('projectCost').value ? parseInt(document.getElementById('projectCost').value) : null,
        monthlyExpenses: document.getElementById('monthlyExpenses').value ? parseInt(document.getElementById('monthlyExpenses').value) : null,
        investmentAsked: document.getElementById('investmentAsked').value ? parseInt(document.getElementById('investmentAsked').value) : null,
        marketSize: document.getElementById('marketSize').value.trim() || null,
        targetAudience: document.getElementById('targetAudience').value.trim() || null,
        region: document.getElementById('region').value.trim() || null,
        tractionUsers: document.getElementById('tractionUsers').value ? parseInt(document.getElementById('tractionUsers').value) : null,
        tractionRevenue: document.getElementById('tractionRevenue').value ? parseInt(document.getElementById('tractionRevenue').value) : null,
        links: {
            github: document.getElementById('startupGithub').value.trim(),
            website: document.getElementById('startupWebsite').value.trim()
        },
        contactEmail: document.getElementById('startupEmail').value.trim(),
        telegramContact: document.getElementById('telegramContact').value.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        likes: 0,
        comments: [],
        rating: 3.0,
        author: appState.currentUser.id,
        authorName: appState.currentUser.name,
        isDraft: false
    };
    
    console.log('Данные формы для публикации:', formData);
    
    // Проверка только обязательных полей
    const errors = [];
    
    if (!formData.name) errors.push('Название стартапа');
    if (!formData.goal) errors.push('Цель проекта');
    if (!formData.description) errors.push('Полное описание');
    if (!formData.category) errors.push('Категория');
    if (!formData.stage) errors.push('Стадия проекта');
    if (!formData.contactEmail) errors.push('Контактный email');
    if (!formData.telegramContact) errors.push('Telegram для связи');
    
    if (errors.length > 0) {
        showNotification(`Заполните обязательные поля: ${errors.join(', ')}`, 'error');
        return;
    }
    
    // ВАЖНО: Добавляем стартап в начало списка
    appState.startups.unshift(formData);
    appState.filteredStartups.unshift(formData);
    
    console.log('Стартап добавлен. Всего стартапов:', appState.startups.length);
    
    // Сохраняем
    saveStartupsToStorage();
    updateAllStartupGrids();
    updateStats();
    
    // Сбрасываем форму
    e.target.reset();
    
    // Показываем уведомление
    showNotification('Стартап успешно опубликован!', 'success');
    
    // Переходим в каталог
    navigateTo('catalog');
}

// ==================== ФИЛЬТРАЦИЯ ====================
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const stage = document.getElementById('stageFilter').value;
    
    console.log('Применение фильтров:', { category, stage });
    
    // Получаем только опубликованные стартапы (не черновики)
    const publishedStartups = appState.startups.filter(startup => !startup.isDraft);
    
    appState.filteredStartups = publishedStartups.filter(startup => {
        const categoryMatch = category === 'all' || startup.category === category;
        const stageMatch = stage === 'all' || startup.stage === stage;
        
        return categoryMatch && stageMatch;
    });
    
    console.log('После фильтрации:', appState.filteredStartups.length, 'стартапов');
    
    appState.currentPageNumber = 1;
    updateCatalogGrid();
}

// ==================== ПОИСК ====================
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log('Поиск:', searchTerm);
    
    if (searchTerm.length < 2) {
        // Получаем только опубликованные стартапы
        const publishedStartups = appState.startups.filter(startup => !startup.isDraft);
        appState.filteredStartups = [...publishedStartups];
        appState.currentPageNumber = 1;
        updateCatalogGrid();
        return;
    }
    
    // Получаем только опубликованные стартапы
    const publishedStartups = appState.startups.filter(startup => !startup.isDraft);
    
    appState.filteredStartups = publishedStartups.filter(startup => {
        return startup.name.toLowerCase().includes(searchTerm) ||
               startup.goal.toLowerCase().includes(searchTerm) ||
               startup.description.toLowerCase().includes(searchTerm) ||
               startup.category.toLowerCase().includes(searchTerm);
    });
    
    console.log('Результаты поиска:', appState.filteredStartups.length, 'стартапов');
    
    appState.currentPageNumber = 1;
    updateCatalogGrid();
}

// ==================== НАВИГАЦИЯ ПО СТРАНИЦАМ ====================
function navigateTo(page) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
    
    pages.forEach(p => {
        p.classList.remove('active');
        if (p.id === `${page}Page`) {
            p.classList.add('active');
        }
    });
    
    if (pageTitle) {
        const pageTitles = {
            ru: {
                home: 'Главная',
                catalog: 'Каталог стартапов',
                publish: 'Опубликовать стартап',
                investors: 'Инвесторам',
                learning: 'Стартап-обучение',
                dashboard: 'Личный кабинет'
            },
            kz: {
                home: 'Басты бет',
                catalog: 'Стартаптар каталогы',
                publish: 'Стартап жариялау',
                investors: 'Инвесторларға',
                learning: 'Стартап-оқыту',
                dashboard: 'Жеке кабинет'
            },
            en: {
                home: 'Home',
                catalog: 'Startup Catalog',
                publish: 'Publish Startup',
                investors: 'For Investors',
                learning: 'Startup Learning',
                dashboard: 'Personal Account'
            }
        };
        
        if (pageTitles[appState.language] && pageTitles[appState.language][page]) {
            pageTitle.textContent = pageTitles[appState.language][page];
        } else {
            pageTitle.textContent = pageTitles['ru'][page] || page;
        }
    }
    
    appState.currentPage = page;
    appState.currentPageNumber = 1;
    
    window.scrollTo(0, 0);
    
    if (searchBox) {
        if (page === 'publish' || page === 'dashboard' || page === 'learning') {
            searchBox.classList.add('hidden');
        } else {
            searchBox.classList.remove('hidden');
        }
    }
    
    if (page === 'dashboard' && appState.currentUser) {
        renderUserStartups();
        updateDashboardStats();
        updateTelegramStatus();
    }
    
    if (page === 'learning') {
        updateMentorsList();
        renderCourses();
        setTimeout(() => {
            filterCourses('all');
        }, 100);
    }
    
    if (page === 'catalog') {
        updateCatalogGrid();
    }
    
    // Перепривязываем кнопки после навигации
    setTimeout(bindAllButtons, 300);
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ====================
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    appState.theme = newTheme;
    localStorage.setItem('startupHub_theme', newTheme);
    
    updateThemeIcon();
    showNotification(`Тема изменена на ${newTheme === 'light' ? 'светлую' : 'темную'}`, 'success');
}

// ==================== ОБНОВЛЕНИЕ ИКОНКИ ТЕМЫ ====================
function updateThemeIcon() {
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (appState.theme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
}

// ==================== СМЕНА ЯЗЫКА ====================
function changeLanguage(lang) {
    appState.language = lang;
    localStorage.setItem('startupHub_language', lang);
    
    if (languageSelect) {
        languageSelect.value = lang;
    }
    
    updateUI();
    showNotification(`Язык изменен на ${lang === 'ru' ? 'русский' : lang === 'kz' ? 'казахский' : 'английский'}`, 'success');
}

// ==================== ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО ВХОДА ====================
function showLoginModal() {
    if (authModal) {
        authModal.classList.add('active');
        document.body.classList.add('modal-open');
        switchAuthTab('login');
    }
}

// ==================== ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО РЕГИСТРАЦИИ ====================
function showRegisterModal() {
    if (authModal) {
        authModal.classList.add('active');
        document.body.classList.add('modal-open');
        switchAuthTab('register');
    }
}

// ==================== СКРЫТЬ МОДАЛЬНОЕ ОКНО АУТЕНТИФИКАЦИИ ====================
function hideAuthModal() {
    if (authModal) {
        authModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК АУТЕНТИФИКАЦИИ ====================
function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`.auth-tab[data-tab="${tabName}"]`);
    const activeForm = document.getElementById(`${tabName}Form`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activeForm) activeForm.classList.add('active');
}

// ==================== ОБРАБОТКА ВХОДА ====================
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    // Простая имитация аутентификации
    const user = {
        id: Date.now(),
        email: email,
        name: email.split('@')[0],
        role: 'entrepreneur',
        bio: '',
        createdAt: new Date().toISOString()
    };
    
    appState.currentUser = user;
    localStorage.setItem('startupHub_user', JSON.stringify(user));
    
    hideAuthModal();
    updateUI();
    showNotification('Вход выполнен успешно!', 'success');
    
    if (appState.currentPage === 'publish') {
        navigateTo('publish');
    }
}

// ==================== ОБРАБОТКА РЕГИСТРАЦИИ ====================
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPasswordRegister').value;
    const role = document.getElementById('registerRole').value;
    
    if (!name || !email || !password || !confirmPassword || !role) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'error');
        return;
    }
    
    const user = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        bio: '',
        createdAt: new Date().toISOString()
    };
    
    appState.currentUser = user;
    localStorage.setItem('startupHub_user', JSON.stringify(user));
    
    hideAuthModal();
    updateUI();
    showNotification('Регистрация прошла успешно!', 'success');
    
    navigateTo('dashboard');
}

// ==================== ОБРАБОТКА ВЫХОДА ====================
function handleLogout() {
    appState.currentUser = null;
    localStorage.removeItem('startupHub_user');
    
    updateUI();
    showNotification('Вы вышли из системы', 'info');
    
    if (appState.currentPage === 'dashboard' || appState.currentPage === 'publish') {
        navigateTo('home');
    }
}

// ==================== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ====================
function updateUI() {
    if (appState.currentUser) {
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userEmail) userEmail.textContent = appState.currentUser.email;
        if (headerUserName) headerUserName.textContent = appState.currentUser.name;
        if (userNameDisplay) userNameDisplay.textContent = appState.currentUser.name;
        
        // Обновляем имя в форме профиля
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileBio = document.getElementById('profileBio');
        const profileRole = document.getElementById('profileRole');
        const profileSkills = document.getElementById('profileSkills');
        
        if (profileName) profileName.value = appState.currentUser.name || '';
        if (profileEmail) profileEmail.value = appState.currentUser.email || '';
        if (profileBio) profileBio.value = appState.currentUser.bio || '';
        if (profileRole) profileRole.value = appState.currentUser.role || 'startup_owner';
        if (profileSkills) profileSkills.value = appState.currentUser.skills || '';
        
        // Обновляем статус Telegram
        updateTelegramStatus();
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
        if (headerUserName) headerUserName.textContent = 'Гость';
        if (userNameDisplay) userNameDisplay.textContent = 'Гость';
    }
    
    // Обновляем язык интерфейса
    updateLanguageTexts();
    
    // Перепривязываем кнопки
    setTimeout(bindAllButtons, 100);
}

// ==================== ПОКАЗАТЬ МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ СТАРТАПА ====================
function showStartupDetailModal(startupId) {
    const startup = appState.startups.find(s => s.id == startupId);
    if (!startup) return;
    
    // Увеличиваем просмотры
    startup.views = (startup.views || 0) + 1;
    saveStartupsToStorage();
    
    const modal = document.getElementById('startupDetailModal');
    const content = document.getElementById('modalDetailBody');
    
    if (!modal || !content) return;
    
    const initials = startup.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
    const backgroundColor = `hsl(${startup.id % 360}, 70%, 60%)`;
    
    const logoHtml = `
        <div class="startup-initials-large" style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background-color: ${backgroundColor}; color: white; font-weight: bold; font-size: 32px; border-radius: 12px;">
            ${initials}
        </div>
    `;
    
    content.innerHTML = `
        <div class="startup-detail-header" style="display: flex; gap: 24px; margin-bottom: 32px; align-items: flex-start;">
            <div class="startup-detail-image">
                ${logoHtml}
            </div>
            <div class="startup-detail-title" style="flex: 1;">
                <h3 style="margin-bottom: 12px; color: var(--text-primary); font-size: 28px; line-height: 1.2;">${startup.name}</h3>
                <p class="startup-detail-goal" style="color: var(--text-secondary); margin-bottom: 16px; font-size: 16px; line-height: 1.4;">${startup.goal}</p>
                <div class="startup-detail-rating" style="display: flex; align-items: center; gap: 24px;">
                    <div class="rating-stars" style="display: flex; gap: 2px;">
                        ${renderStars(startup.rating || 0)}
                    </div>
                    <span class="rating-value" style="font-weight: 600; color: var(--text-primary); font-size: 16px;">${(startup.rating || 0).toFixed(1)}</span>
                    <span class="views-count" style="color: var(--text-tertiary); font-size: 14px;">${startup.views || 0} просмотров</span>
                </div>
            </div>
        </div>
        
        <div class="startup-detail-tags" style="display: flex; gap: 8px; margin-bottom: 32px; flex-wrap: wrap;">
            <span class="tag category" style="background-color: rgba(59, 130, 246, 0.1); color: #3B82F6; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;">${startup.category}</span>
            <span class="tag stage" style="background-color: #10B98120; color: #10B981; padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;">${getStageLabel(startup.stage)}</span>
            <span class="tag region" style="background-color: var(--bg-tertiary); color: var(--text-secondary); padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 600;">${startup.region || 'Не указан'}</span>
        </div>
        
        <div class="startup-detail-content" style="display: flex; flex-direction: column; gap: 32px;">
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Описание проекта</h4>
                <p style="color: var(--text-secondary); line-height: 1.6; font-size: 16px;">${startup.description}</p>
            </div>
            
            <div class="startup-detail-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <div class="detail-card" style="background-color: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
                    <h5 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 14px; font-weight: 600;">Команда</h5>
                    <p style="color: var(--text-primary); font-weight: 500; font-size: 18px;">${startup.teamSize || 'Не указан'} человек</p>
                </div>
                <div class="detail-card" style="background-color: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
                    <h5 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 14px; font-weight: 600;">Стоимость проекта</h5>
                    <p style="color: var(--text-primary); font-weight: 500; font-size: 18px;">${startup.projectCost ? startup.projectCost.toLocaleString() + ' $' : 'Не указана'}</p>
                </div>
                <div class="detail-card" style="background-color: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
                    <h5 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 14px; font-weight: 600;">Ежемесячные расходы</h5>
                    <p style="color: var(--text-primary); font-weight: 500; font-size: 18px;">${startup.monthlyExpenses ? startup.monthlyExpenses.toLocaleString() + ' $' : 'Не указаны'}</p>
                </div>
                <div class="detail-card" style="background-color: var(--bg-tertiary); padding: 20px; border-radius: 12px;">
                    <h5 style="color: var(--text-secondary); margin-bottom: 12px; font-size: 14px; font-weight: 600;">Запрашиваемые инвестиции</h5>
                    <p style="color: var(--text-primary); font-weight: 500; font-size: 18px;">${startup.investmentAsked ? startup.investmentAsked.toLocaleString() + ' $' : 'Не указаны'}</p>
                </div>
            </div>
            
            ${startup.targetAudience ? `
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Целевая аудитория</h4>
                <p style="color: var(--text-secondary); line-height: 1.6; font-size: 16px;">${startup.targetAudience}</p>
            </div>
            ` : ''}
            
            ${startup.marketSize ? `
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Рынок</h4>
                <p style="color: var(--text-secondary); line-height: 1.6; font-size: 16px;">${startup.marketSize}</p>
            </div>
            ` : ''}
            
            ${(startup.tractionUsers || startup.tractionRevenue) ? `
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Прогресс</h4>
                ${startup.tractionUsers ? `<p style="color: var(--text-secondary); margin-bottom: 8px; font-size: 16px;">Пользователи: ${startup.tractionUsers}</p>` : ''}
                ${startup.tractionRevenue ? `<p style="color: var(--text-secondary); font-size: 16px;">Выручка: ${startup.tractionRevenue.toLocaleString()} $</p>` : ''}
            </div>
            ` : ''}
            
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Контакты</h4>
                <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 16px;">Email: ${startup.contactEmail}</p>
                ${startup.telegramContact ? `<p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 16px;">Telegram: ${startup.telegramContact}</p>` : ''}
                ${startup.links?.website ? `<p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 16px;">Сайт: <a href="${startup.links.website}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${startup.links.website}</a></p>` : ''}
                ${startup.links?.github ? `<p style="color: var(--text-secondary); font-size: 16px;">GitHub: <a href="${startup.links.github}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${startup.links.github}</a></p>` : ''}
            </div>
            
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Дата публикации</h4>
                <p style="color: var(--text-secondary); font-size: 16px;">${formatDate(startup.createdAt)}</p>
            </div>
            
            ${startup.authorName ? `
            <div class="startup-detail-section">
                <h4 style="margin-bottom: 16px; color: var(--text-primary); font-size: 20px; font-weight: 600;">Автор</h4>
                <p style="color: var(--text-secondary); font-size: 16px;">${startup.authorName}</p>
            </div>
            ` : ''}
        </div>
        
        <div class="startup-detail-interactions" style="display: flex; gap: 16px; margin-top: 32px;">
            <button class="btn like-btn ${startup.likedByUser ? 'liked' : ''}" onclick="toggleLike(${startup.id}, this)" style="display: flex; align-items: center; gap: 10px; background-color: ${startup.likedByUser ? '#EF4444' : 'transparent'}; color: ${startup.likedByUser ? 'white' : '#EF4444'}; border: 2px solid #EF4444; border-radius: 8px; padding: 12px 24px; cursor: pointer; transition: all 0.2s ease; font-weight: 600; font-size: 16px;">
                <i class="fas fa-heart"></i>
                <span>${startup.likes || 0}</span>
            </button>
            <button class="btn contact-btn" onclick="contactStartup(${startup.id})" style="display: flex; align-items: center; gap: 10px; background-color: var(--accent-color); color: white; border: 2px solid var(--accent-color); border-radius: 8px; padding: 12px 24px; cursor: pointer; transition: all 0.2s ease; font-weight: 600; font-size: 16px;">
                <i class="fas fa-envelope"></i>
                Связаться
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

// ==================== СКРЫТЬ МОДАЛЬНОЕ ОКНО ДЕТАЛЕЙ СТАРТАПА ====================
function hideStartupDetailModal() {
    const modal = document.getElementById('startupDetailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ЛАЙКА ====================
function toggleLike(startupId, button) {
    if (!appState.currentUser) {
        showNotification('Для этого действия нужно войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    const startup = appState.startups.find(s => s.id == startupId);
    if (!startup) return;
    
    if (startup.likedByUser) {
        startup.likes = Math.max(0, (startup.likes || 1) - 1);
        startup.likedByUser = false;
        if (button) {
            button.classList.remove('liked');
            const countSpan = button.querySelector('span');
            if (countSpan) countSpan.textContent = startup.likes;
        }
        showNotification('Лайк удален', 'info');
    } else {
        startup.likes = (startup.likes || 0) + 1;
        startup.likedByUser = true;
        if (button) {
            button.classList.add('liked');
            const countSpan = button.querySelector('span');
            if (countSpan) countSpan.textContent = startup.likes;
        }
        showNotification('Стартап понравился!', 'success');
    }
    
    // Пересчитываем рейтинг
    startup.rating = calculateRating(startup);
    
    saveStartupsToStorage();
    updateAllStartupGrids();
}

// ==================== КОНТАКТ С СТАРТАПОМ ====================
function contactStartup(startupId) {
    const startup = appState.startups.find(s => s.id == startupId);
    if (!startup) return;
    
    showNotification(`Контакты: ${startup.contactEmail} ${startup.telegramContact ? ', Telegram: ' + startup.telegramContact : ''}`, 'info');
}

// ==================== РЕНДЕРИНГ ЗВЕЗД РЕЙТИНГА ====================
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star" style="color: #FFD700;"></i>';
    }
    
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt" style="color: #FFD700;"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star" style="color: #FFD700;"></i>';
    }
    
    return starsHtml;
}

// ==================== ФОРМАТИРОВАНИЕ ДАТЫ ====================
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return appState.language === 'kz' ? 'Бүгін' : 
                   appState.language === 'en' ? 'Today' : 
                   'Сегодня';
        } else if (diffDays === 1) {
            return appState.language === 'kz' ? 'Кеше' : 
                   appState.language === 'en' ? 'Yesterday' : 
                   'Вчера';
        } else if (diffDays < 7) {
            return appState.language === 'kz' ? `${diffDays} күн бұрын` : 
                   appState.language === 'en' ? `${diffDays} days ago` : 
                   `${diffDays} дней назад`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return appState.language === 'kz' ? `${weeks} апта бұрын` : 
                   appState.language === 'en' ? `${weeks} weeks ago` : 
                   `${weeks} недель назад`;
        } else {
            return date.toLocaleDateString(appState.language === 'ru' ? 'ru-RU' : 
                                          appState.language === 'kz' ? 'kk-KZ' : 'en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    } catch (e) {
        return appState.language === 'kz' ? 'Күні белгісіз' : 
               appState.language === 'en' ? 'Date unknown' : 
               'Дата не указана';
    }
}

// ==================== ПОКАЗАТЬ УВЕДОМЛЕНИЕ ====================
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    else if (type === 'error') icon = 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    // Стили для уведомления
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.fontSize = '16px';
    notification.style.fontWeight = '500';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.style.maxWidth = '400px';
    notification.style.minWidth = '300px';
    
    // Цвета в зависимости от типа
    if (type === 'success') {
        notification.style.backgroundColor = 'var(--bg-secondary)';
        notification.style.color = '#10B981';
        notification.style.border = '2px solid #10B981';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'var(--bg-secondary)';
        notification.style.color = '#EF4444';
        notification.style.border = '2px solid #EF4444';
    } else if (type === 'info') {
        notification.style.backgroundColor = 'var(--bg-secondary)';
        notification.style.color = '#3B82F6';
        notification.style.border = '2px solid #3B82F6';
    } else {
        notification.style.backgroundColor = 'var(--bg-secondary)';
        notification.style.color = 'var(--text-primary)';
        notification.style.border = '2px solid var(--border-color)';
    }
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ==================== ОБНОВЛЕНИЕ СТАТИСТИКИ ====================
function updateStats() {
    const publishedStartups = appState.startups.filter(s => !s.isDraft);
    
    const stats = {
        totalStartups: publishedStartups.length,
        totalUsers: appState.currentUser ? 1 : 0,
        totalInvestments: publishedStartups
            .filter(s => s.investmentAsked)
            .reduce((sum, s) => sum + (s.investmentAsked || 0), 0)
    };
    
    // Обновляем элементы статистики
    const statsElements = {
        'totalStartups': stats.totalStartups,
        'totalMentors': appState.mentors.length,
        'totalDeals': 0
    };
    
    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// ==================== СБРОС ФИЛЬТРОВ ====================
function resetFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('stageFilter').value = 'all';
    
    // Получаем только опубликованные стартапы
    const publishedStartups = appState.startups.filter(startup => !startup.isDraft);
    appState.filteredStartups = [...publishedStartups];
    
    appState.currentPageNumber = 1;
    updateCatalogGrid();
    showNotification('Фильтры сброшены', 'info');
}

// ==================== СОХРАНЕНИЕ ЧЕРНОВИКА ====================
function saveDraft() {
    if (!appState.currentUser) {
        showNotification('Для сохранения черновика нужно войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    const formData = {
        id: Date.now(),
        name: document.getElementById('startupName').value || 'Без названия',
        goal: document.getElementById('startupGoal').value || '',
        description: document.getElementById('startupDescription').value || '',
        category: document.getElementById('startupCategory').value || 'Other',
        stage: document.getElementById('startupStage').value || 'idea',
        createdAt: new Date().toISOString(),
        isDraft: true
    };
    
    appState.drafts.push(formData);
    localStorage.setItem('startupHub_drafts', JSON.stringify(appState.drafts));
    
    showNotification('Черновик сохранен', 'success');
}

// ==================== СТАТЬ МЕНТОРОМ ====================
function becomeMentor() {
    if (!appState.currentUser) {
        showNotification('Для этого действия нужно войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    showNotification('Функция "Стать ментором" в разработке', 'info');
}

// ==================== ОБНОВЛЕНИЕ СПИСКА МЕНТОРОВ ====================
function updateMentorsList() {
    const mentorsList = document.getElementById('mentorsList');
    if (!mentorsList) return;
    
    const availableMentors = appState.mentors.filter(m => m.available);
    
    if (availableMentors.length === 0) {
        mentorsList.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-user-tie" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Нет доступных менторов</h5>
                <p style="color: var(--text-secondary); opacity: 0.7;">Попробуйте позже</p>
            </div>
        `;
        return;
    }
    
    mentorsList.innerHTML = availableMentors.map(mentor => `
        <div class="mentor-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
            <div class="mentor-avatar" style="width: 60px; height: 60px; background-color: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent-color);">
                ${mentor.avatar || '<i class="fas fa-user-tie"></i>'}
            </div>
            <div class="mentor-info" style="flex: 1;">
                <h4 style="margin-bottom: 4px; color: var(--text-primary);">${mentor.name}</h4>
                <p class="mentor-specialty" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">${mentor.specialty}</p>
                <p class="mentor-experience" style="color: var(--text-tertiary); font-size: 12px; margin-bottom: 8px;">${mentor.experience}</p>
                <div class="mentor-stats" style="display: flex; gap: 16px;">
                    <span class="mentor-rating" style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 12px;">
                        <i class="fas fa-star" style="color: #FFD700;"></i> ${mentor.rating}
                    </span>
                    <span class="mentor-projects" style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 12px;">
                        <i class="fas fa-rocket"></i> ${mentor.projects} проектов
                    </span>
                </div>
            </div>
            <button class="btn btn-outline mentor-contact-btn" onclick="contactMentor(${mentor.id})" style="white-space: nowrap; padding: 8px 16px; font-size: 14px;">
                <i class="fas fa-envelope"></i>
                Связаться
            </button>
        </div>
    `).join('');
}

// ==================== ОБНОВЛЕНИЕ ТОП МЕНТОРОВ ====================
function updateTopMentors() {
    const topMentorsGrid = document.getElementById('topMentorsGrid');
    if (!topMentorsGrid) return;
    
    if (appState.mentors.length === 0) {
        topMentorsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <i class="fas fa-user-tie" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Топ менторов</h5>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    ${appState.language === 'kz' ? 'Менторлар табылмады' : 
                     appState.language === 'en' ? 'No mentors found' : 
                     'Менторы не найдены'}
                </p>
                <p style="color: var(--text-tertiary);">
                    ${appState.language === 'kz' ? 'Стать ментором можно через форму на странице обучения' : 
                     appState.language === 'en' ? 'You can become a mentor through the form on the learning page' : 
                     'Стать ментором можно через форму на странице обучения'}
                </p>
            </div>
        `;
        return;
    }
    
    const topMentors = [...appState.mentors]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    
    topMentorsGrid.innerHTML = topMentors.map(mentor => `
        <div class="mentor-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;">
            <div class="mentor-avatar" style="width: 60px; height: 60px; background-color: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent-color);">
                ${mentor.avatar || '<i class="fas fa-user-tie"></i>'}
            </div>
            <div class="mentor-info" style="flex: 1;">
                <h4 style="margin-bottom: 4px; color: var(--text-primary);">${mentor.name}</h4>
                <p class="mentor-specialty" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">${mentor.specialty}</p>
                <div class="mentor-stats" style="display: flex; gap: 16px;">
                    <span class="mentor-rating" style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 12px;">
                        <i class="fas fa-star" style="color: #FFD700;"></i> ${mentor.rating}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== ОБНОВЛЕНИЕ МЕНТОРОВ ДЛЯ ИНВЕСТОРОВ ====================
function updateInvestorsMentors() {
    const investorsMentorsGrid = document.getElementById('investorsMentorsGrid');
    if (!investorsMentorsGrid) return;
    
    if (appState.mentors.length === 0) {
        investorsMentorsGrid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-user-tie" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Нет менторов по финансам</h5>
                <p style="color: var(--text-secondary); opacity: 0.7;">Попробуйте позже</p>
            </div>
        `;
        return;
    }
    
    const financeMentors = appState.mentors.filter(m => 
        m.specialty && (m.specialty.includes('Финансы') || 
        m.specialty.toLowerCase().includes('finance') ||
        m.specialty.toLowerCase().includes('инвест'))
    ).slice(0, 2);
    
    if (financeMentors.length === 0) {
        investorsMentorsGrid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-user-tie" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Нет менторов по финансам</h5>
                <p style="color: var(--text-secondary); opacity: 0.7;">Попробуйте позже</p>
            </div>
        `;
        return;
    }
    
    investorsMentorsGrid.innerHTML = financeMentors.map(mentor => `
        <div class="mentor-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;">
            <div class="mentor-avatar" style="width: 60px; height: 60px; background-color: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent-color);">
                ${mentor.avatar || '<i class="fas fa-user-tie"></i>'}
            </div>
            <div class="mentor-info" style="flex: 1;">
                <h4 style="margin-bottom: 4px; color: var(--text-primary);">${mentor.name}</h4>
                <p class="mentor-specialty" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 4px;">${mentor.specialty}</p>
                <p class="mentor-experience" style="color: var(--text-tertiary); font-size: 12px;">${mentor.experience}</p>
            </div>
        </div>
    `).join('');
}

// ==================== ОБНОВЛЕНИЕ ДОСТУПНЫХ МЕНТОРОВ ====================
function updateAvailableMentors() {
    const availableMentorsGrid = document.getElementById('availableMentorsGrid');
    if (!availableMentorsGrid) return;
    
    const availableMentors = appState.mentors.filter(m => m.available).slice(0, 4);
    
    if (availableMentors.length === 0) {
        availableMentorsGrid.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px 20px;">
                <i class="fas fa-user-tie" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Нет доступных менторов</h5>
                <p style="color: var(--text-secondary); opacity: 0.7;">Попробуйте позже</p>
            </div>
        `;
        return;
    }
    
    availableMentorsGrid.innerHTML = availableMentors.map(mentor => `
        <div class="mentor-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px;">
            <div class="mentor-avatar" style="width: 60px; height: 60px; background-color: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--accent-color);">
                ${mentor.avatar || '<i class="fas fa-user-tie"></i>'}
            </div>
            <div class="mentor-info" style="flex: 1;">
                <h4 style="margin-bottom: 4px; color: var(--text-primary);">${mentor.name}</h4>
                <p class="mentor-specialty" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 8px;">${mentor.specialty}</p>
                <div class="mentor-stats" style="display: flex; gap: 16px;">
                    <span class="mentor-rating" style="display: flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 12px;">
                        <i class="fas fa-star" style="color: #FFD700;"></i> ${mentor.rating}
                    </span>
                    <span class="mentor-status available" style="display: flex; align-items: center; gap: 4px; color: #10B981; font-size: 12px;">
                        <i class="fas fa-circle" style="font-size: 8px;"></i> Доступен
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== КОНТАКТ С МЕНТОРОМ ====================
function contactMentor(mentorId) {
    if (!appState.currentUser) {
        showNotification('Для связи с ментором нужно войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    const mentor = appState.mentors.find(m => m.id === mentorId);
    if (mentor) {
        showNotification(`Свяжитесь с ${mentor.name} через форму на сайте`, 'info');
    }
}

// ==================== РЕНДЕРИНГ КУРСОВ ====================
function renderCourses() {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;
    
    const allCourses = [...appState.courses.ru, ...appState.courses.en];
    
    if (allCourses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <i class="fas fa-graduation-cap" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">Курсы по предпринимательству</h5>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    ${appState.language === 'kz' ? 'Курстар табылмады' : 
                     appState.language === 'en' ? 'No courses found' : 
                     'Курсы не найдены'}
                </p>
                <p style="color: var(--text-tertiary);">
                    ${appState.language === 'kz' ? 'Курстар жақын арада қосылады' : 
                     appState.language === 'en' ? 'Courses will be added soon' : 
                     'Курсы будут добавлены в ближайшее время'}
                </p>
            </div>
        `;
        return;
    }
    
    coursesGrid.innerHTML = allCourses.map(course => `
        <div class="course-card" data-link="${course.link}" data-lang="${course.language}" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; height: 100%;">
            <div class="course-number" style="position: absolute; top: 16px; left: 16px; background-color: var(--accent-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; z-index: 1;">${course.number}</div>
            <div class="course-image" style="width: 100%; height: 120px; overflow: hidden; position: relative;">
                <img src="${course.image}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="course-content" style="padding: 20px;">
                <h4 style="margin-bottom: 12px; color: var(--text-primary); font-size: 18px; line-height: 1.3;">${course.title}</h4>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; line-height: 1.4;">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="course-language" style="background-color: ${course.language === 'RU' ? 'rgba(255, 122, 0, 0.1)' : 'rgba(59, 130, 246, 0.1)'}; color: ${course.language === 'RU' ? 'var(--accent-color)' : '#3B82F6'}; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                        ${course.language}
                    </span>
                    <span class="course-price" style="color: var(--text-primary); font-weight: 600; font-size: 14px;">${course.price}</span>
                </div>
                ${course.studentPrice ? `<p class="course-student-price" style="color: var(--text-tertiary); font-size: 12px; margin-bottom: 12px;">${course.studentPrice}</p>` : ''}
                <div class="course-category" style="background-color: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 12px; display: inline-block;">${course.category}</div>
            </div>
        </div>
    `).join('');
}

// ==================== ФИЛЬТРАЦИЯ КУРСОВ ====================
function filterCourses(lang) {
    const coursesGrid = document.getElementById('coursesGrid');
    if (!coursesGrid) return;
    
    let filteredCourses = [];
    
    if (lang === 'all') {
        filteredCourses = [...appState.courses.ru, ...appState.courses.en];
    } else if (lang === 'ru') {
        filteredCourses = appState.courses.ru;
    } else if (lang === 'en') {
        filteredCourses = appState.courses.en;
    }
    
    // Обновляем активную кнопку фильтра
    document.querySelectorAll('.course-filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    if (filteredCourses.length === 0) {
        coursesGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
                <i class="fas fa-graduation-cap" style="font-size: 48px; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h5 style="margin-bottom: 10px; color: var(--text-primary);">
                    ${lang === 'ru' ? 'Русскоязычные курсы' : 
                      lang === 'en' ? 'English courses' : 
                      'Все курсы'}
                </h5>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    ${appState.language === 'kz' ? 'Курстар табылмады' : 
                     appState.language === 'en' ? 'No courses found' : 
                     'Курсы не найдены'}
                </p>
            </div>
        `;
        return;
    }
    
    coursesGrid.innerHTML = filteredCourses.map(course => `
        <div class="course-card" data-link="${course.link}" data-lang="${course.language}" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s ease; height: 100%;">
            <div class="course-number" style="position: absolute; top: 16px; left: 16px; background-color: var(--accent-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; z-index: 1;">${course.number}</div>
            <div class="course-image" style="width: 100%; height: 120px; overflow: hidden; position: relative;">
                <img src="${course.image}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="course-content" style="padding: 20px;">
                <h4 style="margin-bottom: 12px; color: var(--text-primary); font-size: 18px; line-height: 1.3;">${course.title}</h4>
                <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; line-height: 1.4;">${course.description}</p>
                <div class="course-meta" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span class="course-language" style="background-color: ${course.language === 'RU' ? 'rgba(255, 122, 0, 0.1)' : 'rgba(59, 130, 246, 0.1)'}; color: ${course.language === 'RU' ? 'var(--accent-color)' : '#3B82F6'}; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                        ${course.language}
                    </span>
                    <span class="course-price" style="color: var(--text-primary); font-weight: 600; font-size: 14px;">${course.price}</span>
                </div>
                ${course.studentPrice ? `<p class="course-student-price" style="color: var(--text-tertiary); font-size: 12px; margin-bottom: 12px;">${course.studentPrice}</p>` : ''}
                <div class="course-category" style="background-color: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 12px; display: inline-block;">${course.category}</div>
            </div>
        </div>
    `).join('');
}

// ==================== ОТКРЫТИЕ ЭТАПА ОБУЧЕНИЯ ====================
function openLearningStage(stage) {
    const stageTitles = {
        'idea': { ru: 'Идея и валидация', kz: 'Идея және валидация', en: 'Idea and Validation' },
        'check': { ru: 'Проверка идеи', kz: 'Идеяны тексеру', en: 'Idea Validation' },
        'mvp': { ru: 'Разработка MVP', kz: 'MVP әзірлеу', en: 'MVP Development' },
        'test': { ru: 'Тестирование', kz: 'Сынау', en: 'Testing' },
        'dev': { ru: 'Разработка', kz: 'Әзірлеу', en: 'Development' },
        'promo': { ru: 'Продвижение', kz: 'Насихаттау', en: 'Promotion' },
        'funding': { ru: 'Привлечение инвестиций', kz: 'Инвестиция тарту', en: 'Funding' },
        'scale': { ru: 'Масштабирование', kz: 'Масштабтау', en: 'Scaling' },
        'term': { ru: 'Термины', kz: 'Терминдер', en: 'Terms' }
    };
    
    const title = stageTitles[stage] ? stageTitles[stage][appState.language] || stageTitles[stage].ru : stage;
    showNotification(`Открыт этап: ${title}`, 'info');
}

// ==================== ПОЛУЧЕНИЕ AI-РЕКОМЕНДАЦИЙ ====================
function getAIRecommendations() {
    if (!appState.currentUser) {
        showNotification('Для получения рекомендаций нужно войти в систему', 'error');
        showLoginModal();
        return;
    }
    
    showNotification('AI анализирует ваш профиль и подбирает рекомендации...', 'info');
    
    // Имитация работы AI
    setTimeout(() => {
        const recommendations = [
            'Обратите внимание на проекты в сфере AI',
            'Рекомендуем пройти курс по основам предпринимательства',
            'Найдите ментора в вашей нише',
            'Изучите проекты в стадии масштабирования',
            'Посмотрите стартапы в вашем регионе'
        ];
        
        showNotification(`AI рекомендует: ${recommendations[Math.floor(Math.random() * recommendations.length)]}`, 'success');
    }, 1500);
}

// ==================== РЕНДЕРИНГ СТАРТАПОВ ПОЛЬЗОВАТЕЛЯ ====================
function renderUserStartups() {
    const userStartupsGrid = document.getElementById('myStartupsGrid');
    if (!userStartupsGrid || !appState.currentUser) return;
    
    const userStartups = appState.startups.filter(
        startup => startup.author === appState.currentUser.id && !startup.isDraft
    );
    
    const emptyState = document.getElementById('emptyStartupsState');
    
    if (userStartups.length === 0) {
        userStartupsGrid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    userStartupsGrid.innerHTML = userStartups.map(startup => `
        <div class="dashboard-startup-card" style="background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; transition: all 0.3s ease;">
            <div class="startup-card-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <h4 style="color: var(--text-primary); margin: 0; font-size: 18px; line-height: 1.3;">${startup.name}</h4>
                <div class="startup-card-actions" style="display: flex; gap: 8px;">
                    <button class="btn-icon edit-startup" data-id="${startup.id}" title="Редактировать" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease; font-size: 16px;">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-startup" data-id="${startup.id}" title="Удалить" style="background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 8px; border-radius: 6px; transition: all 0.2s ease; font-size: 16px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p class="startup-card-goal" style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px; line-height: 1.4;">${startup.goal}</p>
            <div class="startup-card-stats" style="display: flex; gap: 16px; margin-bottom: 16px;">
                <span class="stat" style="display: flex; align-items: center; gap: 4px; color: var(--text-tertiary); font-size: 12px;">
                    <i class="fas fa-eye" style="color: var(--text-secondary);"></i>
                    ${startup.views || 0}
                </span>
                <span class="stat" style="display: flex; align-items: center; gap: 4px; color: var(--text-tertiary); font-size: 12px;">
                    <i class="fas fa-heart" style="color: var(--text-secondary);"></i>
                    ${startup.likes || 0}
                </span>
                <span class="stat" style="display: flex; align-items: center; gap: 4px; color: var(--text-tertiary); font-size: 12px;">
                    <i class="fas fa-comment" style="color: var(--text-secondary);"></i>
                    ${startup.comments ? startup.comments.length : 0}
                </span>
            </div>
            <div class="startup-card-meta" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                <span class="tag" style="background-color: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">${startup.category}</span>
                <span class="tag" style="background-color: var(--bg-tertiary); color: var(--text-secondary); padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">${startup.stage}</span>
                <span class="date" style="color: var(--text-tertiary); font-size: 12px; margin-left: auto;">${formatDate(startup.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

// ==================== ОБНОВЛЕНИЕ СТАТИСТИКИ ЛИЧНОГО КАБИНЕТА ====================
function updateDashboardStats() {
    if (!appState.currentUser) return;
    
    const userStartups = appState.startups.filter(
        startup => startup.author === appState.currentUser.id && !startup.isDraft
    );
    
    const totalLikes = userStartups.reduce((sum, startup) => sum + (startup.likes || 0), 0);
    const totalComments = userStartups.reduce((sum, startup) => sum + (startup.comments ? startup.comments.length : 0), 0);
    
    // Обновляем элементы статистики
    const statsElements = {
        'publishedCount': userStartups.length,
        'draftsCount': appState.drafts.length,
        'likesCount': totalLikes,
        'myLikesCount': appState.startups.filter(s => s.likedByUser).length,
        'myCommentsCount': totalComments,
        'myProjectsLikes': totalLikes
    };
    
    for (const [id, value] of Object.entries(statsElements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

// ==================== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ЛИЧНОГО КАБИНЕТА ====================
function switchDashboardTab(tabName) {
    // Обновляем активные кнопки меню
    document.querySelectorAll('.dashboard-menu-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем активные вкладки контента
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === `${tabName}Tab`) {
            tab.classList.add('active');
        }
    });
}

// ==================== РЕДАКТИРОВАНИЕ СТАРТАПА ====================
function editStartup(startupId) {
    const startup = appState.startups.find(s => s.id == startupId);
    if (!startup) return;
    
    showNotification(`Редактирование стартапа "${startup.name}"`, 'info');
    // Реализуйте открытие формы редактирования
}

// ==================== УДАЛЕНИЕ СТАРТАПА ====================
function deleteStartup(startupId) {
    if (!confirm('Вы уверены, что хотите удалить этот стартап?')) {
        return;
    }
    
    const index = appState.startups.findIndex(s => s.id == startupId);
    if (index !== -1) {
        appState.startups.splice(index, 1);
        saveStartupsToStorage();
        updateAllStartupGrids();
        renderUserStartups();
        updateDashboardStats();
        showNotification('Стартап удален', 'success');
    }
}

// ==================== ОБНОВЛЕНИЕ ЯЗЫКОВЫХ ТЕКСТОВ ====================
function updateLanguageTexts() {
    const lang = appState.language;
    
    // Обновляем заголовки страниц
    const pageTitles = {
        home: { ru: 'Главная', kz: 'Басты бет', en: 'Home' },
        catalog: { ru: 'Каталог стартапов', kz: 'Стартаптар каталогы', en: 'Startup Catalog' },
        publish: { ru: 'Опубликовать стартап', kz: 'Стартап жариялау', en: 'Publish Startup' },
        investors: { ru: 'Инвесторам', kz: 'Инвесторларға', en: 'For Investors' },
        learning: { ru: 'Стартап-обучение', kz: 'Стартап-оқыту', en: 'Startup Learning' },
        dashboard: { ru: 'Личный кабинет', kz: 'Жеке кабинет', en: 'Personal Account' }
    };
    
    if (pageTitle && pageTitles[appState.currentPage]) {
        pageTitle.textContent = pageTitles[appState.currentPage][lang] || 
                               pageTitles[appState.currentPage]['ru'];
    }
}

// ==================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ====================
(function initializeOnLoad() {
    const firstRun = localStorage.getItem('startupHub_first_run');
    if (!firstRun) {
        // Очищаем все старые демо-данные
        localStorage.removeItem('startupHub_startups');
        localStorage.removeItem('startupHub_mentors');
        localStorage.removeItem('startupHub_likes');
        localStorage.removeItem('startupHub_drafts');
        
        // Устанавливаем флаг первого запуска
        localStorage.setItem('startupHub_first_run', 'true');
        console.log('Первый запуск приложения, все демо-данные очищены');
    }
})();

// ==================== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ ИСПОЛЬЗОВАНИЯ В HTML ====================
window.toggleLike = toggleLike;
window.showLoginModal = showLoginModal;
window.hideStartupDetailModal = hideStartupDetailModal;
window.openLearningStage = openLearningStage;
window.getAIRecommendations = getAIRecommendations;
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
window.contactStartup = contactStartup;
window.contactMentor = contactMentor;
window.switchAuthTab = switchAuthTab;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.changePage = changePage;
window.filterCourses = filterCourses;
window.switchDashboardTab = switchDashboardTab;
window.editStartup = editStartup;
window.deleteStartup = deleteStartup;