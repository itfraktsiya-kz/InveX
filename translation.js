// translations.js
// Полный перевод всего сайта InveX

const translations = {
    ru: {
        // Навигация и общие элементы
        "home": "Главная",
        "catalog": "Каталог стартапов",
        "publish": "Опубликовать стартап",
        "investors": "Инвесторам",
        "learning": "Стартап-обучение",
        "dashboard": "Личный кабинет",
        "login": "Вход",
        "register": "Регистрация",
        "logout": "Выйти",
        "search_placeholder": "Поиск стартапов...",
        "view_all": "Смотреть все стартапы",
        "all_categories": "Все категории",
        "all_stages": "Все стадии",
        "apply_filters": "Применить фильтры",
        "reset_filters": "Сбросить",
        "category_label": "Категория:",
        "stage_label": "Стадия:",
        
        // Главная страница
        "hero_title": "Соединяем стартапы с инвесторами",
        "hero_subtitle": "Платформа для представления инновационных проектов и поиска инвестиций",
        "explore_btn": "Исследовать стартапы",
        "publish_btn": "Опубликовать проект",
        "stats_startups": "Стартапов",
        "stats_mentors": "Менторов",
        "stats_deals": "Успешных сделок",
        "top_projects": "Топ проектов по рейтингу",
        "top_likes": "Топ лайков за неделю",
        "top_mentors": "Топ менторов",
        "latest_startups": "Последние стартапы",
        "featured_projects": "Рекомендуемые проекты",
        
        // Каталог
        "catalog_title": "Каталог стартапов",
        
        // Публикация стартапа
        "publish_title": "Опубликовать новый стартап",
        "publish_subtitle": "Заполните форму, чтобы представить свой проект инвесторам",
        "basic_info": "Основная информация",
        "startup_name": "Название стартапа *",
        "name_placeholder": "Введите название вашего проекта",
        "project_goal": "Цель проекта *",
        "goal_placeholder": "Кратко опишите цель вашего проекта (1-2 предложения)",
        "full_description": "Полное описание *",
        "description_placeholder": "Подробное описание проекта, проблема, решение, уникальность",
        "project_stage": "Стадия проекта *",
        "select_category": "Выберите категорию",
        "select_stage": "Выберите стадию",
        
        "team_finance_info": "Команда и финансы",
        "team_size": "Размер команды",
        "project_cost": "Стоимость проекта ($)",
        "monthly_expenses": "Ежемесячные расходы ($)",
        "investment_asked": "Запрашиваемые инвестиции ($) *",
        
        "market_traction": "Рынок и тракшн",
        "market_size": "Размер рынка",
        "target_audience": "Целевая аудитория",
        "region": "Регион",
        "traction_users": "Пользователи/Клиенты",
        "traction_revenue": "Выручка ($)",
        
        "links_contacts": "Ссылки и контакты",
        "github_link": "GitHub репозиторий",
        "github_placeholder": "https://github.com/ваш-проект",
        "website_link": "Demo / Веб-сайт",
        "website_placeholder": "https://ваш-сайт.com",
        "contact_email": "Контактный email *",
        "email_placeholder": "contact@ваш-стартап.com",
        "telegram_contact": "Telegram для связи *",
        "telegram_placeholder": "@username или ссылка",
        "telegram_hint": "Обязательное поле для связи инвесторов с вами",
        
        "save_draft": "Сохранить как черновик",
        "publish_startup": "Опубликовать стартап",
        
        // Инвесторам
        "investors_title": "Инвесторам",
        "investors_subtitle": "Как использовать платформу для поиска инвестиционных возможностей",
        "search_startups": "Поиск стартапов",
        "search_text": "Используйте фильтры по категориям и стадиям для поиска проектов, соответствующих вашим инвестиционным критериям.",
        "filtering": "Фильтрация",
        "filter_text": "Отбирайте проекты по технологической сфере, стадии развития, географии и другим параметрам.",
        "ai_matching": "AI-мэтчинг",
        "ai_matching_text": "Наш ИИ автоматически подбирает проекты, соответствующие вашим инвестиционным интересам.",
        
        "investors_guide": "Пошаговое руководство для инвесторов",
        "step1_title": "Зарегистрируйтесь как инвестор",
        "step1_text": "Создайте аккаунт и укажите ваши инвестиционные интересы, бюджет и регионы.",
        "step2_title": "Привяжите Telegram",
        "step2_text": "Для связи со стартапами необходимо привязать Telegram аккаунт.",
        "step3_title": "Изучите каталог стартапов",
        "step3_text": "Просматривайте проекты, используя поиск, фильтры и AI-рекомендации.",
        "step4_title": "Свяжитесь через Telegram",
        "step4_text": "Нажмите 'Написать в Telegram' на странице стартапа для прямого общения с основателем.",
        
        "expert_mentors": "Экспертные менторы",
        "expert_mentors_desc": "Свяжитесь с опытными менторами для консультации по инвестициям",
        
        "benefits_title": "Преимущества платформы для инвесторов",
        "benefit1": "Прямой доступ к инновационным проектам",
        "benefit2": "AI-анализ и оценка проектов",
        "benefit3": "Прямая связь с основателями через Telegram",
        "benefit4": "Фильтрация по инвестиционным критериям",
        "benefit5": "Нет посредников, общение напрямую",
        
        // Обучение
        "learning_title": "Стартап-обучение",
        "learning_subtitle": "Пошаговое руководство по созданию и развитию вашего стартапа",
        
        "how_it_works": "Как работает обучение",
        "work_step1": "Выберите этап",
        "work_step1_desc": "Начните с любого этапа в зависимости от текущей стадии вашего проекта",
        "work_step2": "Изучите материалы",
        "work_step2_desc": "Получите доступ к практическим руководствам, шаблонам и примерам",
        "work_step3": "Примените на практике",
        "work_step3_desc": "Выполняйте задания и получайте обратную связь через Telegram-бота",
        "work_step4": "Найдите ментора",
        "work_step4_desc": "Получите помощь опытного ментора через Telegram",
        
        // Этапы обучения
        "step_idea": "Идея",
        "idea_desc": "Проблемы, Идеи, Оценка",
        "initial_stage": "Начальный этап",
        
        "step_check": "Проверка",
        "check_desc": "Аудитория, Опрос, Конкуренты",
        "active": "Активный",
        
        "step_mvp": "MVP",
        "mvp_desc": "Минимум, Ценность, Тест",
        "next": "Следующий",
        
        "step_test": "Тестирование",
        "test_desc": "Аудитория, Обратная связь, Анализ",
        
        "step_dev": "Разработка",
        "dev_desc": "UX/UI, Функции, Безопасность",
        
        "step_promo": "Продвижение",
        "promo_desc": "Соцсети, Кейсы, Контакты",
        
        "step_funding": "Инвестиции",
        "funding_desc": "Питч, Pitch Deck, Метрики",
        
        "step_scale": "Масштабирование",
        "scale_desc": "Автоматизация, Рост, Стратегия",
        
        "step_term": "Термины",
        "term_desc": "Словарь, Аббревиатуры, Сленг",
        
        // Telegram секция
        "telegram_title": "Начните обучение в Telegram-боте",
        "telegram_text": "Получите доступ ко всем материалам и проходите обучение шаг за шагом в удобном формате. Используйте команды для каждого этапа.",
        "go_to_bot": "Перейти в Telegram-бот",
        "steps_count": "этапов",
        "access_24_7": "доступ",
        "ai_assistant": "помощник",
        
        // Курсы
        "courses_title": "Курсы для стартаперов",
        "courses_subtitle": "Лучшие обучающие материалы на русском и английском языках",
        "all_courses": "Все курсы",
        "russian_courses": "Русские курсы",
        "english_courses": "Английские курсы",
        
        // Менторы
        "available_mentors": "Доступные менторы",
        "available_mentors_desc": "Свяжитесь с опытными менторами для помощи в развитии вашего проекта",
        
        // AI рекомендации
        "ai_matching_title": "AI-рекомендации",
        "ai_matching_description": "Получите персонализированные рекомендации по курсам и менторам на основе ваших интересов и стадии проекта",
        "get_recommendations": "Получить рекомендации",
        
        // Личный кабинет
        "dashboard_title": "Личный кабинет",
        "my_startups": "Мои стартапы",
        "my_activity": "Моя активность",
        "mentorship": "Менторство",
        "profile": "Профиль",
        "settings": "Настройки",
        
        "published": "Опубликовано",
        "drafts": "Черновики",
        "likes": "Лайки",
        
        "telegram_not_linked": "Telegram не привязан",
        "telegram_linked": "Telegram привязан",
        
        "add_startup": "Добавить стартап",
        "no_startups": "У вас пока нет стартапов",
        "no_startups_text": "Опубликуйте свой первый проект, чтобы показать его инвесторам",
        "publish_first_startup": "Опубликовать стартап",
        
        "likes_given": "Лайков поставлено",
        "comments_written": "Комментариев написано",
        "my_projects_likes": "Лайки моих проектов",
        "recent_activity": "Последняя активность",
        
        "not_mentor": "Вы не являетесь ментором",
        "become_mentor_desc": "Станьте ментором и помогайте другим стартаперам",
        "become_mentor": "Стать ментором",
        "mentorship_requests": "Заявки на менторство",
        "my_mentees": "Мои подопечные",
        
        "profile_settings": "Настройки профиля",
        "name": "Имя",
        "enter_name": "Введите ваше имя",
        "email": "Email",
        "enter_email": "Введите ваш email",
        "about_me": "О себе",
        "about_placeholder": "Расскажите о себе, вашем опыте и интересах",
        "role": "Роль",
        "role_founder": "Основатель стартапа",
        "role_investor": "Инвестор",
        "role_mentor": "Ментор",
        "skills": "Навыки",
        "skills_placeholder": "Введите ваши навыки через запятую",
        "telegram_link": "Привязка Telegram",
        "link_telegram": "Привязать Telegram",
        "save_changes": "Сохранить изменения",
        
        "appearance": "Внешний вид",
        "interface_theme": "Тема интерфейса",
        "theme_dark": "Тёмная",
        "theme_light": "Светлая",
        "interface_language": "Язык интерфейса",
        
        "notifications": "Уведомления",
        "email_notifications": "Email уведомления",
        "telegram_notifications": "Telegram уведомления",
        
        "security": "Безопасность",
        "current_password": "Текущий пароль",
        "enter_current_password": "Введите текущий пароль",
        "new_password": "Новый пароль",
        "enter_new_password": "Введите новый пароль",
        "confirm_password": "Подтвердите пароль",
        "confirm_new_password": "Подтвердите новый пароль",
        "change_password": "Именить пароль",
        
        // Модальные окна
        "login_title": "Вход в аккаунт",
        "remember_me": "Запомнить меня",
        "forgot_password": "Забыли пароль?",
        "create_password": "Создайте пароль",
        "password_requirements": "Минимум 8 символов, заглавные и строчные буквы, цифры",
        "select_role": "Выберите роль",
        
        // Уведомления
        "notification_success": "Успешно",
        "notification_error": "Ошибка",
        "notification_info": "Информация",
        
        // Категории стартапов
        "IT": "IT",
        "AI": "AI / Машинное обучение",
        "FinTech": "FinTech",
        "EdTech": "EdTech",
        "Health": "Health / Медицина",
        "Eco": "Экология",
        "Ecommerce": "E-commerce",
        "Other": "Другое",
        
        // Стадии проекта
        "idea": "Идея",
        "mvp": "MVP",
        "beta": "Бета-версия",
        "ready": "Готовый продукт",
        "scaling": "Масштабирование",
        
        // Плейсхолдеры
        "enter_password": "Введите пароль",
        
        // Общие
        "loading": "Загрузка...",
        "save": "Сохранить",
        "cancel": "Отмена",
        "delete": "Удалить",
        "edit": "Редактировать",
        "view": "Просмотр",
        "back": "Назад",
        "next_page": "Далее",
        "previous_page": "Назад",
        "page": "Страница",
        "of": "из",
        "items": "элементов",
        "no_data": "Нет данных",
        "error_loading": "Ошибка загрузки",
        "try_again": "Попробовать снова"
    },
    
    kz: {
        // Навигация и общие элементы
        "home": "Басты бет",
        "catalog": "Стартаптар каталогы",
        "publish": "Стартап жариялау",
        "investors": "Инвесторларға",
        "learning": "Стартап-оқыту",
        "dashboard": "Жеке кабинет",
        "login": "Кіру",
        "register": "Тіркелу",
        "logout": "Шығу",
        "search_placeholder": "Стартаптарды іздеу...",
        "view_all": "Барлық стартаптарды қарау",
        "all_categories": "Барлық санаттар",
        "all_stages": "Барлық кезеңдер",
        "apply_filters": "Сүзгілерді қолдану",
        "reset_filters": "Қалпына келтіру",
        "category_label": "Санат:",
        "stage_label": "Кезең:",
        
        // Главная страница
        "hero_title": "Стартаптар мен инвесторларды байланыстырамыз",
        "hero_subtitle": "Инновациялық жобаларды ұсыну және инвестиция іздеу платформасы",
        "explore_btn": "Стартаптарды зерттеу",
        "publish_btn": "Жобаны жариялау",
        "stats_startups": "Стартаптар",
        "stats_mentors": "Менторлар",
        "stats_deals": "Сәтті мәмілелер",
        "top_projects": "Рейтинг бойынша үздік жобалар",
        "top_likes": "Соңғы аптадағы үздік лайктар",
        "top_mentors": "Үздік менторлар",
        "latest_startups": "Соңғы стартаптар",
        "featured_projects": "Ұсынылатын жобалар",
        
        // Каталог
        "catalog_title": "Стартаптар каталогы",
        
        // Публикация стартапа
        "publish_title": "Жаңа стартапты жариялау",
        "publish_subtitle": "Өз жобаңызды инвесторларға ұсыну үшін форманы толтырыңыз",
        "basic_info": "Негізгі ақпарат",
        "startup_name": "Стартап атауы *",
        "name_placeholder": "Жобаңыздың атауын енгізіңіз",
        "project_goal": "Жоба мақсаты *",
        "goal_placeholder": "Жобаңыздың мақсатын қысқаша сипаттаңыз (1-2 сөйлем)",
        "full_description": "Толық сипаттама *",
        "description_placeholder": "Жобаның егжей-тегжейлі сипаттамасы, мәселе, шешім, бірегейлік",
        "project_stage": "Жоба кезеңі *",
        "select_category": "Санатты таңдаңыз",
        "select_stage": "Кезеңді таңдаңыз",
        
        "team_finance_info": "Команда және қаржы",
        "team_size": "Команда мөлшері",
        "project_cost": "Жоба құны ($)",
        "monthly_expenses": "Ай сайынғы шығындар ($)",
        "investment_asked": "Сұралатын инвестициялар ($) *",
        
        "market_traction": "Нарық және тартымдылық",
        "market_size": "Нарық көлемі",
        "target_audience": "Мақсатты аудитория",
        "region": "Аймақ",
        "traction_users": "Пайдаланушылар/Клиенттер",
        "traction_revenue": "Табыс ($)",
        
        "links_contacts": "Сілтемелер және байланыстар",
        "github_link": "GitHub репозиторийі",
        "github_placeholder": "https://github.com/сіздің-жобаңыз",
        "website_link": "Demo / Веб-сайт",
        "website_placeholder": "https://сіздің-сайтыңыз.com",
        "contact_email": "Байланыс email *",
        "email_placeholder": "contact@сіздің-стартапыңыз.com",
        "telegram_contact": "Байланыс үшін Telegram *",
        "telegram_placeholder": "@username немесе сілтеме",
        "telegram_hint": "Инвесторлармен байланыс үшін міндетті өріс",
        
        "save_draft": "Жоба нұсқасы ретінде сақтау",
        "publish_startup": "Стартапты жариялау",
        
        // Инвесторам
        "investors_title": "Инвесторларға",
        "investors_subtitle": "Инвестициялық мүмкіндіктерді іздеу үшін платформаны қалай пайдалану керек",
        "search_startups": "Стартаптарды іздеу",
        "search_text": "Өз инвестициялық критерийлеріңізге сәйкес келетін жобаларды іздеу үшін санаттар және кезеңдер бойынша сүзгілерді пайдаланыңыз.",
        "filtering": "Сүзгілеу",
        "filter_text": "Технологиялық сала, даму кезеңі, география және басқа параметрлер бойынша жобаларды таңдаңыз.",
        "ai_matching": "AI-сәйкестендіру",
        "ai_matching_text": "Біздің ЖС инвестициялық мүдделеріңізге сәйкес келетін жобаларды автоматты түрде таңдайды.",
        
        "investors_guide": "Инвесторларға арналған қадамдық нұсқаулық",
        "step1_title": "Инвестор ретінде тіркеліңіз",
        "step1_text": "Аккаунт құрып, инвестициялық мүдделеріңізді, бюджетіңізді және аймақтарыңызды көрсетіңіз.",
        "step2_title": "Telegram-ды байланыстырыңыз",
        "step2_text": "Стартаптармен байланыс үшін Telegram аккаунтын байланыстыру қажет.",
        "step3_title": "Стартаптар каталогын зерттеңіз",
        "step3_text": "Іздеу, сүзгілер және AI-ұсыныстарды пайдаланып жобаларды қараңыз.",
        "step4_title": "Telegram арқылы байланысыңыз",
        "step4_text": "Негіз қалушымен тікелей сөйлесу үшін стартап бетінде 'Telegram-да жазу' батырмасын басыңыз.",
        
        "expert_mentors": "Сарапшы менторлар",
        "expert_mentors_desc": "Инвестициялар бойынша кеңес алу үшін тәжірибелі менторлармен байланысыңыз",
        
        "benefits_title": "Инвесторларға арналған платформа артықшылықтары",
        "benefit1": "Инновациялық жобаларға тікелей қол жетімділік",
        "benefit2": "AI-талдау және жобаларды бағалау",
        "benefit3": "Негіз қалушылармен Telegram арқылы тікелей байланыс",
        "benefit4": "Инвестициялық критерийлер бойынша сүзгілеу",
        "benefit5": "Делеушілер жоқ, тікелей қарым-қатынас",
        
        // Обучение
        "learning_title": "Стартап-оқыту",
        "learning_subtitle": "Стартап құру және дамыту бойынша қадамдық нұсқаулық",
        
        "how_it_works": "Оқыту қалай жұмыс істейді",
        "work_step1": "Кезеңді таңдаңыз",
        "work_step1_desc": "Жобаңыздың ағымдағы кезеңіне байланысты кез келген кезеңнен бастаңыз",
        "work_step2": "Материалдарды зерттеңіз",
        "work_step2_desc": "Практикалық нұсқаулықтарға, үлгілерге және мысалдарға қол жеткізіңіз",
        "work_step3": "Практикада қолданыңыз",
        "work_step3_desc": "Тапсырмаларды орындап, Telegram-бот арқылы кері байланыс алыңыз",
        "work_step4": "Ментор табыңыз",
        "work_step4_desc": "Тәжірибелі ментордың көмегін Telegram арқылы алыңыз",
        
        // Этапы обучения
        "step_idea": "Идея",
        "idea_desc": "Мәселелер, Идеялар, Бағалау",
        "initial_stage": "Бастапқы кезең",
        
        "step_check": "Тексеру",
        "check_desc": "Аудитория, Сауалнама, Бәсекелестер",
        "active": "Белсенді",
        
        "step_mvp": "MVP",
        "mvp_desc": "Минимум, Құндылық, Сынақ",
        "next": "Келесі",
        
        "step_test": "Сынақ",
        "test_desc": "Аудитория, Кері байланыс, Талдау",
        
        "step_dev": "Әзірлеу",
        "dev_desc": "UX/UI, Функциялар, Қауіпсіздік",
        
        "step_promo": "Насихаттау",
        "promo_desc": "Әлеуметтік желілер, Кейстер, Байланыстар",
        
        "step_funding": "Инвестициялар",
        "funding_desc": "Питч, Pitch Deck, Метрикалар",
        
        "step_scale": "Масштабтау",
        "scale_desc": "Автоматтандыру, Өсу, Стратегия",
        
        "step_term": "Терминдер",
        "term_desc": "Сөздік, Аббревиатуралар, Сленг",
        
        // Telegram секция
        "telegram_title": "Telegram-ботта оқуды бастаңыз",
        "telegram_text": "Барлық материалдарға қол жеткізіп, ыңғайлы форматта қадамдық оқыңыз. Әрбір кезең үшін командаларды пайдаланыңыз.",
        "go_to_bot": "Telegram-ботқа өту",
        "steps_count": "кезеңдер",
        "access_24_7": "қол жетімділік",
        "ai_assistant": "көмекші",
        
        // Курсы
        "courses_title": "Стартаперлерге арналған курстар",
        "courses_subtitle": "Орыс және ағылшын тілдеріндегі үздік оқу материалдары",
        "all_courses": "Барлық курстар",
        "russian_courses": "Орыс курстары",
        "english_courses": "Ағылшын курстары",
        
        // Менторы
        "available_mentors": "Қол жетімді менторлар",
        "available_mentors_desc": "Жобаңызды дамытуға көмектесу үшін тәжірибелі менторлармен байланысыңыз",
        
        // AI рекомендации
        "ai_matching_title": "AI-ұсыныстар",
        "ai_matching_description": "Қызығушылықтарыңыз және жоба кезеңіңіз негізінде курстар мен менторлар бойынша жекелендірілген ұсыныстар алыңыз",
        "get_recommendations": "Ұсыныстар алу",
        
        // Личный кабинет
        "dashboard_title": "Жеке кабинет",
        "my_startups": "Менің стартаптарым",
        "my_activity": "Менің белсенділігім",
        "mentorship": "Менторлық",
        "profile": "Профиль",
        "settings": "Баптаулар",
        
        "published": "Жарияланған",
        "drafts": "Жоба нұсқалары",
        "likes": "Лайктар",
        
        "telegram_not_linked": "Telegram байланыстырылмаған",
        "telegram_linked": "Telegram байланыстырылған",
        
        "add_startup": "Стартап қосу",
        "no_startups": "Сізде әлі стартаптар жоқ",
        "no_startups_text": "Бірінші жобаңызды инвесторларға көрсету үшін жариялаңыз",
        "publish_first_startup": "Стартап жариялау",
        
        "likes_given": "Қойылған лайктар",
        "comments_written": "Жазылған пікірлер",
        "my_projects_likes": "Менің жобаларымның лайктары",
        "recent_activity": "Соңғы белсенділік",
        
        "not_mentor": "Сіз ментор емессіз",
        "become_mentor_desc": "Ментор болып, басқа стартаперлерге көмектесіңіз",
        "become_mentor": "Ментор болу",
        "mentorship_requests": "Менторлық сұраулар",
        "my_mentees": "Менің оқушыларым",
        
        "profile_settings": "Профиль баптаулары",
        "name": "Аты",
        "enter_name": "Атыңызды енгізіңіз",
        "email": "Email",
        "enter_email": "Email-ді енгізіңіз",
        "about_me": "Өзім туралы",
        "about_placeholder": "Өзіңіз, тәжірибеңіз және қызығушылықтарыңыз туралы айтыңыз",
        "role": "Рөл",
        "role_founder": "Стартап негізін қалаушы",
        "role_investor": "Инвестор",
        "role_mentor": "Ментор",
        "skills": "Дағдылар",
        "skills_placeholder": "Дағдыларыңызды үтірмен енгізіңіз",
        "telegram_link": "Telegram байланыстыру",
        "link_telegram": "Telegram байланыстыру",
        "save_changes": "Өзгерістерді сақтау",
        
        "appearance": "Сыртқы түрі",
        "interface_theme": "Интерфейс тақырыбы",
        "theme_dark": "Қараңғы",
        "theme_light": "Ашық",
        "interface_language": "Интерфейс тілі",
        
        "notifications": "Хабарландырулар",
        "email_notifications": "Email хабарландырулары",
        "telegram_notifications": "Telegram хабарландырулары",
        
        "security": "Қауіпсіздік",
        "current_password": "Ағымдағы құпия сөз",
        "enter_current_password": "Ағымдағы құпия сөзді енгізіңіз",
        "new_password": "Жаңа құпия сөз",
        "enter_new_password": "Жаңа құпия сөзді енгізіңіз",
        "confirm_password": "Құпия сөзді растаңыз",
        "confirm_new_password": "Жаңа құпия сөзді растаңыз",
        "change_password": "Құпия сөзді өзгерту",
        
        // Модальные окна
        "login_title": "Аккаунтқа кіру",
        "remember_me": "Мені есте сақтау",
        "forgot_password": "Құпия сөзді ұмыттыңыз ба?",
        "create_password": "Құпия сөз жасау",
        "password_requirements": "Минимум 8 таңба, бас әріптер мен кіші әріптер, сандар",
        "select_role": "Рөлді таңдаңыз",
        
        // Уведомления
        "notification_success": "Сәтті",
        "notification_error": "Қате",
        "notification_info": "Ақпарат",
        
        // Категории стартапов
        "IT": "IT",
        "AI": "AI / Machine Learning",
        "FinTech": "FinTech",
        "EdTech": "EdTech",
        "Health": "Health / Медицина",
        "Eco": "Экология",
        "Ecommerce": "E-commerce",
        "Other": "Басқа",
        
        // Стадии проекта
        "idea": "Идея",
        "mvp": "MVP",
        "beta": "Бета-нұсқа",
        "ready": "Дайын өнім",
        "scaling": "Масштабтау",
        
        // Плейсхолдеры
        "enter_password": "Құпия сөзді енгізіңіз",
        
        // Общие
        "loading": "Жүктелуде...",
        "save": "Сақтау",
        "cancel": "Болдырмау",
        "delete": "Жою",
        "edit": "Өңдеу",
        "view": "Қарау",
        "back": "Артқа",
        "next_page": "Әрі",
        "previous_page": "Артқа",
        "page": "Бет",
        "of": "бастап",
        "items": "элементтер",
        "no_data": "Деректер жоқ",
        "error_loading": "Жүктеу қатесі",
        "try_again": "Қайта байқап көру"
    },
    
    en: {
        // Navigation and common elements
        "home": "Home",
        "catalog": "Startup Catalog",
        "publish": "Publish Startup",
        "investors": "For Investors",
        "learning": "Startup Learning",
        "dashboard": "Personal Account",
        "login": "Login",
        "register": "Register",
        "logout": "Logout",
        "search_placeholder": "Search startups...",
        "view_all": "View all startups",
        "all_categories": "All categories",
        "all_stages": "All stages",
        "apply_filters": "Apply filters",
        "reset_filters": "Reset",
        "category_label": "Category:",
        "stage_label": "Stage:",
        
        // Home page
        "hero_title": "Connecting Startups with Investors",
        "hero_subtitle": "Platform for presenting innovative projects and finding investments",
        "explore_btn": "Explore Startups",
        "publish_btn": "Publish Project",
        "stats_startups": "Startups",
        "stats_mentors": "Mentors",
        "stats_deals": "Successful Deals",
        "top_projects": "Top Rated Projects",
        "top_likes": "Top Likes This Week",
        "top_mentors": "Top Mentors",
        "latest_startups": "Latest Startups",
        "featured_projects": "Featured Projects",
        
        // Catalog
        "catalog_title": "Startup Catalog",
        
        // Publish startup
        "publish_title": "Publish New Startup",
        "publish_subtitle": "Fill out the form to present your project to investors",
        "basic_info": "Basic Information",
        "startup_name": "Startup Name *",
        "name_placeholder": "Enter your project name",
        "project_goal": "Project Goal *",
        "goal_placeholder": "Briefly describe your project goal (1-2 sentences)",
        "full_description": "Full Description *",
        "description_placeholder": "Detailed project description, problem, solution, uniqueness",
        "project_stage": "Project Stage *",
        "select_category": "Select category",
        "select_stage": "Select stage",
        
        "team_finance_info": "Team and Finance",
        "team_size": "Team Size",
        "project_cost": "Project Cost ($)",
        "monthly_expenses": "Monthly Expenses ($)",
        "investment_asked": "Investment Asked ($) *",
        
        "market_traction": "Market and Traction",
        "market_size": "Market Size",
        "target_audience": "Target Audience",
        "region": "Region",
        "traction_users": "Users/Clients",
        "traction_revenue": "Revenue ($)",
        
        "links_contacts": "Links and Contacts",
        "github_link": "GitHub Repository",
        "github_placeholder": "https://github.com/your-project",
        "website_link": "Demo / Website",
        "website_placeholder": "https://your-website.com",
        "contact_email": "Contact Email *",
        "email_placeholder": "contact@your-startup.com",
        "telegram_contact": "Telegram for Contact *",
        "telegram_placeholder": "@username or link",
        "telegram_hint": "Required field for investors to contact you",
        
        "save_draft": "Save as Draft",
        "publish_startup": "Publish Startup",
        
        // For Investors
        "investors_title": "For Investors",
        "investors_subtitle": "How to use the platform to find investment opportunities",
        "search_startups": "Search Startups",
        "search_text": "Use filters by categories and stages to search for projects that match your investment criteria.",
        "filtering": "Filtering",
        "filter_text": "Select projects by technology field, development stage, geography, and other parameters.",
        "ai_matching": "AI Matching",
        "ai_matching_text": "Our AI automatically selects projects that match your investment interests.",
        
        "investors_guide": "Step-by-Step Guide for Investors",
        "step1_title": "Register as an Investor",
        "step1_text": "Create an account and specify your investment interests, budget, and regions.",
        "step2_title": "Connect Telegram",
        "step2_text": "To contact startups, you need to connect a Telegram account.",
        "step3_title": "Explore Startup Catalog",
        "step3_text": "View projects using search, filters, and AI recommendations.",
        "step4_title": "Contact via Telegram",
        "step4_text": "Click 'Write in Telegram' on the startup page for direct communication with the founder.",
        
        "expert_mentors": "Expert Mentors",
        "expert_mentors_desc": "Contact experienced mentors for investment consultation",
        
        "benefits_title": "Platform Benefits for Investors",
        "benefit1": "Direct access to innovative projects",
        "benefit2": "AI analysis and project evaluation",
        "benefit3": "Direct communication with founders via Telegram",
        "benefit4": "Filtering by investment criteria",
        "benefit5": "No intermediaries, direct communication",
        
        // Learning
        "learning_title": "Startup Learning",
        "learning_subtitle": "Step-by-step guide to creating and developing your startup",
        
        "how_it_works": "How Learning Works",
        "work_step1": "Choose Stage",
        "work_step1_desc": "Start with any stage depending on the current stage of your project",
        "work_step2": "Study Materials",
        "work_step2_desc": "Get access to practical guides, templates and examples",
        "work_step3": "Apply in Practice",
        "work_step3_desc": "Complete tasks and get feedback via Telegram bot",
        "work_step4": "Find a Mentor",
        "work_step4_desc": "Get help from an experienced mentor via Telegram",
        
        // Learning stages
        "step_idea": "Idea",
        "idea_desc": "Problems, Ideas, Evaluation",
        "initial_stage": "Initial Stage",
        
        "step_check": "Validation",
        "check_desc": "Audience, Survey, Competitors",
        "active": "Active",
        
        "step_mvp": "MVP",
        "mvp_desc": "Minimum, Value, Test",
        "next": "Next",
        
        "step_test": "Testing",
        "test_desc": "Audience, Feedback, Analysis",
        
        "step_dev": "Development",
        "dev_desc": "UX/UI, Functions, Security",
        
        "step_promo": "Promotion",
        "promo_desc": "Social Media, Case Studies, Contacts",
        
        "step_funding": "Funding",
        "funding_desc": "Pitch, Pitch Deck, Metrics",
        
        "step_scale": "Scaling",
        "scale_desc": "Automation, Growth, Strategy",
        
        "step_term": "Terms",
        "term_desc": "Dictionary, Abbreviations, Slang",
        
        // Telegram section
        "telegram_title": "Start Learning in Telegram Bot",
        "telegram_text": "Get access to all materials and learn step by step in a convenient format. Use commands for each stage.",
        "go_to_bot": "Go to Telegram Bot",
        "steps_count": "stages",
        "access_24_7": "access",
        "ai_assistant": "assistant",
        
        // Courses
        "courses_title": "Courses for Startupers",
        "courses_subtitle": "Best learning materials in Russian and English",
        "all_courses": "All Courses",
        "russian_courses": "Russian Courses",
        "english_courses": "English Courses",
        
        // Mentors
        "available_mentors": "Available Mentors",
        "available_mentors_desc": "Contact experienced mentors for help in developing your project",
        
        // AI Recommendations
        "ai_matching_title": "AI Recommendations",
        "ai_matching_description": "Get personalized recommendations for courses and mentors based on your interests and project stage",
        "get_recommendations": "Get Recommendations",
        
        // Personal Account
        "dashboard_title": "Personal Account",
        "my_startups": "My Startups",
        "my_activity": "My Activity",
        "mentorship": "Mentorship",
        "profile": "Profile",
        "settings": "Settings",
        
        "published": "Published",
        "drafts": "Drafts",
        "likes": "Likes",
        
        "telegram_not_linked": "Telegram not linked",
        "telegram_linked": "Telegram linked",
        
        "add_startup": "Add Startup",
        "no_startups": "You don't have startups yet",
        "no_startups_text": "Publish your first project to show it to investors",
        "publish_first_startup": "Publish Startup",
        
        "likes_given": "Likes Given",
        "comments_written": "Comments Written",
        "my_projects_likes": "My Projects Likes",
        "recent_activity": "Recent Activity",
        
        "not_mentor": "You are not a mentor",
        "become_mentor_desc": "Become a mentor and help other startups",
        "become_mentor": "Become Mentor",
        "mentorship_requests": "Mentorship Requests",
        "my_mentees": "My Mentees",
        
        "profile_settings": "Profile Settings",
        "name": "Name",
        "enter_name": "Enter your name",
        "email": "Email",
        "enter_email": "Enter your email",
        "about_me": "About Me",
        "about_placeholder": "Tell about yourself, your experience and interests",
        "role": "Role",
        "role_founder": "Startup Founder",
        "role_investor": "Investor",
        "role_mentor": "Mentor",
        "skills": "Skills",
        "skills_placeholder": "Enter your skills separated by commas",
        "telegram_link": "Telegram Link",
        "link_telegram": "Link Telegram",
        "save_changes": "Save Changes",
        
        "appearance": "Appearance",
        "interface_theme": "Interface Theme",
        "theme_dark": "Dark",
        "theme_light": "Light",
        "interface_language": "Interface Language",
        
        "notifications": "Notifications",
        "email_notifications": "Email Notifications",
        "telegram_notifications": "Telegram Notifications",
        
        "security": "Security",
        "current_password": "Current Password",
        "enter_current_password": "Enter current password",
        "new_password": "New Password",
        "enter_new_password": "Enter new password",
        "confirm_password": "Confirm Password",
        "confirm_new_password": "Confirm new password",
        "change_password": "Change Password",
        
        // Modal windows
        "login_title": "Login to Account",
        "remember_me": "Remember me",
        "forgot_password": "Forgot password?",
        "create_password": "Create Password",
        "password_requirements": "Minimum 8 characters, uppercase and lowercase letters, numbers",
        "select_role": "Select role",
        
        // Notifications
        "notification_success": "Success",
        "notification_error": "Error",
        "notification_info": "Info",
        
        // Startup categories
        "IT": "IT",
        "AI": "AI / Machine Learning",
        "FinTech": "FinTech",
        "EdTech": "EdTech",
        "Health": "Health / Medicine",
        "Eco": "Ecology",
        "Ecommerce": "E-commerce",
        "Other": "Other",
        
        // Project stages
        "idea": "Idea",
        "mvp": "MVP",
        "beta": "Beta Version",
        "ready": "Ready Product",
        "scaling": "Scaling",
        
        // Placeholders
        "enter_password": "Enter password",
        
        // General
        "loading": "Loading...",
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "view": "View",
        "back": "Back",
        "next_page": "Next",
        "previous_page": "Previous",
        "page": "Page",
        "of": "of",
        "items": "items",
        "no_data": "No data",
        "error_loading": "Loading error",
        "try_again": "Try again"
    }
};

// Функция перевода всего интерфейса
function updateLanguageTexts() {
    const lang = appState.language;
    const translation = translations[lang] || translations.ru;
    
    // Перевод элементов с data-translate
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translation[key]) {
            element.textContent = translation[key];
        }
    });
    
    // Перевод placeholder'ов
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translation[key]) {
            element.setAttribute('placeholder', translation[key]);
        }
    });
    
    // Перевод заголовка страницы
    if (pageTitle) {
        const pageKey = appState.currentPage;
        if (translation[pageKey]) {
            pageTitle.textContent = translation[pageKey];
        } else if (translation[pageKey + '_title']) {
            pageTitle.textContent = translation[pageKey + '_title'];
        }
    }
    
    // Обновление текстовых значений в select элементах
    document.querySelectorAll('option[data-translate]').forEach(option => {
        const key = option.getAttribute('data-translate');
        if (translation[key]) {
            option.textContent = translation[key];
        }
    });
    
    // Обновление заголовков разделов
    document.querySelectorAll('.section-title, .section-subtitle, .form-section-title').forEach(title => {
        const originalText = title.getAttribute('data-original-text') || title.textContent;
        title.setAttribute('data-original-text', originalText);
        
        // Пытаемся найти перевод по оригинальному тексту
        for (const [key, value] of Object.entries(translation)) {
            if (originalText === value) {
                title.textContent = translation[key] || originalText;
                break;
            }
        }
    });
    
    // Обновление уведомлений если они есть
    if (typeof showNotification === 'function') {
        // Сообщаем о смене языка
        setTimeout(() => {
            const messages = {
                ru: 'Язык интерфейса изменен на русский',
                kz: 'Интерфейс тілі қазақ тіліне өзгертілді',
                en: 'Interface language changed to English'
            };
            if (messages[lang]) {
                showNotification(messages[lang], 'success');
            }
        }, 500);
    }
}

// Инициализация перевода при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем сохраненный язык
    const savedLanguage = localStorage.getItem('startupHub_language') || 'ru';
    appState.language = savedLanguage;
    
    // Обновляем язык в select элементе
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
    }
    
    // Применяем перевод
    updateLanguageTexts();
    
    // Настройка обработчика смены языка
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            appState.language = this.value;
            localStorage.setItem('startupHub_language', this.value);
            updateLanguageTexts();
            
            // Обновляем страницу каталога если она активна
            if (appState.currentPage === 'catalog') {
                updateCatalogGrid();
            }
            
            // Обновляем UI
            if (typeof updateUI === 'function') {
                updateUI();
            }
        });
    }
    
    // Также настраиваем обработчик для select в дашборде
    const dashboardLanguage = document.getElementById('dashboardLanguage');
    if (dashboardLanguage) {
        dashboardLanguage.value = savedLanguage;
        dashboardLanguage.addEventListener('change', function() {
            appState.language = this.value;
            localStorage.setItem('startupHub_language', this.value);
            updateLanguageTexts();
            
            // Обновляем основной select языка
            if (languageSelect) {
                languageSelect.value = this.value;
            }
        });
    }
});

// Функция для получения перевода по ключу (можно использовать в других скриптах)
function getTranslation(key, language = null) {
    const lang = language || appState.language;
    return translations[lang]?.[key] || translations.ru[key] || key;
}

// Экспорт функций для использования в других файлах
window.getTranslation = getTranslation;
window.updateLanguageTexts = updateLanguageTexts;