// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Check if admin is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');

    if (isLoggedIn === 'true') {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        loadDashboardMetrics();
    } else {
        loginContainer.style.display = 'flex';
        dashboardContainer.style.display = 'none';
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        checkAuth();
    } else {
        alert('Invalid credentials! Please use admin/admin123');
    }
}

// Logout function
function handleLogout() {
    sessionStorage.removeItem('adminLoggedIn');
    checkAuth();
}

console.log(JSON.parse(localStorage.getItem('products')));

// Initialize local storage with sample data if empty
function initializeLocalStorage() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify([]));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify([]));
    }
}

// DOM Elements
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.sidebar nav a');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });

            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');

            // Load section data
            loadSectionData(targetId);
        }
    });
});

// Load section data
function loadSectionData(section) {
    switch (section) {
        case 'dashboard':
            loadDashboardMetrics();
            loadNotifications();
            break;
        case 'products':
            loadProducts();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'users':
            loadUsers();
            break;
        case 'smart':
            loadSmartProcurement();
            break;
    }
}

function smartRead(key, fallback = []) {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
}

function loadSmartProcurement() {
    const rules = smartRead('procurementRules', { marketPrice: 40, gradeA: 2, gradeC: -3, highGap: 3000 });
    const checks = smartRead('qualityChecks');
    const requests = smartRead('collectionRequests').filter(request => request.status !== 'Completed');
    const trackingRecords = smartRead('listingTracking');
    const orders = smartRead('buyerOrders', smartRead('orders'));
    const inventory = smartRead('inventory');
    const demand = orders.reduce((total, order) => total + Number(order.quantity || order.requiredQuantity || 0), 0);
    const supply = inventory.reduce((total, item) => total + Number(item.quantity || item.stock || 0), 0);

    document.getElementById('smart-market-price').textContent = `₹${rules.marketPrice}/kg`;
    document.getElementById('smart-demand-gap').textContent = `${(demand - supply).toLocaleString()} kg`;
    document.getElementById('smart-quality-count').textContent = checks.length;
    document.getElementById('smart-route-count').textContent = requests.length;
    document.getElementById('smart-market-input').value = rules.marketPrice;
    document.getElementById('smart-grade-a').value = rules.gradeA;
    document.getElementById('smart-grade-c').value = rules.gradeC;
    document.getElementById('smart-high-gap').value = rules.highGap;
    document.getElementById('smart-quality-table').innerHTML = checks.length ? `<table><thead><tr><th>Crop</th><th>Farmer</th><th>Grade</th><th>Damage</th><th>Weight</th></tr></thead><tbody>${checks.slice(0, 20).map(check => `<tr><td>${check.crop || 'N/A'}</td><td>${check.farmerId || 'N/A'}</td><td><span class="badge bg-success">${check.grade}</span></td><td>${check.damage || 0}%</td><td>${check.weight || 0} kg</td></tr>`).join('')}</tbody></table>` : '<p>No quality checks recorded yet.</p>';
    const sortedRequests = requests.slice().sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0));
    document.getElementById('smart-route-table').innerHTML = sortedRequests.length ? `<table><thead><tr><th>Stop</th><th>Farmer</th><th>Village</th><th>Crop</th><th>Quantity</th><th>Distance</th><th>Status</th></tr></thead><tbody>${sortedRequests.map((request, index) => `<tr><td>${index + 1}</td><td>${request.farmer || request.farmerId || 'N/A'}</td><td>${request.village || 'N/A'}</td><td>${request.crop || 'N/A'}</td><td>${request.quantity || 0} kg</td><td>${request.distance || 0} km</td><td>${request.status || 'Requested'}</td></tr>`).join('')}</tbody></table>` : '<p>No open collection requests yet.</p>';
    document.getElementById('smart-tracking-table').innerHTML = trackingRecords.length ? `<table><thead><tr><th>Tracking ID</th><th>Product</th><th>Farmer</th><th>Status</th><th>Payment</th><th>Action</th></tr></thead><tbody>${trackingRecords.map((record, index) => `<tr><td>${record.trackingId}</td><td>${record.productName}</td><td>${record.farmerName || record.farmerId}</td><td><select class="form-select form-select-sm" id="tracking-status-${index}"><option ${record.status === 'Requested' ? 'selected' : ''}>Requested</option><option ${record.status === 'Agent Assigned' ? 'selected' : ''}>Agent Assigned</option><option ${record.status === 'On the Way' ? 'selected' : ''}>On the Way</option><option ${record.status === 'Arrived' ? 'selected' : ''}>Arrived</option><option ${record.status === 'Collected' ? 'selected' : ''}>Collected</option><option ${record.status === 'Quality Verified' ? 'selected' : ''}>Quality Verified</option><option ${record.status === 'Completed' ? 'selected' : ''}>Completed</option></select></td><td><select class="form-select form-select-sm" id="tracking-payment-${index}"><option ${record.paymentStatus === 'Processing' ? 'selected' : ''}>Processing</option><option ${record.paymentStatus === 'Approved' ? 'selected' : ''}>Approved</option><option ${record.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option></select></td><td><button class="btn btn-sm btn-success" onclick="updateListingTracking(${index})">Update</button></td></tr>`).join('')}</tbody></table>` : '<p>No listing tracking records yet.</p>';
}

function updateListingTracking(index) {
    const records = smartRead('listingTracking');
    const record = records[index];
    if (!record) return;
    const status = document.getElementById(`tracking-status-${index}`).value;
    const paymentStatus = document.getElementById(`tracking-payment-${index}`).value;
    if (record.status !== status) {
        record.events = record.events || [];
        record.events.push({ status, label: status, at: new Date().toISOString() });
    }
    record.status = status;
    record.paymentStatus = paymentStatus;
    record.updatedAt = new Date().toISOString();
    localStorage.setItem('listingTracking', JSON.stringify(records));
    localStorage.setItem('trackingUpdatedAt', record.updatedAt);
    loadSmartProcurement();
}

document.getElementById('smart-rules-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const rules = {
        marketPrice: Number(document.getElementById('smart-market-input').value),
        gradeA: Number(document.getElementById('smart-grade-a').value),
        gradeC: Number(document.getElementById('smart-grade-c').value),
        highGap: Number(document.getElementById('smart-high-gap').value)
    };
    localStorage.setItem('procurementRules', JSON.stringify(rules));
    document.getElementById('smart-rules-status').textContent = 'Rules saved';
    loadSmartProcurement();
});

// Dashboard Functions
function loadDashboardMetrics() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    document.getElementById('total-products').textContent = products.length;
    document.getElementById('active-orders').textContent = orders.filter(
        order => ['pending', 'shipped'].includes(order.status)
    ).length;
    document.getElementById('registered-users').textContent = users.length;

    // Expiry Alerts
    const today = new Date();
    let expiringSoon = 0;
    let expired = 0;

    products.forEach(product => {
        if (product.expiryDate) {
            const expiry = new Date(product.expiryDate);
            const timeDiff = expiry.getTime() - today.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (dayDiff <= 0) {
                expired++;
            } else if (dayDiff <= 7) {
                expiringSoon++;
            }
        }
    });

    document.getElementById('expiring-soon-products').textContent = expiringSoon;
    document.getElementById('expired-products').textContent = expired;
}

function loadNotifications() {
    const notifications =
        JSON.parse(localStorage.getItem('notifications')) || [];
    const notificationsList = document.getElementById('notifications-list');

    notificationsList.innerHTML = '';
    notifications.slice(0, 5).forEach(notification => {
        const div = document.createElement('div');
        div.className = 'notification-item';
        div.innerHTML = `
            <i class="fas ${notification.icon}"></i>
            <span>${notification.message}</span>
            <small>${new Date(notification.timestamp).toLocaleString()}</small>
        `;
        notificationsList.appendChild(div);
    });
}

// Product Management Functions
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productsContainer = document.getElementById('products-container');

    // Group products by category
    const categories = {};
    products.forEach(product => {
        let cat = (product.category || 'Other').toLowerCase();
        if (cat.includes('fruit')) cat = 'Fruits';
        else if (cat.includes('dairy')) cat = 'Dairy';
        else if (cat.includes('egg')) cat = 'Egg';
        else if (cat.includes('meat')) cat = 'Meat';
        else if (cat.includes('beverage')) cat = 'Beverages';
        else if (cat.includes('vegetable')) cat = 'Vegetables';
        else cat = cat.charAt(0).toUpperCase() + cat.slice(1);
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(product);
    });

    let html = `<div class="d-flex justify-content-end mb-3">
        <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" onclick="filterProductsByExpiry('all')">All</button>
            <button class="btn btn-outline-warning btn-sm" onclick="filterProductsByExpiry('expiring')">Expiring Soon</button>
            <button class="btn btn-outline-danger btn-sm" onclick="filterProductsByExpiry('expired')">Expired</button>
        </div>
    </div>`;

    // Render each category section
    Object.keys(categories).forEach(cat => {
        html += `<h4 class="mt-4 mb-2">${cat}</h4>`;
        html += `<table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Required (kg/ton)</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>`;
        categories[cat].forEach((product, index) => {
            const allProducts = products;
            const trClass = (() => {
                if (product.expiryDate) {
                    const expiry = new Date(product.expiryDate);
                    const today = new Date();
                    const timeDiff = expiry.getTime() - today.getTime();
                    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    if (dayDiff <= 0) return 'expiry-danger';
                    else if (dayDiff <= 7) return 'expiry-warning';
                }
                return '';
            })();
            html += `<tr class="${trClass}">
                <td>${product.name}</td>
                <td>$${product.price} (${product.unit || 'each'})</td>
                <td><span class="badge bg-success">${product.requiredQuantity || 1} ${product.requiredUnit || 'kg'}</span></td>
                <td>${product.stock}</td>
                <td>${product.category || 'N/A'}</td>
                <td>${product.brand || 'N/A'}</td>
                <td>${product.expiryDate || 'N/A'}</td>
                <td>
                    <button onclick="editProduct(${allProducts.indexOf(product)})" class="btn btn-primary btn-sm">Edit</button>
                    <button onclick="deleteProduct(${allProducts.indexOf(product)})" class="btn btn-danger btn-sm">Delete</button>
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
    });

    productsContainer.innerHTML = html;
}

function filterProductsByExpiry(filter) {
    const allProducts = JSON.parse(localStorage.getItem('products')) || [];
    let filteredProducts = [];

    const today = new Date();

    if (filter === 'all') {
        filteredProducts = allProducts;
    } else if (filter === 'expiring') {
        filteredProducts = allProducts.filter(p => {
            if (!p.expiryDate) return false;
            const expiry = new Date(p.expiryDate);
            const timeDiff = expiry.getTime() - today.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return dayDiff > 0 && dayDiff <= 7;
        });
    } else if (filter === 'expired') {
        filteredProducts = allProducts.filter(p => {
            if (!p.expiryDate) return false;
            const expiry = new Date(p.expiryDate);
            return expiry < today;
        });
    }

    // This is a bit of a workaround. We'll replace the products in the table
    // with the filtered list. A better approach would be to have a single
    // render function, but this keeps the changes minimal.
    const tableBody = document.getElementById('products-table-body');
    tableBody.innerHTML = '';
    filteredProducts.forEach((product, index) => {
        const originalIndex = allProducts.findIndex(p => p.id === product.id);
        const tr = document.createElement('tr');

        if (product.expiryDate) {
            const expiry = new Date(product.expiryDate);
            const timeDiff = expiry.getTime() - today.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (dayDiff <= 0) {
                tr.classList.add('expiry-danger');
            } else if (dayDiff <= 7) {
                tr.classList.add('expiry-warning');
            }
        }

        tr.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price} (${product.unit || 'each'})</td>
            <td><span class="badge bg-success">${product.requiredQuantity || 1} ${product.requiredUnit || 'kg'}</span></td>
            <td>${product.stock}</td>
            <td>${product.category || 'N/A'}</td>
            <td>${product.brand || 'N/A'}</td>
            <td>${product.expiryDate || 'N/A'}</td>
            <td>
                <button onclick="editProduct(${originalIndex})" class="btn btn-primary btn-sm">Edit</button>
                <button onclick="deleteProduct(${originalIndex})" class="btn btn-danger btn-sm">Delete</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function openAddProductModal(){
    const form = document.getElementById('product-form');
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-required-quantity').value = '1';
    document.getElementById('product-required-unit').value = 'kg';
    bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).show();
}

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products[index];

    // Prompt for username and password before allowing edit
    const username = prompt('Enter your username to edit this product:');
    const password = prompt('Enter your password:');

    // For now, only allow admin to edit (can be extended to per-product owner)
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
        alert('Invalid credentials! You cannot edit this product.');
        return;
    }

        document.getElementById('product-id').value = index;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-unit').value = product.unit || '';
    if (document.getElementById('product-required-quantity')) {
        document.getElementById('product-required-quantity').value = product.requiredQuantity || 1;
    }
    if (document.getElementById('product-required-unit')) {
        document.getElementById('product-required-unit').value = product.requiredUnit || 'kg';
    }
    document.getElementById('product-stock').value = product.stock;
   
    document.getElementById('product-expiry-date').value = product.expiryDate || '';
    document.getElementById('product-category').value = product.category || '';
    document.getElementById('product-brand').value = product.brand || '';
    document.getElementById('product-image').value = product.image || '';
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

function saveProduct() {
    const form = document.getElementById('product-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productId = document.getElementById('product-id').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value, 10);

    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(stock) || stock < 0) {
        alert('Price and stock must be valid non-negative numbers.');
        return;
    }

    const productData = {
        id: productId === '' ? Date.now() : products[parseInt(productId, 10)].id,
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price,
        unit: document.getElementById('product-unit').value,
        requiredQuantity: parseFloat(document.getElementById('product-required-quantity')?.value) || 1,
        requiredUnit: document.getElementById('product-required-unit')?.value || 'kg',
        stock,
        expiryDate: document.getElementById('product-expiry-date').value,
        category: document.getElementById('product-category').value,
        brand: document.getElementById('product-brand').value,
        image: document.getElementById('product-image').value,
        available: true,
        rating: 0,
        reviews: []
    };

    if (productId === '') {
        products.push(productData);
        addNotification('New product added: ' + productData.name, 'fa-box');
    } else {
        products[parseInt(productId)] = productData;
        addNotification('Product updated: ' + productData.name, 'fa-box');
    }

    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('productsUpdatedAt', new Date().toISOString());
    window.dispatchEvent(new Event('products-updated'));
    bootstrap.Modal.getOrCreateInstance(document.getElementById('productModal')).hide();
    loadProducts();
    loadDashboardMetrics();
}

function deleteProduct(index) {
    if (confirm('Are you sure you want to delete this product?')) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const productName = products[index].name;
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('productsUpdatedAt', new Date().toISOString());
        window.dispatchEvent(new Event('products-updated'));
        addNotification('Product deleted: ' + productName, 'fa-trash');
        loadProducts();
        loadDashboardMetrics();
    }
}

// Order Management Functions
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const ordersContainer = document.getElementById('orders-container');

    ordersContainer.innerHTML = `
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="mb-0">Orders Management</h5>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary btn-sm" onclick="filterOrders('all')">All</button>
                    <button class="btn btn-outline-warning btn-sm" onclick="filterOrders('pending')">Pending</button>
                    <button class="btn btn-outline-info btn-sm" onclick="filterOrders('processing')">Processing</button>
                    <button class="btn btn-outline-primary btn-sm" onclick="filterOrders('shipped')">Shipped</button>
                    <button class="btn btn-outline-success btn-sm" onclick="filterOrders('delivered')">Delivered</button>
                </div>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="orders-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const tableBody = document.getElementById('orders-table-body');
    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="fw-medium">${order.orderId}</span>
                <br>
                <small class="text-muted">${new Date(order.orderDate).toLocaleDateString()}</small>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <div>
                        <div class="fw-medium">${order.shipping.fullName}</div>
                        <div class="text-muted small">${order.shipping.address}</div>
                        <div class="text-muted small">${order.shipping.city}, ${order.shipping.state} ${order.shipping.postalCode}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-muted small">
                    <div><i class="fas fa-envelope me-1"></i>${order.shipping.email}</div>
                    <div><i class="fas fa-phone me-1"></i>${order.shipping.phone}</div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="badge bg-light text-dark">${order.items.length} items</span>
                    <button class="btn btn-link btn-sm" onclick="viewOrderItems(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
            <td>
                <div class="fw-medium">$${order.payment.total.toFixed(2)}</div>
                <small class="text-muted">
                    ${order.shipping.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                </small>
            </td>
            <td>
                <span class="badge bg-${getStatusColor(order.status)}">
                    ${order.status.toUpperCase()}
                </span>
            </td>
            <td>
                <div class="text-muted small">
                    <div>Ordered: ${new Date(order.orderDate).toLocaleString()}</div>
                    ${order.lastUpdated ? `<div>Updated: ${new Date(order.lastUpdated).toLocaleString()}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="btn-group">
                    <button onclick="viewOrderDetails(${index})" class="btn btn-info btn-sm" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="updateOrderStatus(${index})" class="btn btn-primary btn-sm" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="printOrderInvoice(${index})" class="btn btn-secondary btn-sm" title="Print Invoice">
                        <i class="fas fa-print"></i>
                    </button>
                    ${order.status === 'cancelled' ? `<button class="btn btn-success btn-sm" onclick="refundOrder(${index})">Refund</button>` : ''}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'processing': 'info',
        'shipped': 'primary',
        'delivered': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function viewOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order Details - ${order.orderId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6 class="fw-bold">Customer Information</h6>
                            <p><strong>Name:</strong> ${order.shipping.fullName}</p>
                            <p><strong>Email:</strong> ${order.shipping.email}</p>
                            <p><strong>Phone:</strong> ${order.shipping.phone}</p>
                            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                        </div>
                        <div class="col-md-6">
                            <h6 class="fw-bold">Shipping Address</h6>
                            <p>${order.shipping.address}</p>
                            <p>${order.shipping.city}, ${order.shipping.state} ${order.shipping.postalCode}</p>
                            <p><strong>Delivery Option:</strong> ${order.shipping.deliveryOption}</p>
                        </div>
                    </div>
                    
                    <h6 class="fw-bold mt-4">Order Items</h6>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => `
                                    <tr>
                                        <td><img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover"></td>
                                        <td>${item.name}</td>
                                        <td>$${item.price.toFixed(2)}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.subtotal.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <h6 class="fw-bold">Order Status</h6>
                            <span class="badge bg-${getStatusColor(order.status)}">
                                ${order.status.toUpperCase()}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <h6 class="fw-bold">Payment Summary</h6>
                            <p><strong>Subtotal:</strong> $${order.payment.subtotal.toFixed(2)}</p>
                            <p><strong>Shipping:</strong> $${order.payment.shipping.toFixed(2)}</p>
                            <p><strong>Total:</strong> $${order.payment.total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function viewOrderItems(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order Items - ${order.orderId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${order.items.map(item => `
                                    <tr>
                                        <td>
                                            <img src="${item.image}" alt="${item.name}" 
                                                class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
                                        </td>
                                        <td>${item.name}</td>
                                        <td>$${item.price.toFixed(2)}</td>
                                        <td>${item.quantity}</td>
                                        <td>$${item.subtotal.toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="4" class="text-end fw-bold">Subtotal:</td>
                                    <td>$${order.payment.subtotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="4" class="text-end fw-bold">Shipping:</td>
                                    <td>$${order.payment.shipping.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colspan="4" class="text-end fw-bold">Total:</td>
                                    <td>$${order.payment.total.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function printOrderInvoice(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice - ${order.orderId}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { padding: 20px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row mb-4">
                    <div class="col">
                        <h2>INVOICE</h2>
                        <p class="mb-0">Order ID: ${order.orderId}</p>
                        <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div class="col text-end">
                        <button onclick="window.print()" class="btn btn-primary no-print">Print Invoice</button>
                    </div>
                </div>

                <div class="row mb-4">
                    <div class="col-md-6">
                        <h6 class="fw-bold">Customer Information</h6>
                        <p><strong>Name:</strong> ${order.shipping.fullName}</p>
                        <p><strong>Email:</strong> ${order.shipping.email}</p>
                        <p><strong>Phone:</strong> ${order.shipping.phone}</p>
                        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <div class="col-md-6 text-end">
                        <h6 class="fw-bold">Shipping Method:</h6>
                        <p>${order.shipping.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}</p>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="text-end">Price</th>
                            <th class="text-end">Quantity</th>
                            <th class="text-end">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td class="text-end">$${item.price.toFixed(2)}</td>
                                <td class="text-end">${item.quantity}</td>
                                <td class="text-end">$${item.subtotal.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end fw-bold">Subtotal:</td>
                            <td class="text-end">$${order.payment.subtotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end fw-bold">Shipping:</td>
                            <td class="text-end">$${order.payment.shipping.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="text-end fw-bold">Total:</td>
                            <td class="text-end fw-bold">$${order.payment.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div class="row mt-4">
                    <div class="col">
                        <h6 class="fw-bold">Notes:</h6>
                        <p>Thank you for your business!</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}

function filterOrders(status) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const filteredOrders = status === 'all' ? orders : orders.filter(order => order.status === status);
    renderOrdersTable(filteredOrders);
}

function renderOrdersTable(orders) {
    const tableBody = document.getElementById('orders-table-body');
    tableBody.innerHTML = '';
    
    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="fw-medium">${order.orderId}</span>
                <br>
                <small class="text-muted">${new Date(order.orderDate).toLocaleDateString()}</small>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <div>
                        <div class="fw-medium">${order.shipping.fullName}</div>
                        <div class="text-muted small">${order.shipping.address}</div>
                        <div class="text-muted small">${order.shipping.city}, ${order.shipping.state} ${order.shipping.postalCode}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="text-muted small">
                    <div><i class="fas fa-envelope me-1"></i>${order.shipping.email}</div>
                    <div><i class="fas fa-phone me-1"></i>${order.shipping.phone}</div>
                </div>
            </td>
            <td>
                <div class="d-flex align-items-center">
                    <span class="badge bg-light text-dark">${order.items.length} items</span>
                    <button class="btn btn-link btn-sm" onclick="viewOrderItems(${index})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
            <td>
                <div class="fw-medium">$${order.payment.total.toFixed(2)}</div>
                <small class="text-muted">
                    ${order.shipping.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
                </small>
            </td>
            <td>
                <span class="badge bg-${getStatusColor(order.status)}">
                    ${order.status.toUpperCase()}
                </span>
            </td>
            <td>
                <div class="text-muted small">
                    <div>Ordered: ${new Date(order.orderDate).toLocaleString()}</div>
                    ${order.lastUpdated ? `<div>Updated: ${new Date(order.lastUpdated).toLocaleString()}</div>` : ''}
                </div>
            </td>
            <td>
                <div class="btn-group">
                    <button onclick="viewOrderDetails(${index})" class="btn btn-info btn-sm" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="updateOrderStatus(${index})" class="btn btn-primary btn-sm" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="printOrderInvoice(${index})" class="btn btn-secondary btn-sm" title="Print Invoice">
                        <i class="fas fa-print"></i>
                    </button>
                    ${order.status === 'cancelled' ? `<button class="btn btn-success btn-sm" onclick="refundOrder(${index})">Refund</button>` : ''}
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function updateOrderStatus(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders[index];
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Update Order Status - ${order.orderId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Order Status</label>
                        <select class="form-select" id="order-status">
                            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" onclick="saveOrderStatus(${index})">Save Changes</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function saveOrderStatus(index) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const newStatus = document.getElementById('order-status').value;
    const oldStatus = orders[index].status;
    orders[index].status = newStatus;

    // If status changes to 'cancelled', restock items
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        orders[index].items.forEach(item => {
            const productIndex = products.findIndex(p => p.id === item.id);
            if (productIndex !== -1) {
                products[productIndex].stock += item.quantity;
            }
        });
        localStorage.setItem('products', JSON.stringify(products));
        addNotification(`Order #${orders[index].orderId} cancelled. Items restocked.`, 'fa-undo');
    }

    localStorage.setItem('orders', JSON.stringify(orders));
    bootstrap.Modal.getInstance(document.getElementById('orderModal')).hide();
    loadOrders();
    loadDashboardMetrics();
}

function refundOrder(index) {
    if (!confirm('Are you sure you want to mark this order as refunded? This action cannot be undone.')) {
        return;
    }
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders[index].status = 'refunded';
    localStorage.setItem('orders', JSON.stringify(orders));
    addNotification(`Order #${orders[index].orderId} has been refunded.`, 'fa-money-bill-wave');
    loadOrders();
}

// User Management Functions
function loadUsers() {
    const usersContainer = document.getElementById('users-container');
    usersContainer.innerHTML = renderUsers();
}

function viewUserDetails(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">User Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <img src="${user.avatar}" alt="${user.name}" class="w-20 h-20 rounded-full mx-auto">
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Name:</label>
                        <p>${user.name}</p>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Email:</label>
                        <p>${user.email}</p>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Phone:</label>
                        <p>${user.phone || 'Not provided'}</p>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Address:</label>
                        <p>${user.address || 'Not provided'}</p>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Status:</label>
                        <p>${user.status || 'active'}</p>
                    </div>
                    <div class="mb-3">
                        <label class="block text-sm font-medium text-gray-700">Joined:</label>
                        <p>${new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                    ${user.updatedAt ? `
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700">Last Updated:</label>
                            <p>${new Date(user.updatedAt).toLocaleString()}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
}

function toggleUserStatus(index) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users[index];
    
    user.status = user.status === 'active' ? 'suspended' : 'active';
    user.updatedAt = new Date().toISOString();
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Add notification
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.unshift({
        message: `User ${user.name} ${user.status === 'active' ? 'activated' : 'suspended'}`,
        icon: user.status === 'active' ? 'fa-check-circle' : 'fa-ban',
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    loadUsers();
    loadNotifications();
}

function deleteUser(index) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userName = users[index].name;
        users.splice(index, 1);
        localStorage.setItem('users', JSON.stringify(users));
        addNotification('User deleted: ' + userName, 'fa-user-times');
        loadUsers();
        loadDashboardMetrics();
    }
}

function viewUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === userId);
    // You can implement a modal to show user orders here
    alert('User orders: ' + JSON.stringify(userOrders, null, 2));
}

// User Management Section
function renderUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const authNotifications = notifications.filter(n => n.type === 'auth');

    return `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">SaveMart User Management</h2>
                <div class="text-sm text-gray-500">Total Users: ${users.length}</div>
            </div>

            <!-- User Activity -->
            <div class="mb-8">
                <h3 class="text-lg font-semibold mb-4">Recent User Activity</h3>
                <div class="space-y-4">
                    ${authNotifications.slice(0, 5).map(notification => `
                        <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                            <i class="fas ${notification.icon} text-green-500 mr-3"></i>
                            <div class="flex-1">
                                <p class="text-sm font-medium">${notification.message}</p>
                                <p class="text-xs text-gray-500">${new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- User List -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${users.map(user => {
                            const orders = JSON.parse(localStorage.getItem('orders')) || [];
                            const userOrders = orders.filter(order => order.userId === user.id);
                            return `
                                <tr>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <img class="h-10 w-10 rounded-full" src="${user.avatar}" alt="">
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900">${user.name}</div>
                                                <div class="text-sm text-gray-500">${user.phone || 'No phone'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">${user.email}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">
                                            ${new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                        <div class="text-sm text-gray-500">
                                            ${new Date(user.createdAt).toLocaleTimeString()}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            ${userOrders.length} orders
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button onclick="viewUserDetails('${user.id}')" class="text-green-600 hover:text-green-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function viewUserDetails(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.userId === userId);

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center">
                        <img class="h-16 w-16 rounded-full" src="${user.avatar}" alt="">
                        <div class="ml-4">
                            <h2 class="text-2xl font-bold">${user.name}</h2>
                            <p class="text-gray-500">${user.email}</p>
                        </div>
                    </div>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <!-- User Stats -->
                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600">${userOrders.length}</div>
                        <div class="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600">
                            ${userOrders.reduce((total, order) => total + order.payment.total, 0).toFixed(2)}
                        </div>
                        <div class="text-sm text-gray-600">Total Spent</div>
                    </div>
                    <div class="bg-gray-50 p-4 rounded-lg text-center">
                        <div class="text-2xl font-bold text-green-600">
                            ${new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div class="text-sm text-gray-600">Member Since</div>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Phone</label>
                            <p class="mt-1">${user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <p class="mt-1">${user.email}</p>
                        </div>
                    </div>
                </div>

                <!-- Addresses -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4">Saved Addresses</h3>
                    <div class="space-y-4">
                        ${(user.addresses || []).map((address, index) => `
                            <div class="border rounded-lg p-4">
                                <h4 class="font-medium">${address.type || `Address ${index + 1}`}</h4>
                                <p class="text-sm text-gray-600 mt-1">${address.street}</p>
                                <p class="text-sm text-gray-600">${address.city}, ${address.state} ${address.postalCode}</p>
                            </div>
                        `).join('') || '<p class="text-gray-500">No saved addresses</p>'}
                    </div>
                </div>

                <!-- Order History -->
                <div>
                    <h3 class="text-lg font-semibold mb-4">Order History</h3>
                    ${userOrders.length > 0 ? `
                        <div class="space-y-4">
                            ${userOrders.map(order => `
                                <div class="border rounded-lg p-4">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="font-medium">${order.orderId}</span>
                                        <span class="badge bg-${getOrderStatusColor(order.status)} text-white px-2 py-1 rounded-full text-sm">
                                            ${order.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
                                        <p>Items: ${order.items.length}</p>
                                        <p>Total: $${order.payment.total.toFixed(2)}</p>
                                    </div>
                                    <button onclick="viewOrderDetails('${order.orderId}')" 
                                        class="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p class="text-gray-500">No orders yet</p>
                    `}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Add users section to admin navigation
function renderAdminNav() {
    return `
        <div class="bg-white shadow-sm">
            <div class="container mx-auto px-4">
                <div class="flex space-x-8">
                    <button onclick="renderOrders()" class="px-3 py-4 text-sm font-medium text-gray-700 border-b-2 hover:text-gray-900 hover:border-gray-300">
                        Orders
                    </button>
                    <button onclick="renderUsers()" class="px-3 py-4 text-sm font-medium text-gray-700 border-b-2 hover:text-gray-900 hover:border-gray-300">
                        Users
                    </button>
                    <button onclick="renderProducts()" class="px-3 py-4 text-sm font-medium text-gray-700 border-b-2 hover:text-gray-900 hover:border-gray-300">
                        Products
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Update main render function
function renderAdmin() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        ${renderAdminNav()}
        <div class="container mx-auto px-4 py-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <!-- Stats Cards -->
                ${renderStatsCards()}
            </div>
            
            <!-- Notifications -->
            ${renderNotifications()}
            
            <!-- Content Sections -->
            <div class="mt-8">
                ${renderOrders()}
            </div>
        </div>
    `;
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Add logout functionality to the "Back to Store" button
    const logoutBtn = document.querySelector('a[href="../index.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
            window.location.href = '../index.html';
        });
    }
    
    // Check authentication status
    checkAuth();
    
    // Initialize dashboard if logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        initializeLocalStorage();
        renderAdmin();
    }
});

// Mobile menu toggle
function initializeMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        mainContent.addEventListener('click', () => {
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Close sidebar when clicking a link (mobile)
        const sidebarLinks = document.querySelectorAll('.sidebar nav a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                }
            });
        });
    }
}

// Utility Functions
function addNotification(message, icon) {
    const notifications =
        JSON.parse(localStorage.getItem('notifications')) || [];
    notifications.unshift({
        message,
        icon: icon || 'fa-info-circle',
        timestamp: new Date().toISOString()
    });

    // Keep only last 20 notifications
    if (notifications.length > 20) {
        notifications.pop();
    }

    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
}

// Add sample data for testing
function addSampleData() {
    const products = [
        {
            name: 'Sample Product 1',
            description: 'This is a sample product',
            price: 99.99,
            stock: 50,
            category: 'Electronics',
            imageUrl: 'https://via.placeholder.com/150'
        },
        {
            name: 'Sample Product 2',
            description: 'Another sample product',
            price: 149.99,
            stock: 30,
            category: 'Clothing',
            imageUrl: 'https://via.placeholder.com/150'
        }
    ];

    const orders = [
        {
            id: 1,
            customerName: 'John Doe',
            total: 99.99,
            status: 'pending',
            userId: 1
        },
        {
            id: 2,
            customerName: 'Jane Smith',
            total: 149.99,
            status: 'shipped',
            userId: 2
        }
    ];

    const users = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            joinDate: new Date('2024-01-01').toISOString(),
            avatar: 'https://via.placeholder.com/150',
            phone: '1234567890',
            address: '123 Main St',
            status: 'active'
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            joinDate: new Date('2024-01-15').toISOString(),
            avatar: 'https://via.placeholder.com/150',
            phone: '9876543210',
            address: '456 Elm St',
            status: 'active'
        }
    ];

    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Add event listener for real-time updates
window.addEventListener('storage', (e) => {
    if (e.key === 'users' || e.key === 'notifications') {
        loadUsers();
        loadNotifications();
        loadDashboardMetrics();
    }
    if (e.key === 'orders' || e.key === 'notifications') {
        loadOrders();
        loadNotifications();
        loadDashboardMetrics();
    }
});

// Stats Cards
function renderStatsCards() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => total + order.payment.total, 0);
    
    // Get orders from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = orders.filter(order => new Date(order.orderDate) > thirtyDaysAgo);
    const recentRevenue = recentOrders.reduce((total, order) => total + order.payment.total, 0);

    // Calculate pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    return `
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <i class="fas fa-shopping-cart text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-500">Total Orders</p>
                    <p class="text-2xl font-semibold">${orders.length}</p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-500">
                    <span class="text-green-600">
                        <i class="fas fa-arrow-up"></i> ${recentOrders.length}
                    </span>
                    new orders in last 30 days
                </p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <i class="fas fa-dollar-sign text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-500">Total Revenue</p>
                    <p class="text-2xl font-semibold">$${totalRevenue.toFixed(2)}</p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-500">
                    <span class="text-blue-600">
                        <i class="fas fa-arrow-up"></i> $${recentRevenue.toFixed(2)}
                    </span>
                    revenue in last 30 days
                </p>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i class="fas fa-users text-2xl"></i>
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-500">Total Users</p>
                    <p class="text-2xl font-semibold">${users.length}</p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-500">
                    <span class="text-yellow-600">
                        <i class="fas fa-clock"></i> ${pendingOrders}
                    </span>
                    pending orders
                </p>
            </div>
        </div>
    `;
}

// Notifications
function renderNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    
    return `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">Recent Notifications</h2>
                <button onclick="clearNotifications()" 
                    class="text-sm text-gray-500 hover:text-gray-700">
                    Clear All
                </button>
            </div>
            
            ${notifications.length > 0 ? `
                <div class="space-y-4">
                    ${notifications.slice(0, 10).map(notification => `
                        <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div class="p-2 rounded-full ${getNotificationColor(notification.type)}">
                                <i class="fas ${notification.icon} text-lg"></i>
                            </div>
                            <div class="ml-4 flex-1">
                                <p class="text-sm font-medium">${notification.message}</p>
                                <p class="text-xs text-gray-500">
                                    ${formatTimeAgo(new Date(notification.timestamp))}
                                </p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-bell-slash text-4xl mb-2"></i>
                    <p>No new notifications</p>
                </div>
            `}
        </div>
    `;
}

function clearNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        localStorage.setItem('notifications', JSON.stringify([]));
        renderAdmin();
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'order':
            return 'bg-green-100 text-green-600';
        case 'auth':
            return 'bg-blue-100 text-blue-600';
        case 'alert':
            return 'bg-red-100 text-red-600';
        default:
            return 'bg-gray-100 text-gray-600';
    }
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }
    
    // Add logout functionality to the "Back to Store" button
    const logoutBtn = document.querySelector('a[href="../index.html"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
            window.location.href = '../index.html';
        });
    }
    
    // Check authentication status
    checkAuth();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize dashboard if logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        initializeLocalStorage();
        renderAdmin();
    }
});

// Subscription Section Logic
function renderSubscriptionSection() {
    const container = document.getElementById('subscription-container');
    let html = `<div style='max-width:350px; margin:2rem auto; background:white; padding:2rem; border-radius:1rem; box-shadow:0 2px 16px rgba(0,0,0,0.10);'>
        <h3 class='text-xl font-bold mb-4'>Subscription Login</h3>
        <input id='subscription-username' class='form-control mb-2' placeholder='Username' required><br>
        <input id='subscription-password' class='form-control mb-2' placeholder='Password' type='password' required><br>
        <button id='subscription-login-btn' class='btn btn-success w-100'>Login</button>
    </div>`;
    container.innerHTML = html;
    document.getElementById('subscription-login-btn').onclick = function() {
        const username = document.getElementById('subscription-username').value;
        const password = document.getElementById('subscription-password').value;
        // For demo, use admin credentials
        if (username === 'admin' && password === 'admin123') {
            alert('You are redirecting to the home page');
            window.location.href = '../index.html';
        } else {
            alert('Invalid credentials!');
        }
    };
}

// Show Subscription section when sidebar link is clicked
const subscriptionLink = document.getElementById('subscription-link');
if (subscriptionLink) {
    subscriptionLink.addEventListener('click', function() {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('subscription').classList.add('active');
        renderSubscriptionSection();
    });
}

function renderDonationsSection() {
    const container = document.getElementById('donations-container');
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    let html = `<div class='mb-4'><button id='show-donate-form-admin' class='btn btn-pink'>Sell</button></div>`;
    html += `<div id='donate-form-admin-container'></div>`;
    if (donations.length === 0) {
        html += `<p>No products have been sold yet.</p>`;
    } else {
        html += `<table class='table'><thead><tr><th>Username</th><th>Product Name</th><th>Product Price</th><th>Product Picture</th></tr></thead><tbody>`;
        donations.forEach(d => {
            html += `<tr><td>${d.username}</td><td>${d.productName}</td><td>${d.productPrice}</td><td><img src='${d.productPic}' alt='${d.productName}' style='max-width:80px; max-height:80px;'></td></tr>`;
        });
        html += `</tbody></table>`;
    }
    container.innerHTML = html;
    document.getElementById('show-donate-form-admin').onclick = showDonateFormAdmin;
}

function showDonateFormAdmin() {
    let formHtml = `<div class='bg-white p-4 rounded shadow mb-4 max-w-md'>
        <h3 class='font-bold mb-4 text-xl text-pink-700'>Sell a Product</h3>
        <input id='donate-username-admin' class='form-control mb-2' placeholder='Username' required><br>
        <input id='donate-password-admin' class='form-control mb-2' placeholder='Password' type='password' required><br>
        <input id='donate-product-name-admin' class='form-control mb-2' placeholder='Product Name' required><br>
        <input id='donate-product-price-admin' class='form-control mb-2' placeholder='Product Price' type='number' min='0' step='0.01' required><br>
        <label class='mb-2 font-semibold'>Product Picture</label><br>
        <input id='donate-product-pic-admin' class='form-control mb-2' type='file' accept='image/*' required><br>
        <button id='submit-donation-admin' class='btn btn-pink mt-2'>Submit</button>
    </div>`;
    document.getElementById('donate-form-admin-container').innerHTML = formHtml;
    document.getElementById('submit-donation-admin').onclick = submitDonationAdmin;
}

function submitDonationAdmin() {
    const username = document.getElementById('donate-username-admin').value;
    const password = document.getElementById('donate-password-admin').value;
    const productName = document.getElementById('donate-product-name-admin').value;
    const productPrice = document.getElementById('donate-product-price-admin').value;
    const productPicInput = document.getElementById('donate-product-pic-admin');
    if (!username || !password || !productName || !productPrice || !productPicInput.files[0]) {
        alert('Please fill in all fields.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        let donations = JSON.parse(localStorage.getItem('donations')) || [];
        donations.push({ username, password, productName, productPrice, productPic: e.target.result });
        localStorage.setItem('donations', JSON.stringify(donations));
        alert('Thank you for selling your product!');
        renderDonationsSection();
    };
    reader.readAsDataURL(productPicInput.files[0]);
}

// Show section when sidebar link is clicked
const sellLink = document.getElementById('sell-link');
if (sellLink) {
    sellLink.addEventListener('click', function() {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById('sell').classList.add('active');
        renderDonationsSection();
    });
}
