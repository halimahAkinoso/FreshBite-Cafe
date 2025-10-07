 // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Check if menu exists in local storage, if not create default menu
            if (!localStorage.getItem('cafeMenu')) {
                const defaultMenu = [
                    {
                        id: 1,
                        name: "Chapman",
                        price: 2.50,
                        description: "Made with fanta, Sprite and cucumber garnish",
                        category: "drinks"
                    },
                    {
                        id: 2,
                        name: "Tiger Nut Milk",
                        price: 3.50,
                        description: "Sweet creamy drink made from blended tiger nut",
                        category: "drinks"
                    },
                    {
                        id: 3,
                        name: "Bottle Water",
                        price: 3.50,
                        description: "Standard choice for hydration",
                        category: "drinks"
                    },
                    {
                        id: 4,
                        name: "Caesar Salad",
                        price: 8.99,
                        description: "Fresh romaine lettuce with Caesar dressing",
                        category: "food"
                    },
                    {
                        id: 5,
                        name: "Coconut Candy",
                        price: 9.99,
                        description: "Caramelized grated coconut mixed with sugar",
                        category: "food"
                    },
                    {
                        id: 6,
                        name: "Chocolate Cake",
                        price: 5.99,
                        description: "Rich chocolate cake with chocolate frosting",
                        category: "desserts"
                    },
                    {
                        id: 7,
                        name: "Chocolate Cake",
                        price: 5.99,
                        description: "Rich chocolate cake with chocolate frosting",
                        category: "desserts"
                    },
                    {
                        id: 8,
                        name: "Tiramisu",
                        price: 6.50,
                        description: "Italian coffee-flavored dessert",
                        category: "desserts"
                    }
                ];
                localStorage.setItem('cafeMenu', JSON.stringify(defaultMenu));
            }

            // Check if cart exists in local storage, if not create empty cart
            if (!localStorage.getItem('cafeCart')) {
                localStorage.setItem('cafeCart', JSON.stringify([]));
            }

            // Load menu and cart
            loadMenu();
            loadCart();
            updateCartCount();

            // Set up event listeners
            setupEventListeners();
        });

        // Set up event listeners
        function setupEventListeners() {
            // Navigation
            document.getElementById('customerViewBtn').addEventListener('click', showCustomerView);
            document.getElementById('staffViewBtn').addEventListener('click', showStaffLogin);
            document.getElementById('logoutBtn').addEventListener('click', logout);
            
            // Cart
            document.getElementById('cartBtn').addEventListener('click', toggleCart);
            document.getElementById('closeCart').addEventListener('click', toggleCart);
            
            // Forms
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            document.getElementById('addItemForm').addEventListener('submit', handleAddItem);
            document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
            
            // Menu search
            document.getElementById('menuSearch').addEventListener('input', handleSearch);
            
            // Category tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    filterMenuByCategory(this.dataset.category);
                });
            });
        }

        // View switching functions
        function showCustomerView() {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('customerMenu').classList.add('active');
        }

        function showStaffLogin() {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('staffLogin').classList.add('active');
        }

        function showStaffDashboard() {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('staffDashboard').classList.add('active');
            loadStaffMenu();
        }

        // Authentication
        function handleLogin(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showNotification('Please enter both username and password', 'error');
                return;
            }
            
            // Hardcoded credentials
            if (username === 'admin' && password === 'cafe123') {
                showNotification('Login successful!');
                showStaffDashboard();
                document.getElementById('loginForm').reset();
            } else {
                showNotification('Invalid username or password', 'error');
            }
        }

        function logout() {
            showCustomerView();
            showNotification('Logged out successfully');
        }

        // Menu management
        function loadMenu() {
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const menuContainer = document.getElementById('menuItems');
            menuContainer.innerHTML = '';
            
            menu.forEach(item => {
                const menuCard = document.createElement('div');
                menuCard.className = 'menu-card';
                // Determine image extension based on available files
                let imgExt = 'jpeg';
                if ([3,4,6,7].includes(item.id)) imgExt = 'png';
                if ([5,8].includes(item.id)) imgExt = 'webp';
                const imgSrc = `images/${item.id}.${imgExt}`;
                menuCard.innerHTML = `
                    <div class="menu-card-image">
                        <img src="${imgSrc}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />
                    </div>
                    <div class="menu-card-content">
                        <div class="menu-card-header">
                            <div class="menu-card-title">${item.name}</div>
                            <div class="menu-card-price">N${item.price.toFixed(2)}</div>
                        </div>
                        <div class="menu-card-description">${item.description}</div>
                        <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                `;
                menuContainer.appendChild(menuCard);
            });
            
            // Add event listeners to add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    addToCart(itemId);
                });
            });
        }

        function loadStaffMenu() {
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const menuContainer = document.getElementById('staffMenuItems');
            menuContainer.innerHTML = '';
            
            if (menu.length === 0) {
                menuContainer.innerHTML = '<p>No menu items available. Add some items to get started.</p>';
                return;
            }
            
            menu.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'menu-item';
                menuItem.innerHTML = `
                    <div class="menu-item-info">
                        <div class="menu-item-name">${item.name}</div>
                        <div class="menu-item-price">$${item.price.toFixed(2)}</div>
                        <div>${item.description}</div>
                        <div>Category: ${item.category}</div>
                    </div>
                    <div class="menu-item-actions">
                        <button class="btn btn-warning edit-item" data-id="${item.id}">Edit Price</button>
                        <button class="btn btn-danger delete-item" data-id="${item.id}">Delete</button>
                    </div>
                `;
                menuContainer.appendChild(menuItem);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    editItemPrice(itemId);
                });
            });
            
            document.querySelectorAll('.delete-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    deleteItem(itemId);
                });
            });
        }

        function handleAddItem(e) {
            e.preventDefault();
            
            const name = document.getElementById('itemName').value;
            const price = parseFloat(document.getElementById('itemPrice').value);
            const description = document.getElementById('itemDescription').value;
            const category = document.getElementById('itemCategory').value;
            
            if (!name || isNaN(price) || price <= 0) {
                showNotification('Please enter a valid name and price', 'error');
                return;
            }
            
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const newItem = {
                id: Date.now(), // Simple ID generation
                name,
                price,
                description,
                category
            };
            
            menu.push(newItem);
            localStorage.setItem('cafeMenu', JSON.stringify(menu));
            
            showNotification('Menu item added successfully!');
            document.getElementById('addItemForm').reset();
            loadStaffMenu();
        }

        function editItemPrice(itemId) {
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const item = menu.find(item => item.id === itemId);
            
            if (!item) {
                showNotification('Item not found', 'error');
                return;
            }
            
            const newPrice = prompt(`Enter new price for ${item.name}:`, item.price);
            
            if (newPrice !== null && !isNaN(newPrice) && parseFloat(newPrice) > 0) {
                item.price = parseFloat(newPrice);
                localStorage.setItem('cafeMenu', JSON.stringify(menu));
                showNotification('Price updated successfully!');
                loadStaffMenu();
            } else if (newPrice !== null) {
                showNotification('Invalid price', 'error');
            }
        }

        function deleteItem(itemId) {
            if (confirm('Are you sure you want to delete this item?')) {
                const menu = JSON.parse(localStorage.getItem('cafeMenu'));
                const updatedMenu = menu.filter(item => item.id !== itemId);
                localStorage.setItem('cafeMenu', JSON.stringify(updatedMenu));
                showNotification('Item deleted successfully!');
                loadStaffMenu();
            }
        }

        // Cart functions
        function addToCart(itemId) {
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const item = menu.find(item => item.id === itemId);
            
            if (!item) {
                showNotification('Item not found', 'error');
                return;
            }
            
            let cart = JSON.parse(localStorage.getItem('cafeCart'));
            const existingItem = cart.find(cartItem => cartItem.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...item,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cafeCart', JSON.stringify(cart));
            showNotification(`${item.name} added to cart!`);
            loadCart();
            updateCartCount();
        }

        function loadCart() {
            const cart = JSON.parse(localStorage.getItem('cafeCart'));
            const cartContent = document.getElementById('cartContent');
            cartContent.innerHTML = '';
            
            if (cart.length === 0) {
                cartContent.innerHTML = '<p>Your cart is empty</p>';
                updateCartTotal();
                return;
            }
            
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <button class="btn btn-danger remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                cartContent.appendChild(cartItem);
            });
            
            // Add event listeners to quantity buttons
            document.querySelectorAll('.decrease-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    decreaseQuantity(itemId);
                });
            });
            
            document.querySelectorAll('.increase-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    increaseQuantity(itemId);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    removeFromCart(itemId);
                });
            });
            
            updateCartTotal();
        }

        function increaseQuantity(itemId) {
            let cart = JSON.parse(localStorage.getItem('cafeCart'));
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cafeCart', JSON.stringify(cart));
                loadCart();
                updateCartCount();
            }
        }

        function decreaseQuantity(itemId) {
            let cart = JSON.parse(localStorage.getItem('cafeCart'));
            const item = cart.find(item => item.id === itemId);
            
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(cartItem => cartItem.id !== itemId);
                }
                localStorage.setItem('cafeCart', JSON.stringify(cart));
                loadCart();
                updateCartCount();
            }
        }

        function removeFromCart(itemId) {
            let cart = JSON.parse(localStorage.getItem('cafeCart'));
            cart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cafeCart', JSON.stringify(cart));
            showNotification('Item removed from cart');
            loadCart();
            updateCartCount();
        }

        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem('cafeCart'));
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cartCount').textContent = count;
        }

        function updateCartTotal() {
            const cart = JSON.parse(localStorage.getItem('cafeCart'));
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        }

        function toggleCart() {
            const cartSidebar = document.getElementById('cartSidebar');
            cartSidebar.classList.toggle('open');
        }

        // Checkout
        function handleCheckout(e) {
            e.preventDefault();
            
            const customerName = document.getElementById('customerName').value;
            const tableNumber = document.getElementById('tableNumber').value;
            
            if (!customerName || !tableNumber) {
                showNotification('Please enter your name and table number', 'error');
                return;
            }
            
            const cart = JSON.parse(localStorage.getItem('cafeCart'));
            
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            
            // success Message
            showNotification(`Order placed successfully! Thank you, ${customerName}. Your order will be delivered to table ${tableNumber}.`);
            
            // Clear cart
            localStorage.setItem('cafeCart', JSON.stringify([]));
            loadCart();
            updateCartCount();
            
            // Reset form
            document.getElementById('checkoutForm').reset();
            
            // Close cart
            toggleCart();
        }

        // Search and filter
        function handleSearch() {
            const searchTerm = document.getElementById('menuSearch').value.toLowerCase();
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            const filteredMenu = menu.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
            
            displayFilteredMenu(filteredMenu);
        }

        function filterMenuByCategory(category) {
            const menu = JSON.parse(localStorage.getItem('cafeMenu'));
            let filteredMenu;
            
            if (category === 'all') {
                filteredMenu = menu;
            } else {
                filteredMenu = menu.filter(item => item.category === category);
            }
            
            displayFilteredMenu(filteredMenu);
        }

        function displayFilteredMenu(menu) {
            const menuContainer = document.getElementById('menuItems');
            menuContainer.innerHTML = '';
            
            if (menu.length === 0) {
                menuContainer.innerHTML = '<p>No menu items found.</p>';
                return;
            }
            
            menu.forEach(item => {
                const menuCard = document.createElement('div');
                menuCard.className = 'menu-card';
                menuCard.innerHTML = `
                    <div class="menu-card-image">
                        <i class="fas fa-utensils fa-3x"></i>
                    </div>
                    <div class="menu-card-content">
                        <div class="menu-card-header">
                            <div class="menu-card-title">${item.name}</div>
                            <div class="menu-card-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <div class="menu-card-description">${item.description}</div>
                        <button class="btn btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                    </div>
                `;
                menuContainer.appendChild(menuCard);
            });
            
            // Add event listeners to add to cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const itemId = parseInt(this.dataset.id);
                    addToCart(itemId);
                });
            });
        }

        // Utility functions
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = 'notification';
            
            if (type === 'error') {
                notification.classList.add('error');
            }
            
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }


        // Simple examples for your café project

// 1. Auto-hide success message
function showSuccessMessage(message) {
    let messageDiv = document.getElementById('successMessage');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(function() {
        messageDiv.style.display = 'none';
    }, 3000);
}

// 2. Order preparation timer
function startOrderTimer(orderId, minutes) {
    let seconds = minutes * 60;
    
    let orderInterval = setInterval(function() {
        seconds--;
        
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        
        console.log(`Order ${orderId}: ${mins}:${secs} remaining`);
        
        if (seconds <= 0) {
            clearInterval(orderInterval);
            console.log(`Order ${orderId} is ready!`);
            alert(`Order ${orderId} is ready for pickup!`);
        }
    }, 1000);
}

// 3. Auto-logout after inactivity
let logoutTimer;

function resetLogoutTimer() {
    // Clear existing timer
    clearTimeout(logoutTimer);
    
    // Set new timer (30 minutes)
    logoutTimer = setTimeout(function() {
        alert("You've been logged out due to inactivity");
        // Add logout code here
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
}

// Reset timer on any user activity
document.addEventListener('click', resetLogoutTimer);
document.addEventListener('keypress', resetLogoutTimer);

// Start the timer
resetLogoutTimer();
