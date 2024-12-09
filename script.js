// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Update total price dynamically in the cart
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = document.querySelectorAll('.cart-item');
    const totalPriceElement = document.getElementById('total-price');

    function updateTotalPrice() {
        let totalPrice = 0;
        cartItems.forEach(item => {
            const price = parseInt(item.querySelector('p').innerText.replace('Цена: ', '').replace(' руб.', ''));
            const quantity = parseInt(item.querySelector('input[type="number"]').value);
            totalPrice += price * quantity;
        });
        totalPriceElement.innerText = `${totalPrice} руб.`;
    }

    cartItems.forEach(item => {
        const quantityInput = item.querySelector('input[type="number"]');
        quantityInput.addEventListener('input', updateTotalPrice);
    });
    updateTotalPrice();
});


// Search Books Function
function searchBooks() {
    const query = document.querySelector('.search-input').value.trim().toLowerCase();
    const books = document.querySelectorAll('.book-card');

    books.forEach(book => {
        const title = book.querySelector('.book-title')?.innerText.toLowerCase() || '';
        const author = book.querySelector('.book-author')?.innerText.toLowerCase() || '';
        const genre = book.querySelector('.book-genre')?.innerText.toLowerCase() || '';

        const isVisible = title.includes(query) || author.includes(query) || genre.includes(query);
        book.style.display = isVisible ? 'block' : 'none';
    });
}



// Wishlist functionality
function addToWishlist(book) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Проверка на дубликаты
    if (wishlist.some(item => item.title === book.title)) {
        alert(`${book.title} уже добавлена в избранное.`);
        return;
    }

    wishlist.push(book);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`${book.title} добавлена в избранное!`);
}

// Load Wishlist Items on Wishlist Page
function loadWishlist() {
    localStorage.removeItem('wishlist');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistGrid = document.getElementById('wishlist-grid');

    if (!wishlistGrid) return;

    wishlistGrid.innerHTML = '';  // Очищаем контейнер

    if (wishlist.length === 0) {
        wishlistGrid.innerHTML = '<p>Ваш список избранного пуст.</p>';
        return;
    }

    wishlist.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        bookCard.innerHTML = `
            <img src="${book.imageSrc}" alt="${book.title}">
            <h4>${book.title}</h4>
            <p>${book.price}</p>
            <button class="btn" onclick="removeFromWishlist('${book.title}')">Удалить</button>
        `;

        wishlistGrid.appendChild(bookCard);
    });
}


// Remove Book from Wishlist without reloading the page
function removeFromWishlist(title) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Фильтрация списка
    wishlist = wishlist.filter(book => book.title !== title);

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    alert(`${title} удалена из избранного.`);
    loadWishlist();  // Обновление отображения
}


// Ensure loadWishlist is called on wishlist page load
document.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
});


// Add a book to the cart
function addToCart(book) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingBook = cart.find(item => item.title === book.title);

    if (existingBook) {
        existingBook.quantity += 1;
    } else {
        cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${book.title} добавлена в корзину!`);
}
function removeFromCart(title) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.title !== title);

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${title} удалена из корзины.`);
    showCart();  // Обновление отображения корзины
}
function updateQuantity(title, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const book = cart.find(item => item.title === title);

    if (book) {
        book.quantity = newQuantity > 0 ? newQuantity : 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        showCart();  // Обновление корзины на странице
    }
}


function showCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('total-price');

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<li>Корзина пуста</li>';
        cartTotal.textContent = 'Итого: 0 руб.';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.innerHTML = `
            
            <span>${item.title}</span> 
            <span>${item.quantity} шт. x ${item.price} = ${item.quantity * parseInt(item.price)} руб.</span>
            <input type="number" min="1" value="${item.quantity}" onchange="updateQuantity('${item.title}', this.value)">
            <button onclick="removeFromCart('${item.title}')">Удалить</button>
        `;
        cartItemsContainer.appendChild(itemElement);

        total += item.quantity * parseInt(item.price);
    });

    cartTotal.textContent = `Итого: ${total} руб.`;
}


// Обновление корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    showCart();  // Автоматически показываем корзину, когда страница загрузится
});



// Menu toggle for mobile navigation
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Initialize wishlist loading on page load if on wishlist page
document.addEventListener('DOMContentLoaded', () => {
    loadWishlist();
});
// Функция для инициализации галереи
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-book-cover');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevButton = document.getElementById('prev-thumbnail');
    const nextButton = document.getElementById('next-thumbnail');
    const galleryWrapper = document.querySelector('.thumbnail-gallery');

    let currentIndex = 0;

    // Функция смены изображения
    const updateMainImage = (index) => {
        const thumbnail = thumbnails[index];
        const newSrc = thumbnail.src; // Используем data-full или src
        mainImage.src = newSrc;
        mainImage.alt = thumbnail.alt;

        // Обновляем класс активного элемента
        thumbnails.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === index);
        });
    };

    // Навигация по стрелкам
    const navigateThumbnails = (direction) => {
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = thumbnails.length - 1;
        if (currentIndex >= thumbnails.length) currentIndex = 0;

        updateMainImage(currentIndex);
    };

    // Навешиваем обработчики на миниатюры
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentIndex = index;
            updateMainImage(index);
        });
    });

    // Навешиваем обработчики на стрелки
    prevButton.addEventListener('click', () => navigateThumbnails(-1));
    nextButton.addEventListener('click', () => navigateThumbnails(1));

    // Инициализируем главное изображение
    updateMainImage(currentIndex);
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();

    if (user && pass) {
        // Переход на страницу профиля
        window.location.href = `profile.html?username=${user}&email=user@example.com`;
    } else {
        document.getElementById("loginError").textContent = "Заполните все поля!";
    }
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const user = document.getElementById("registerUser").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const pass = document.getElementById("registerPass").value.trim();

    if (user && email && pass) {
        window.location.href = `profile.html?username=${user}&email=${email}`;
    } else {
        document.getElementById("registerError").textContent = "Заполните все поля!";
    }
});
// Получение параметров из URL
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        username: params.get("username") || "Гость",
        email: params.get("email") || "user@example.com",
    };
}

// Загрузка данных профиля
function loadProfileData() {
    const { username, email } = getQueryParams();

    document.getElementById("username").textContent = username;
    document.getElementById("email").textContent = email;

    // Заполнение слайдеров
    fillSlider("currentOrders", currentOrders, "Текущий заказ");
    fillSlider("orderHistory", orderHistory, "Завершён");
}


// Загрузка аватарки
document.getElementById("avatarUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            document.getElementById("avatar").style.backgroundImage = `url(${event.target.result})`;
            document.getElementById("avatar").textContent = ""; // Убрать текст
        };
        reader.readAsDataURL(file);
    }
});
function redirectToProfile(userData) {
    document.body.innerHTML = `
    <div class="account-container">
       <div class="profile-avatar" id="avatar">U</div>
        <!--<input type="file" id="avatarUpload" accept="image/*">-->
        <button class="btn" onclick="document.getElementById('avatarUpload').click()">Изменить аватар</button>
        <button class="btn" onclick ="location.href='wishlist.html'"> Избранное</button>
        <h2 id="username">Имя пользователя</h2>
        <p><strong>Email:</strong> <span id="email">user@example.com</span></p>

        <!-- Текущие заказы --> 
        <h3>Текущие заказы</h3>
        <div class="slider-container">
            <div class="slider-item">
                <img src="" alt="1984">
                <p><strong>1984</strong><br>Джордж Оруэлл</p>
                <p class="status">Текущий заказ</p>
            </div>

            <div class="slider-item">
                <img src="" alt="Мастер и Маргарита">
                <p><strong>Мастер и Маргарита</strong><br>Михаил Булгаков</p>
                <p class="status">Текущий заказ</p>
            </div>

            <div class="slider-item">
                <img src="" alt="Улисс">
                <p><strong>Улисс</strong><br>Джеймс Джойс</p>
                <p class="status">Текущий заказ</p>
            </div>
        </div>

        <!-- История заказов -->
        <h3>История заказов</h3>
        <div class="slider-container">
            <div class="slider-item">
                <img src="" alt="Преступление и наказание">
                <p><strong>Преступление и наказание</strong><br>Фёдор Достоевский</p>
                <p class="status">Завершён</p>
            </div>

            <div class="slider-item">
                <img src="" alt="Гордость и предубеждение">
                <p><strong>Гордость и предубеждение</strong><br>Джейн Остин</p>
                <p class="status">Завершён</p>
            </div>

            <div class="slider-item">
                <img src="" alt="Война и мир">
                <p><strong>Война и мир</strong><br>Лев Толстой</p>
                <p class="status">Завершён</p>
            </div>
        </div>
        </div>
    `;
}

// Выход из системы
function logout() {
    window.location.href = "index.html";
}

// Загрузка данных профиля при загрузке страницы
window.onload = loadProfileData;
