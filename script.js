document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Выбор Элементов ---
    const sectionTitleElement = document.querySelector('.section-title');
    const topDropdownContainer = document.getElementById('top-dropdown');
    const topDropdownToggle = document.getElementById('toplist-toggle-btn');
    const topDropdownMenu = document.getElementById('toplist-menu');
    const currentTopNameSpan = document.getElementById('current-top-name');
    const bottomNavButtons = document.querySelectorAll('.bottom-nav-btn');
    const userAvatar = document.getElementById('user-avatar');
    const searchContainer = document.getElementById('search-container');
    const notificationsButton = document.getElementById('notifications-btn');
    const trackTemplate = document.getElementById('track-template');

    // Контейнеры контента для разных секций
    const homeContent = document.querySelector('[data-section-content="home"]');
    const topsContent = document.querySelector('[data-section-content="tops"]');
    const radioContent = document.querySelector('[data-section-content="radio"]');
    // Собираем все основные контентные блоки в массив
    const allContentSections = [homeContent, topsContent, radioContent].filter(el => el !== null); // Фильтруем null на всякий случай

    // Специфические контейнеры списков внутри секций
    const newReleasesListContainer = document.getElementById('new-releases-list');
    const topsTrackListContainer = document.getElementById('tops-track-list');

    // --- 2. Данные (Заглушки) ---
    const placeholderTime = "03:30";
    const placeholderCover = 'https://via.placeholder.com/85/cccccc/111111?text=AI';
    const dataStore = {
        home: {
            featuredArtist: { name: "@FeaturedArtist", avatar: "images/avatar.png" },
            popularArtists: [
                { name: "@Artist1", avatar: "images/avatar.png" }, { name: "@Slaver", avatar: "images/avatar.png" },
                { name: "@ixVadim", avatar: "images/avatar.png" }, { name: "@NeuroBot", avatar: "images/avatar.png" },
                { name: "@WaveAI", avatar: "images/avatar.png" },
            ],
            newReleases: [
                { id: 1, title: "ТРЕС НОКЕР - Продолжение...", author: "@alefair", time: placeholderTime, coverUrl: "images/track1.jpeg" },
                { id: 2, title: "Серенада войны", author: "@Slaver", time: placeholderTime, coverUrl: "images/track2.jpeg" },
                { id: 3, title: "Wop-Bop, Shooby-Doop", author: "@ixVadim", time: placeholderTime, coverUrl: "images/track3.jpeg" },
                 { id: 4, title: "Ank, tryka Aliens (v.2.1)©", author: "@alefair", time: placeholderTime, coverUrl: "images/track4.jpeg" },
                 { id: 5, title: "Нейро-Блюз #5", author: "@NeuroBot", time: placeholderTime, coverUrl: "images/track5.jpeg" },
                 { id: 6, title: "Электронные Сны", author: "@SynthDreamer", time: placeholderTime, coverUrl: "images/track6.jpeg" },
            ]
        },
        topWeekTracks: [
            { id: 1, title: "ТРЕС НОКЕР - Продолжение...", author: "@alefair", time: placeholderTime, coverUrl: "images/track1.jpeg" },
            { id: 2, title: "Серенада войны", author: "@Slaver", time: placeholderTime, coverUrl: "images/track2.jpeg" },
            { id: 3, title: "Wop-Bop, Shooby-Doop", author: "@ixVadim", time: placeholderTime, coverUrl: "images/track3.jpeg" },
            { id: 4, title: "Ank, tryka Aliens (v.2.1)©", author: "@alefair", time: placeholderTime, coverUrl: "images/track4.jpeg" },
            { id: 5, title: "Нейро-Блюз #5", author: "@NeuroBot", time: placeholderTime, coverUrl: "images/track5.jpeg" },
            { id: 6, title: "Электронные Сны", author: "@SynthDreamer", time: placeholderTime, coverUrl: "images/track6.jpeg" },
        ],
        topMonthTracks: [
            { id: 7, title: "Месячный Хит #1", author: "@TopMaker", time: placeholderTime, coverUrl: placeholderCover },
            { id: 8, title: "Лунная Соната AI", author: "@MoonAI", time: placeholderTime, coverUrl: placeholderCover },
            { id: 9, title: "Ритмы Мегаполиса", author: "@CityBeat", time: placeholderTime, coverUrl: placeholderCover },
            { id: 10, title: "Еще один хит", author: "@WaveAI", time: placeholderTime, coverUrl: "images/track2.jpeg" },
            { id: 11, title: "Трек месяца", author: "@Slaver", time: placeholderTime, coverUrl: "images/track4.jpeg" },
        ],
        topOfTheTopsTracks: [
            { id: 10, title: "Абсолютный Чемпион", author: "@GodAI", time: placeholderTime, coverUrl: placeholderCover },
            { id: 2, title: "Серенада войны (снова)", author: "@Slaver", time: placeholderTime, coverUrl: "images/track2.jpeg" },
        ],
        radio: [ // Пока не используется для рендера, но данные есть
             { id: 13, title: "Радио Сигнал #Альфа", author: "@RadioBot", time: placeholderTime, coverUrl: placeholderCover },
             { id: 14, title: "Частота 2077", author: "@FutureFM", time: placeholderTime, coverUrl: placeholderCover },
        ],
        search: [] // Для будущего поиска
    };

    // --- 3. Управление Навигацией и Контентом ---
    function updateSectionTitle(title) {
        if (sectionTitleElement) sectionTitleElement.textContent = title;
    }

    function updateActiveBottomNav(clickedButton) {
        bottomNavButtons.forEach(btn => btn.classList.remove('active'));
        if (clickedButton) clickedButton.classList.add('active');
    }

    // Функция для показа нужной секции и скрытия остальных
    function showSectionContent(sectionId) {
        console.log(`--- Switching content visibility to: ${sectionId} ---`); // Для отладки
        allContentSections.forEach(section => {
            if (section) { // Проверка на null
                const shouldShow = section.dataset.sectionContent === sectionId;
                section.style.display = shouldShow ? 'block' : 'none';
                // console.log(`Section [${section.dataset.sectionContent}]: display set to ${section.style.display}`); // Подробная отладка
            }
        });
        // Управление видимостью dropdown'а топов
        if (topDropdownContainer) {
            topDropdownContainer.style.display = sectionId === 'tops' ? 'inline-block' : 'none';
        }
        // Скролл вверх при смене секции
        const mainContentArea = document.querySelector('.main-content-area');
        if(mainContentArea) mainContentArea.scrollTop = 0;
    }

    // Основная функция загрузки секции
    function loadSection(sectionId) {
        console.log(`Loading section: ${sectionId}`);
        let tracksDataKey = null; // Ключ данных для рендера списка треков
        let sectionTitle = ""; // Заголовок секции
        let renderStandardList = false; // Флаг, нужно ли рендерить стандартный список треков
        let targetContainer = null; // Контейнер для рендера

        // 1. Сначала переключаем видимость блоков контента
        showSectionContent(sectionId);

        // 2. Определяем данные и заголовок для секции
        const activeButton = document.querySelector(`.bottom-nav-btn[data-section="${sectionId}"]`);
        sectionTitle = activeButton?.dataset.title || sectionId.charAt(0).toUpperCase() + sectionId.slice(1); // Берем title из кнопки или форматируем ID

        switch (sectionId) {
            case 'home':
                sectionTitle = "Главная"; // Явно ставим заголовок для home
                renderHomeScreen(dataStore.home); // Вызываем специальный рендер для Главной
                break;
            case 'tops':
                // Заголовок и данные определяются выбором в dropdown'е
                const activeTopItem = topDropdownMenu?.querySelector('.dropdown-item.active') || topDropdownMenu?.querySelector('.dropdown-item');
                tracksDataKey = activeTopItem?.dataset.tab || 'topWeekTracks'; // Данные из активного пункта
                sectionTitle = activeTopItem?.dataset.title || "Топы"; // Заголовок из активного пункта
                renderStandardList = true;
                targetContainer = topsTrackListContainer;
                break;
            case 'radio':
                // Заголовок установлен выше из data-title кнопки
                // Контент - статичная заглушка в HTML, рендер не нужен
                break;
            default:
                console.warn(`Unknown sectionId: ${sectionId}. Loading home instead.`);
                sectionId = 'home';
                sectionTitle = "Главная";
                showSectionContent('home'); // Показать home, если секция неизвестна
                renderHomeScreen(dataStore.home);
                // Обновить активную кнопку навигации на 'home'
                 const homeButton = document.querySelector('.bottom-nav-btn[data-section="home"]');
                 updateActiveBottomNav(homeButton);
                break;
        }

        // 3. Обновляем заголовок страницы (если он есть)
        updateSectionTitle(sectionTitle);

        // 4. Рендерим стандартный список треков, если нужно
        if (renderStandardList && tracksDataKey && targetContainer) {
            renderTracks(dataStore[tracksDataKey] || [], targetContainer);
        } else if (renderStandardList && !targetContainer) {
             console.error(`Target container not found for section ${sectionId}`);
        }
    }


    // --- Логика Dropdown для Топов ---
    if (topDropdownToggle && topDropdownMenu && topDropdownContainer) {
        topDropdownToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Предотвратить всплытие, чтобы не сработало закрытие по клику на документ
            const isShown = topDropdownContainer.classList.toggle('show');
            if (isShown) {
                positionDropdownMenu(); // Позиционируем при открытии
            }
        });

        topDropdownMenu.addEventListener('click', (e) => {
            const clickedItem = e.target.closest('.dropdown-item'); // Ищем ближайший .dropdown-item
            if (clickedItem) {
                e.preventDefault();
                const topSectionId = clickedItem.dataset.tab;
                const sectionTitle = clickedItem.dataset.title || clickedItem.textContent.trim();

                // Обновляем активный пункт в меню
                topDropdownMenu.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));
                clickedItem.classList.add('active');

                // Обновляем текст на кнопке
                if(currentTopNameSpan) currentTopNameSpan.textContent = clickedItem.textContent.trim();

                // Обновляем заголовок секции
                updateSectionTitle(sectionTitle);

                // Рендерим треки для выбранного топа
                if (topsTrackListContainer) {
                    renderTracks(dataStore[topSectionId] || [], topsTrackListContainer);
                } else {
                    console.error("Container for tops track list not found!");
                }

                // Закрываем dropdown
                topDropdownContainer.classList.remove('show');
            }
        });

        // Закрытие по клику вне dropdown
         document.addEventListener('click', (e) => {
             if (topDropdownContainer.classList.contains('show') && !topDropdownContainer.contains(e.target)) {
                 topDropdownContainer.classList.remove('show');
             }
         });

        // Функция позиционирования Dropdown меню (остается как была)
        function positionDropdownMenu() {
           const menu = topDropdownMenu;
           const toggle = topDropdownToggle;
           const container = topDropdownContainer;
           if (!menu || !toggle || !container) return;

           menu.style.left = 'auto';
           menu.style.right = 'auto';
           menu.style.transform = 'translateY(-5px)'; // Сброс transform для расчета

           const menuRect = menu.getBoundingClientRect();
           const toggleRect = toggle.getBoundingClientRect();
           const windowWidth = window.innerWidth;
           const containerRect = document.querySelector('.main-content-area').getBoundingClientRect(); // Границы контентной области

           // Позиция левого края кнопки относительно окна
           const toggleLeft = toggleRect.left;
           // Позиция правого края кнопки относительно окна
           const toggleRight = toggleRect.right;
            // Позиция левого края контентной области
           const contentLeft = containerRect.left;
            // Позиция правого края контентной области
           const contentRight = containerRect.right;


           // Пытаемся выровнять по левому краю кнопки
           let desiredLeft = toggleLeft;
           // Проверяем, не вылезает ли меню справа за пределы контентной области
           if (desiredLeft + menuRect.width > contentRight - 15) { // 15px - отступ от правого края контента
               // Если вылезает, пытаемся выровнять по правому краю кнопки
               let desiredRight = windowWidth - toggleRight; // Позиция правого края меню = позиция правого края кнопки
                // Проверяем, не вылезает ли меню слева за пределы контентной области
               if(toggleRight - menuRect.width < contentLeft + 15){ // Если и так вылезает, ставим по левому краю контента
                    menu.style.left = `${contentLeft + 15}px`;
                    menu.style.right = 'auto';
               } else { // Иначе выравниваем по правому краю кнопки
                    menu.style.left = 'auto';
                    menu.style.right = `${desiredRight}px`;
               }

           } else {
               // Проверяем, не вылезает ли меню слева
               if(desiredLeft < contentLeft + 15){ // 15px отступ от левого края контента
                  menu.style.left = `${contentLeft + 15}px`;
                  menu.style.right = 'auto';
               } else {
                  menu.style.left = `${desiredLeft}px`; // Выравниваем по левому краю кнопки
                  menu.style.right = 'auto';
               }
           }
            // Применяем transform для анимации появления
            requestAnimationFrame(() => {
                menu.style.transform = 'translateY(0)';
            });
        }

         let resizeTimeout;
         window.addEventListener('resize', () => {
             clearTimeout(resizeTimeout);
             resizeTimeout = setTimeout(() => {
                 if (topDropdownContainer.classList.contains('show')) {
                     positionDropdownMenu(); // Перепозиционируем при ресайзе, если открыто
                 }
             }, 100);
         });
    } else {
        console.warn("Dropdown elements not found.");
    }

    // --- 4. Рендеринг Контента ---
    function renderTracks(tracksData, container) {
        if (!container) { console.error("Target container for tracks is null!"); return; }
        if (!trackTemplate) { console.error("Track template not found!"); return; }

        container.innerHTML = ''; // Очищаем контейнер перед рендером
        if (!tracksData || tracksData.length === 0) {
            container.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 20px 0;">Здесь пока пусто...</p>';
            return;
        }

        const fragment = document.createDocumentFragment(); // Используем фрагмент для оптимизации
        tracksData.forEach((track) => {
            const templateClone = trackTemplate.content.cloneNode(true);
            const trackCard = templateClone.querySelector('.track-card');
            if (!trackCard) return;

            const coverImg = templateClone.querySelector('.track-cover');
            const titleElement = templateClone.querySelector('.track-title');
            const authorElement = templateClone.querySelector('.track-author');
            const timeElement = templateClone.querySelector('.track-time');
            const favButton = templateClone.querySelector('.action-btn.favorite');
            const likeButton = templateClone.querySelector('.action-btn.like');
            const playbackIndicatorIcon = templateClone.querySelector('.playback-indicator i'); // Иконка Play/Pause

            if (coverImg) {
                 coverImg.src = track.coverUrl || placeholderCover;
                 coverImg.alt = track.title || "Обложка трека"; // Добавляем alt
            }
            if (titleElement) titleElement.textContent = track.title;
            if (authorElement) authorElement.textContent = track.author;
            if (timeElement) timeElement.textContent = `00:00 / ${track.time}`; // Заглушка времени

            // Добавляем обработчики
            trackCard.dataset.trackId = track.id; // Сохраняем ID для идентификации
            trackCard.addEventListener('click', handleCardClick);
            if (favButton) favButton.addEventListener('click', handleFavClick);
            if (likeButton) likeButton.addEventListener('click', handleLikeClick);

            fragment.appendChild(templateClone);
        });
        container.appendChild(fragment); // Добавляем все сразу
    }

    // Функция рендера для главной страницы
    function renderHomeScreen(homeData){
        if (!homeContent) { console.error("Home content container not found!"); return; }

        const featuredArtistEl = homeContent.querySelector('.featured-artist-card');
        if (featuredArtistEl && homeData.featuredArtist) {
             const img = featuredArtistEl.querySelector('img');
             const p = featuredArtistEl.querySelector('p');
             if (img) img.src = homeData.featuredArtist.avatar || placeholderCover;
             if (p) p.textContent = homeData.featuredArtist.name;
        }

         const popularArtistsContainer = homeContent.querySelector('.popular-artists-section .horizontal-scroll-container');
         if (popularArtistsContainer && homeData.popularArtists) {
             popularArtistsContainer.innerHTML = ''; // Очищаем
             const fragment = document.createDocumentFragment();
             homeData.popularArtists.forEach(artist => {
                 const bubble = document.createElement('div');
                 bubble.className = 'artist-bubble';
                 bubble.innerHTML = `<img src="${artist.avatar || placeholderCover}" alt="${artist.name}" loading="lazy"><span>${artist.name}</span>`;
                 fragment.appendChild(bubble);
             });
             popularArtistsContainer.appendChild(fragment);
         }

        // Рендерим список новых релизов
        if (newReleasesListContainer){
            renderTracks(homeData.newReleases || [], newReleasesListContainer);
        } else {
             console.warn("Container for new releases (#new-releases-list) not found.");
        }
    }

    // --- 5. Интерактивность Карточек (Обработчики) ---
    let currentlyPlayingCard = null; // Ссылка на карточку, которая сейчас "играет"

    function handleCardClick(event) {
        const clickedCard = event.currentTarget;
        // Игнорируем клик, если он был по кнопке действия внутри карточки
        if (event.target.closest('.action-btn')) {
            return;
        }

        const playbackIcon = clickedCard.querySelector('.playback-indicator i');
        const isPlaying = clickedCard.classList.contains('playing');

        // Если кликнули по другой карточке, остановить предыдущую
        if (currentlyPlayingCard && currentlyPlayingCard !== clickedCard) {
            currentlyPlayingCard.classList.remove('playing');
            const prevIcon = currentlyPlayingCard.querySelector('.playback-indicator i');
            if (prevIcon) {
                prevIcon.classList.remove('fa-pause');
                prevIcon.classList.add('fa-play');
            }
        }

        // Переключаем состояние текущей карточки
        clickedCard.classList.toggle('playing', !isPlaying);

        // Обновляем иконку текущей карточки
        if (playbackIcon) {
            playbackIcon.classList.toggle('fa-pause', !isPlaying);
            playbackIcon.classList.toggle('fa-play', isPlaying);
        }

        // Обновляем ссылку на текущую играющую карточку
        currentlyPlayingCard = !isPlaying ? clickedCard : null;

        // Логируем действие (заглушка для реального плеера)
        console.log(`Track ${clickedCard.dataset.trackId} ${!isPlaying ? 'Playing' : 'Paused'} (imitated)`);
        // Здесь будет логика взаимодействия с audio API:
        // if (!isPlaying) { audio.src = trackUrl; audio.play(); } else { audio.pause(); }
    }

    function handleFavClick(event) {
        event.stopPropagation(); // Остановка всплытия, чтобы не сработал click на карточке
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        const isActive = button.classList.toggle('active');

        if (icon) {
             icon.classList.remove('far', 'fas'); // Убираем оба класса стиля
             icon.classList.add(isActive ? 'fas' : 'far', 'fa-star'); // Добавляем нужный стиль и иконку
             // Дополнительно меняем цвет через CSS класс .active, нет необходимости менять здесь
        }

        const trackId = button.closest('.track-card')?.dataset.trackId;
        console.log(`Favorite button clicked for track ${trackId}, active: ${isActive}`);
        // Тут будет AJAX-запрос на сервер для сохранения состояния
    }

    function handleLikeClick(event) {
        event.stopPropagation(); // Остановка всплытия
        const button = event.currentTarget;
        const icon = button.querySelector('i');
        const isActive = button.classList.toggle('active');

        if (icon) {
            icon.classList.remove('far', 'fas');
            icon.classList.add(isActive ? 'fas' : 'far', 'fa-heart');
            // Цвет меняется через CSS класс .active
        }

        const trackId = button.closest('.track-card')?.dataset.trackId;
        console.log(`Like button clicked for track ${trackId}, active: ${isActive}`);
        // Тут будет AJAX-запрос на сервер
    }

    // --- 6. Прочее (Заглушки для верхних кнопок) ---
    if (userAvatar) { userAvatar.addEventListener('click', () => { console.log('Avatar clicked!'); alert('Личный кабинет (пока не реализовано)'); }); }
    if (searchContainer) { searchContainer.addEventListener('click', () => { console.log('Search clicked!'); alert('Поиск (пока не реализовано)'); }); }
    if (notificationsButton) { notificationsButton.addEventListener('click', () => { console.log('Notifications clicked!'); alert('Уведомления (пока не реализовано)'); }); }

    // --- Spotlight раскрытие/скрытие ---
    const spotlightSection = document.getElementById('spotlight-section');
    if (spotlightSection && spotlightSection.classList.contains('clickable')) {
        spotlightSection.addEventListener('click', () => {
            spotlightSection.classList.toggle('open');

            // Плавный скролл к блоку, если он раскрывается и уходит за экран (опционально)
            // const details = document.getElementById('spotlight-details');
            // if (spotlightSection.classList.contains('open')) {
            //     const rect = details.getBoundingClientRect();
            //     // Проверяем, виден ли нижний край блока
            //     if (rect.bottom > window.innerHeight) {
            //          details.scrollIntoView({ behavior: 'smooth', block: 'end' });
            //     }
            // }
        });
    }

    // --- 7. Инициализация и Слушатели Навигации ---
    // Добавляем слушатели на кнопки нижней навигации
    bottomNavButtons.forEach(button => {
        button.addEventListener('click', () => {
            const sectionId = button.dataset.section;
            if (!button.classList.contains('active')) { // Загружаем только если кнопка не активна
                updateActiveBottomNav(button);
                loadSection(sectionId);
            }
        });
    });

    // Определяем и загружаем начальную секцию
    const initialActiveButton = document.querySelector('.bottom-nav-btn.active') || bottomNavButtons[0];
    if (initialActiveButton) {
        const initialSectionId = initialActiveButton.dataset.section;
        // Не нужно вызывать updateActiveBottomNav здесь, т.к. кнопка уже активна по HTML/CSS
        loadSection(initialSectionId); // Загружаем контент начальной секции
    } else {
        console.error("No initial active button found for bottom navigation.");
        loadSection('home'); // Загрузка 'home' по умолчанию, если ничего не найдено
        const homeButton = document.querySelector('.bottom-nav-btn[data-section="home"]');
        if(homeButton) updateActiveBottomNav(homeButton); // Активируем кнопку home
    }

}); // Конец DOMContentLoaded