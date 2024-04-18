const cartItems = [];

// Добавяне на продукт в количката
const addToCart = (productId, productName, productPrice, productImage) => {
    if (productId && productName && productPrice) {
        const product = {
            id: productId,
            title: productName,
            price: productPrice,
            image: productImage
        };

        cartItems.push(product);
        renderCart();
    } else {
        console.error('Invalid product data');
    }
};

// Премахване на продукт от количката
const removeFromCart = (index) => {
    cartItems.splice(index, 1);
    renderCart();
};

const openForm = () => {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "block";
    } else {
        console.error("Popup element not found.");
    }
};

// Рендиране на количката
const renderCart = () => {
    const cartList = document.querySelector('.cart-items-container');
    cartList.innerHTML = '';

    cartItems.forEach((item, index) => {
        const cartItem = `
                <div class="cart-item">
                    <span class="fas fa-times" onclick="removeFromCart(${index})"></span>
                    <img src="images/${item.image}">
                    <div class="content">
                        <h3>${item.title}</h3>
                        <div class="price">${item.price}</div>
                    </div>
                </div>
            `;
        cartList.innerHTML += cartItem;
    });

    // Добавяне на бутона "Купи сега"
    cartList.innerHTML += `
    <div class="btn">
        <button class="btn" id="buy-now-btn" onclick="openForm()">Купи сега</button>
    </div>`;

    // Обновяване на броя продукти в количката
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.innerHTML = `<span>${cartItems.length}</span>`;
};

document.addEventListener('DOMContentLoaded', () => {

    // Добавяне на събитие за бутоните "Добави в количката"
    const addToCartButtons = document.querySelectorAll('.box .btn');
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const titleElement = document.querySelector(`.box:nth-child(${index + 1}) .content h3`);
            const priceElement = document.querySelector(`.box:nth-child(${index + 1}) .price`);
            const imageElement = document.querySelector(`.box:nth-child(${index + 1}) .image`);

            if (titleElement && priceElement) {
                const productName = titleElement.innerText;
                const productPrice = priceElement.innerText;
                const productImage = imageElement.innerText;
                addToCart(index + 1, productName, productPrice, productImage);
            } else {
                console.error('Product not found');
            }
        });
    });

    // Търсене на продукти
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', () => {
        const searchTerm = searchBox.value.toLowerCase();
        const products = document.querySelectorAll('.box .content h3');

        products.forEach((product, index) => {
            const productTitle = product.innerText.toLowerCase();
            const box = product.parentElement.parentElement;

            if (productTitle.includes(searchTerm)) {
                box.style.display = 'block';
            } else {
                box.style.display = 'none';
            }
        });
    });

    // Показване/скриване на търсачката
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');
    searchBtn.addEventListener('click', () => {
        searchForm.classList.toggle('active');
    });

    // Показване/скриване на количката
    const cartBtn = document.getElementById('cart-btn');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    cartBtn.addEventListener('click', () => {
        cartItemsContainer.classList.toggle('active');
    });

    // Заявка за вземане на продукти за менюто от базата данни
    fetch('http://localhost:8080/get-menus')
        .then(response => response.json())
        .then(data => {
            const menuItems = document.getElementById('menuItems');
            menuItems.innerHTML = data.map(item => `
                <div class="box">
                    <img class="image" src="images/${item.image}" >
                    <h3>${item.name}</h3>
                    <div class="price">$${item.price} <span>$${item.discountedPrice || ''}</span></div>
                    <button onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.image}')" class="btn">add to cart</button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
        });

    fetch('http://localhost:8080/get-products')
        .then(response => response.json())
        .then(data => {
            const menuItems = document.getElementById('productItems');
            menuItems.innerHTML = data.map(item => `
                <div class="box">
                    <img class="image" src="images/${item.image}" >
                    <h3>${item.name}</h3>
                    <div class="price">$${item.price} <span>$${item.discountedPrice || ''}</span></div>
                    <button onclick="addToCart(${item.id}, '${item.name}', '${item.price}', '${item.image}')" class="btn">add to cart</button>
                </div>
            `).join('');
        })
        .catch(error => {
            console.error('Error fetching menu data:', error);
        });
});

document.addEventListener('DOMContentLoaded', () => {
    // Get the form element
    var customerForm = document.getElementById("customerForm");

    // When the user submits the form, close the popup and send the data to the backend
    customerForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Close the popup
        popup.style.display = "none";

        // Get customer details from the form
        var customerData = {
            customer_name: customerForm.customer_name.value,
            email: customerForm.email.value,
            phone_number: customerForm.phone_number.value,
            address: customerForm.address.value
        };

        // Get product details (dummy data for demonstration)
        var products = cartItems.map(item => {
            return { productId: item.id, productPrice: item.price};
        });

        // Combine customer data and product data
        var orderData = {
            ...customerData,
            products: products
        };

        // Send order data to backend
        fetch('http://localhost:8080/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to submit order');
                }
                return response.json();
            })
            .then(data => {
                alert(data.message); // Show success message
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while submitting the order');
            });
    });
});


