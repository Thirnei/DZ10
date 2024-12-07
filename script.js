const productList = document.getElementById('productList');
const categoryFilter = document.getElementById('categoryFilter');
const loadMoreButton = document.getElementById('loadMore');
const addProductForm = document.getElementById('addProductForm');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('authError');
const registerForm = document.getElementById('registerForm');
const registerUsernameInput = document.getElementById('registerUsername');
const registerPasswordInput = document.getElementById('registerPassword');
let currentPage = 1;
const itemsPerPage = 6;

// Загрузка товаров
async function fetchProducts(page = 1, category = "") {
    try {
        const response = await fetch(`https://fakestoreapi.com/products?limit=${itemsPerPage}&page=${page}`);
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
    }
}

// Отображение товаров
function renderProducts(products) {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.price} ₽</p>
            <p>${product.description}</p>
            <p>Категория: ${product.category}</p>
            <button class="deleteProduct" data-id="${product.id}">Удалить</button>
        `;
        productList.appendChild(productCard);
    });
}

// Удаление товара
productList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('deleteProduct')) {
        const productId = e.target.dataset.id;
        try {
            await fetch(`https://fakestoreapi.com/products/${productId}`, { method: 'DELETE' });
            e.target.parentElement.remove();
            alert("Товар успешно удалён");
        } catch (error) {
            console.error("Ошибка при удалении товара:", error);
        }
    }
});

// Фильтрация по категориям
categoryFilter.addEventListener('change', () => {
    const selectedCategory = categoryFilter.value;
    productList.innerHTML = '';
    fetchProducts(1, selectedCategory);
});

// Загрузка категорий
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
    }
}

// Пагинация
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchProducts(currentPage);
});

// Добавление товара
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProduct = {
        title: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
    };
    try {
        const response = await fetch('https://fakestoreapi.com/products', {
            method: 'POST',
            body: JSON.stringify(newProduct),
            headers: { 'Content-Type': 'application/json' },
        });
        const addedProduct = await response.json();
        renderProducts([addedProduct]);
        alert("Товар успешно добавлен");
    } catch (error) {
        console.error("Ошибка при добавлении товара:", error);
    }
});

// Инициализация
fetchProducts();
fetchCategories();

// Авторизация и регистрация
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('showRegister');

// Отображение модального окна авторизации
loginButton.addEventListener('click', () => {
    authModal.style.display = 'block';
    usernameInput.focus();
});

// Закрытие модального окна авторизации
const closeModal = document.querySelector('.close');
closeModal.addEventListener('click', () => {
    authModal.style.display = 'none';
});

// Отображение формы регистрации
registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    authForm.style.display = 'none';
    registerForm.style.display = 'block';
});

// Регистрация
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = registerUsernameInput.value;
    const password = registerPasswordInput.value;
    try {
        localStorage.setItem('user', JSON.stringify({ username }));
        authModal.style.display = 'none';
        checkAuth();
        alert("Регистрация успешна");
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
    }
});

// Авторизация
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
        if (username === "admin" && password === "password") {
            const user = { username };
            localStorage.setItem('user', JSON.stringify(user));
            authModal.style.display = 'none';
            checkAuth();
            alert("Вход успешен");
        } else {
            authError.style.display = 'block';
            authError.textContent = "Неверное имя пользователя или пароль";
        }
    } catch (error) {
        console.error("Ошибка при аутентификации:", error);
    }
});

// Проверка аутентификации
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('loginButton').textContent = 'Выйти';
        document.getElementById('loginButton').addEventListener('click', () => {
            localStorage.removeItem('user');
            document.getElementById('loginButton').textContent = 'Войти';
            alert("Вы вышли");
        });
    } else {
        document.getElementById('loginButton').textContent = 'Войти';
    }
}

// Инициализация аутентификации
checkAuth();