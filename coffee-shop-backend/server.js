const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 8080;

// Конфигурация на MySQL базата данни
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'D7718dv198@#84',
    database: 'coffee_shop',
    port: 3307
});

// Свързване с базата данни
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to the database');
});

app.use(cors());
// Позволява парсване на JSON тяло
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Статични файлове
app.use(express.static(path.join(__dirname, 'public')));

// CRUD операции за продуктите
// Четене на продукти
app.get('/get-products', (req, res) => {
    const sql = 'SELECT * FROM products WHERE isProduct = 1';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Четене на менютата
app.get('/get-menus', (req, res) => {
    const sql = 'SELECT * FROM products WHERE isProduct = 0';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

// Добавяне на продукт в количката
app.post('/order', (req, res) => {
    const { customer_name, email, phone_number, address, total_amount, order_date, products } = req.body;
    
    let totalAmount = 0;
    products.forEach(product => {
        totalAmount += parseFloat(product.productPrice); // Ensure productPrice is parsed as a float
    });
    
    // Format total amount to two decimal places
    totalAmount = parseFloat(totalAmount.toFixed(2));

    const orderDate = new Date();

    // Insert order into orders table
    const orderSql = 'INSERT INTO orders (customer_name, email, phone_number, address, total_amount, order_date) VALUES (?, ?, ?, ?, ?, ?)';
    const orderValue = [customer_name, email, phone_number, address, totalAmount, orderDate];

    db.query(orderSql, orderValue, (err, orderResult) => {
        if (err) throw err;

        const orderId = orderResult.insertId;

        // Insert products into order_products table
        if (Array.isArray(products) && products.length > 0) {
            const productSql = 'INSERT INTO order_products (order_id, product_id) VALUES ?';
            const productValues = products.map(product => [orderId, product.productId]);

            db.query(productSql, [productValues], (err, productResult) => {
                if (err) throw err;
                res.json({ message: 'Успешна поръчка!' });
            });
        } else {
            res.json({ message: 'Успешна поръчка, но без продукти.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
