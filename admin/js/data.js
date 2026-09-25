alert("Welcome to SaveMart Admin Panel")
const products = [
    {
        id: 1,
        name: 'Organic Bananas',
        price: 1.25,
        requiredQuantity: 25,
        requiredUnit: 'kg',
        unit: 'per lb',
        brand: 'FreshMart',
        category: 'Fruits',
        rating: 4.5,
        expiryDate: '2024-07-25',
        image: 'https://i.ibb.co/L05s2yV/product-1.jpg',
        available: true,
        description: 'A bunch of fresh, organic bananas.',
        specs: ['Organic', 'Rich in Potassium'],
        reviews: [],
        colors: ['Yellow'],
        stock: 150
    },
    {
        id: 2,
        name: 'Tomatoes',
        price: 2.50,
        unit: 'per lb',
        brand: 'VineRipe',
        category: 'Vegetables',
        rating: 4.7,
        expiryDate: '2024-07-28',
        image: 'https://www.google.com/imgres?q=tomato&imgurl=https%3A%2F%2Fwww.lovefoodhatewaste.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F16_9_two_column%2Fpublic%2F2022-08%2FTomatoes-sh769524253.jpg.webp%3Fitok%3D25sVZ_jz&imgrefurl=https%3A%2F%2Fwww.lovefoodhatewaste.com%2Ffoods-and-recipes%2Ftomatoes&docid=gspy2Dke1VgdVM&tbnid=IVSwFWPxuy5InM&vet=12ahUKEwiasp2i15KOAxXh4zgGHQkwA3QQM3oECHAQAA..i&w=690&h=388&hcb=2&ved=2ahUKEwiasp2i15KOAxXh4zgGHQkwA3QQM3oECHAQAA',
        available: true,
        description: 'Fresh, red tomatoes, sold by the pound.',
        specs: ['Vine-ripened', 'Rich in Lycopene'],
        reviews: [],
        colors: ['Red'],
        stock: 120
    },
    {
        id: 3,
        name: 'Green Bell Pepper',
        price: 0.99,
        unit: 'each',
        brand: 'FreshMart',
        category: 'Vegetables',
        rating: 4.6,
        expiryDate: '2024-08-01',
        image: 'https://i.ibb.co/y4T3VSj/product-3.jpg',
        available: true,
        description: 'Crisp and fresh green bell peppers.',
        specs: ['Crunchy', 'High in Vitamin C'],
        reviews: [],
        colors: ['Green'],
        stock: 200
    },
    {
        id: 4,
        name: 'Whole Chicken',
        price: 7.99,
        unit: 'each',
        brand: 'FarmFresh',
        category: 'Meat',
        rating: 4.8,
        expiryDate: '2024-07-22',
        image: 'https://i.ibb.co/GcJt6w5/product-4.jpg',
        available: true,
        description: 'A whole chicken, ready for roasting.',
        specs: ['Cage-free', 'No antibiotics'],
        reviews: [],
        colors: [],
        stock: 30
    },
    {
        id: 5,
        name: 'Orange Juice',
        price: 3.49,
        unit: '59 fl oz',
        brand: 'Tropicana',
        category: 'Beverages',
        rating: 4.9,
        expiryDate: '2024-09-15',
        image: 'https://i.ibb.co/Bztd9CV/product-5.jpg',
        available: true,
        description: 'Freshly squeezed orange juice.',
        specs: ['100% Juice', 'Not from concentrate'],
        reviews: [],
        colors: [],
        stock: 80
    },
    {
        id: 6,
        name: 'Broccoli',
        price: 1.99,
        unit: 'per lb',
        brand: 'GreenGiant',
        category: 'Vegetables',
        rating: 4.7,
        expiryDate: '2024-08-05',
        image: 'https://i.ibb.co/9vjB2Gz/product-6.jpg',
        available: true,
        description: 'Fresh broccoli crowns.',
        specs: ['Rich in Fiber', 'Excellent source of Vitamin K'],
        reviews: [],
        colors: ['Green'],
        stock: 100
    },
    {
        id: 7,
        name: 'Carrots',
        price: 1.49,
        unit: 'per bunch',
        brand: 'FreshMart',
        category: 'Vegetables',
        rating: 4.5,
        expiryDate: '2024-08-10',
        image: 'https://i.ibb.co/bFk3b0M/product-7.jpg',
        available: true,
        description: 'A bunch of fresh carrots.',
        specs: ['Organic', 'Rich in Vitamin A'],
        reviews: [],
        colors: ['Orange'],
        stock: 180
    },
    {
        id: 8,
        name: 'Fruit Juice',
        price: 4.50,
        unit: '64 fl oz',
        brand: 'JuicyJuice',
        category: 'Beverages',
        rating: 4.8,
        expiryDate: '2024-10-01',
        image: 'https://i.ibb.co/dKx0T4M/product-8.jpg',
        available: true,
        description: 'A refreshing blend of various fruit juices.',
        specs: ['All Natural', 'No added sugar'],
        reviews: [],
        colors: [],
        stock: 70
    },
    {
        id: 9,
        name: 'Onions',
        price: 1.15,
        unit: 'per lb',
        brand: 'FreshMart',
        category: 'Vegetables',
        rating: 4.4,
        expiryDate: '2024-08-20',
        image: 'https://i.ibb.co/1fBFV1p/product-9.jpg',
        available: true,
        description: 'Yellow onions, sold by the pound.',
        specs: ['Versatile for cooking'],
        reviews: [],
        colors: ['Yellow'],
        stock: 250
    },
    {
        id: 10,
        name: 'Apples',
        price: 2.99,
        unit: 'per lb',
        brand: 'Washington',
        category: 'Fruits',
        rating: 4.6,
        expiryDate: '2024-08-18',
        image: 'https://i.ibb.co/yQYf1D4/product-10.jpg',
        available: true,
        description: 'Crisp red apples, sold by the pound.',
        specs: ['Gala', 'Sweet and juicy'],
        reviews: [],
        colors: ['Red'],
        stock: 130
    },
    {
        id: 11,
        name: 'Butter',
        price: 2.75,
        unit: '1/2 lb',
        brand: 'Land O Lakes',
        category: 'Dairy',
        rating: 4.9,
        expiryDate: '2024-09-01',
        image: 'https://i.ibb.co/Vvzbf4S/product-11.jpg',
        available: true,
        description: 'A stick of unsalted butter.',
        specs: ['Unsalted', 'Grade AA'],
        reviews: [],
        colors: [],
        stock: 90
    },
    {
        id: 12,
        name: 'Eggs',
        price: 2.25,
        unit: 'dozen',
        brand: 'HappyFarms',
        category: 'Dairy',
        rating: 4.8,
        expiryDate: '2024-08-12',
        image: 'https://i.ibb.co/3MJWz4f/product-12.jpg',
        available: true,
        description: 'A dozen large, white eggs.',
        specs: ['Grade A', 'Cage-free'],
        reviews: [],
        colors: [],
        stock: 100
    }
];

const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Toys'];

const promotions = [
    {
        id: 1,
        title: 'Fresh Deals',
        discount: '15% OFF',
        code: 'FRESH15',
        validUntil: '2025-02-15'
    },
    {
        id: 2,
        title: 'Welcome Offer',
        discount: '₹150 OFF',
        code: 'WELCOME150',
        validUntil: '2025-03-10'
    },
    {
        id: 3,
        title: 'Weekend Special',
        discount: '25% OFF on Dairy',
        code: 'DAIRY25',
        validUntil: '2025-02-01'
    }
];

// Notification data
const notifications = [
    {
        id: 1,
        type: 'order',
        title: 'Order Delivered',
        message: 'Your order #1234 has been delivered successfully',
        timestamp: new Date(2025, 0, 14, 8, 30).getTime(),
        isRead: false,
        icon: 'fa-box-check',
        color: 'green'
    },
    {
        id: 2,
        type: 'promo',
        title: 'Special Offer',
        message: 'Get 50% off on all winter collection items!',
        timestamp: new Date(2025, 0, 14, 7, 15).getTime(),
        isRead: false,
        icon: 'fa-tag',
        color: 'orange'
    },
    {
        id: 3,
        type: 'news',
        title: 'New Collection Arrived',
        message: 'Check out our latest spring collection',
        timestamp: new Date(2025, 0, 13, 18, 45).getTime(),
        isRead: true,
        icon: 'fa-tshirt',
        color: 'blue'
    },
    {
        id: 4,
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully',
        timestamp: new Date(2025, 0, 13, 15, 20).getTime(),
        isRead: true,
        icon: 'fa-user-check',
        color: 'purple'
    }
];

// Trending tags data
const trendingTags = [
    { id: 1, name: 'Summer Collection', searches: 15420 },
    { id: 2, name: 'Casual Wear', searches: 12350 },
    { id: 3, name: 'Sport Shoes', searches: 11200 },
    { id: 4, name: 'Designer Bags', searches: 9870 },
    { id: 5, name: 'Smart Watches', searches: 8940 },
    { id: 6, name: 'Formal Wear', searches: 7650 },
    { id: 7, name: 'Accessories', searches: 6780 },
    { id: 8, name: 'Winter Wear', searches: 5430 },
    { id: 9, name: 'Ethnic Wear', searches: 4980 },
    { id: 10, name: 'Sunglasses', searches: 4320 },
    { id: 11, name: 'Sneakers', searches: 3890 },
    { id: 12, name: 'Denim', searches: 3450 },
    { id: 13, name: 'Party Wear', searches: 3210 },
    { id: 14, name: 'Fitness Gear', searches: 2980 },
    { id: 15, name: 'Home Decor', searches: 2760 }
];

const users = [
    {
        id: 'user1',
        name: 'Sayan B',
        email: 'sayan@example.com',
        password: 'password123',
        avatar: 'https://i.pravatar.cc/150?u=sayan',
        createdAt: new Date().toISOString()
    }
];

const farmerCatalog = [
    { id: 101, name: 'Mangoes', price: 3.25, unit: 'per kg', brand: 'Local Farms', category: 'Fruits', stock: 100, available: true, description: 'Sweet, juicy ripe mangoes.', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400' },
    { id: 102, name: 'Oranges', price: 2.10, unit: 'per kg', brand: 'Citrus Valley', category: 'Fruits', stock: 100, available: true, description: 'Juicy oranges, packed with Vitamin C.', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400' },
    { id: 103, name: 'Grapes', price: 2.75, unit: 'per kg', brand: 'Green Valley', category: 'Fruits', stock: 100, available: true, description: 'Sweet seedless green grapes.', image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400' },
    { id: 104, name: 'Broccoli', price: 1.99, unit: 'per kg', brand: 'GreenGiant', category: 'Vegetables', stock: 100, available: true, description: 'Fresh broccoli crowns.', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400' },
    { id: 105, name: 'Carrots', price: 1.49, unit: 'per kg', brand: 'FreshMart', category: 'Vegetables', stock: 100, available: true, description: 'A bunch of fresh carrots.', image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400' },
    { id: 106, name: 'Onions', price: 1.15, unit: 'per kg', brand: 'FreshMart', category: 'Vegetables', stock: 100, available: true, description: 'Fresh red and yellow onions.', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400' },
    { id: 107, name: 'Rice', price: 1.80, unit: 'per kg', brand: 'Harvest Fields', category: 'Crops', stock: 100, available: true, description: 'Premium quality raw rice, freshly harvested.', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400' },
    { id: 108, name: 'Wheat', price: 1.50, unit: 'per kg', brand: 'Harvest Fields', category: 'Crops', stock: 100, available: true, description: 'Freshly harvested wheat grains.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed?w=400' },
    { id: 109, name: 'Corn', price: 1.30, unit: 'per kg', brand: 'Local Farms', category: 'Crops', stock: 100, available: true, description: 'Fresh corn kernels, harvested from local farms.', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400' },
    { id: 110, name: 'Barley', price: 1.65, unit: 'per kg', brand: 'Harvest Fields', category: 'Crops', stock: 100, available: true, description: 'Whole barley grains, great for soups and porridge.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400' },
    { id: 111, name: 'Millet', price: 1.90, unit: 'per kg', brand: 'Harvest Fields', category: 'Crops', stock: 100, available: true, description: 'Nutritious millet grains, a gluten-free staple.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' }
];

function normalizeSeedProducts(existingProducts) {
    const produceFruitNames = ['Organic Bananas', 'Apples'];
    const produceVegetableNames = ['Tomatoes', 'Green Bell Pepper', 'Broccoli', 'Carrots', 'Onions'];
    return existingProducts.map(product => {
        if (product.category === 'Produce') {
            product.category = produceFruitNames.includes(product.name) ? 'Fruits' : produceVegetableNames.includes(product.name) ? 'Vegetables' : 'Crops';
        }
        if (!product.requiredQuantity) product.requiredQuantity = 1;
        if (!product.requiredUnit) product.requiredUnit = product.unit && product.unit.includes('ton') ? 'ton' : 'kg';
        return product;
    });
}

const storedProducts = localStorage.getItem('products');
const initialProducts = storedProducts ? JSON.parse(storedProducts) : normalizeSeedProducts(products);
if (localStorage.getItem('farmerCatalogSeeded') !== 'true') {
    initialProducts.push(...farmerCatalog);
    localStorage.setItem('farmerCatalogSeeded', 'true');
}
const uniqueProducts = [];
const productKeys = new Set();
normalizeSeedProducts(initialProducts).forEach(product => {
    const key = `${String(product.name || '').trim().toLowerCase()}::${String(product.category || '').trim().toLowerCase()}`;
    if (!productKeys.has(key)) {
        productKeys.add(key);
        uniqueProducts.push(product);
    }
});
localStorage.setItem('products', JSON.stringify(uniqueProducts));
