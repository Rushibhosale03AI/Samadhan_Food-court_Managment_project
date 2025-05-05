// const express = require('express');
// const mysql = require('mysql2');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // App setup
// const app = express();
// const PORT = 5000;

// // Middleware to manually handle CORS
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');  // React front-end URL
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');  // Allowed methods
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Allowed headers
//   next();
// });

// // Middleware for JSON and URL-encoded parsing
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Database connection
// const db = mysql.createConnection({
//   host: 'localhost',  // Database host
//   user: 'abhi',       // MySQL username
//   password: '2021',   // MySQL password
//   database: 'cafemanagement', // Database name
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection error:', err);
//     process.exit(1);
//   }
//   console.log('Connected to MySQL database');
// });

// // Multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, 'uploads');
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// // Routes

// // Get all menu items
// app.get('/api/menu', (req, res) => {
//   const query = 'SELECT * FROM menu';
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// // Add a menu item
// app.post('/api/menu', upload.single('image'), (req, res) => {
//   const { name, price, description } = req.body;
//   const image = req.file ? `/uploads/${req.file.filename}` : null;
//   const query = 'INSERT INTO menu (name, price, description, image) VALUES (?, ?, ?, ?)';
//   db.query(query, [name, price, description, image], (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.status(201).json({ message: 'Menu item added', id: result.insertId });
//   });
// });

// // Place an order
// app.post('/api/orders', (req, res) => {
//   const { menuItems, totalAmount, status } = req.body;

//   // Check for missing or invalid data
//   if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
//     return res.status(400).json({ error: 'menuItems is required and must be an array.' });
//   }
//   if (typeof totalAmount !== 'number' || totalAmount <= 0) {
//     return res.status(400).json({ error: 'totalAmount must be a positive number.' });
//   }
//   if (!status || typeof status !== 'string') {
//     return res.status(400).json({ error: 'status is required and must be a string.' });
//   }

//   // Insert the order into the orders table
//   const queryOrder = 'INSERT INTO orders (total_amount, status) VALUES (?, ?)';
//   db.query(queryOrder, [totalAmount, status], (err, result) => {
//     if (err) {
//       console.error('Error inserting order:', err);
//       return res.status(500).json({ error: 'Failed to insert order into database.' });
//     }

//     const orderId = result.insertId;
//     const queryOrderDetails = 'INSERT INTO order_details (order_id, menu_id, quantity, price) VALUES ?';
//     const orderDetails = menuItems.map(item => [orderId, item.menuId, item.quantity, item.price]);

//     // Insert order details into the order_details table
//     db.query(queryOrderDetails, [orderDetails], (err) => {
//       if (err) {
//         console.error('Error inserting order details:', err);
//         return res.status(500).json({ error: 'Failed to insert order details into database.' });
//       }
//       res.status(201).json({ message: 'Order placed successfully', orderId });
//     });
//   });
// });


// // Get all orders
// app.get('/api/orders', (req, res) => {
//   const query = `
//     SELECT o.id AS orderId, o.total_amount, o.status, od.menu_id, od.quantity, od.price
//     FROM orders o
//     JOIN order_details od ON o.id = od.order_id
//   `;
//   db.query(query, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');



const app = express();
app.use(cors());
app.use(express.json());


const uri = "mongodb://localhost:27017/samadhan"; // MongoDB URI
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db('samadhan');
        const menuCollection = database.collection('menuCollection');
        const ordersCollection = database.collection('orders');
        const staff = database.collection('staff'); // MongoDB collection for staff

        // Get all menu items
        app.get('/api/menu', async (req, res) => {
            
            try {
                const menu = await menuCollection.find({}).toArray();
                res.json(menu);
            } catch (error) {
                console.error('Error fetching menu:', error);
                res.status(500).send('Failed to fetch menu');
            }
        });
        

        // Place a new order
        app.post('/api/orders', async (req, res) => {
            const { menu_ids, total_price } = req.body;

            if (!menu_ids || !total_price) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            try {
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);

                const result = await ordersCollection.insertOne({
                    menu_ids,
                    total_price,
                    order_time: currentDate,
                });

                res.status(201).json({ message: 'Order placed successfully', order_id: result.insertedId });
            } catch (error) {
                console.error('Error inserting order:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });

        // Fetch orders by date
        app.get('/api/orders', async (req, res) => {
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({ message: 'Date is required' });
            }

            try {
                const selectedDate = new Date(date);
                const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
                const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

                const orders = await ordersCollection.find({
                    order_time: {
                        $gte: startOfDay,
                        $lte: endOfDay,
                    },
                }).sort({ order_time: 1 }).toArray();

                res.json(orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                res.status(500).json({ message: 'Failed to fetch orders for the selected date' });
            }
        });

        // Dashboard Endpoint
        app.get('/api/dashboard', async (req, res) => {
            try {
                // Total orders
                const orders = await ordersCollection.countDocuments();

                // Total revenue
                const totalRevenue = await ordersCollection.aggregate([
                    { $group: { _id: null, revenue: { $sum: "$total_price" } } },
                ]).toArray();

                const revenue = totalRevenue[0]?.revenue || 0;

                // Today's date
                const today = new Date().toISOString().split('T')[0];

                // Monthly revenue
                const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

                const monthlyRevenue = await ordersCollection.aggregate([
                    {
                        $match: {
                            order_time: {
                                $gte: startOfMonth,
                                $lte: endOfMonth,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { $dayOfMonth: "$order_time" },
                            revenue: { $sum: "$total_price" },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]).toArray();

                const formattedMonthlyRevenue = monthlyRevenue.map((entry) => ({
                    date: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${entry._id}`,
                    revenue: entry.revenue,
                }));

                res.json({
                    orders,
                    revenue,
                    today,
                    monthlyRevenue: formattedMonthlyRevenue,
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                res.status(500).json({ message: 'Failed to fetch dashboard data', error: error.message });
            }
        });

        // Staff routes
        // Get all staff details
        app.get('/api/staff', async (req, res) => {
            try {
                const staff = await staff.find({}).toArray(); // Fetch all staff from the collection
                res.json(staff); // Send staff details as JSON
            } catch (error) {
                console.error('Error fetching staff:', error);
                res.status(500).send('Failed to fetch staff');
            }
        });

        // Add a new staff member
        const mongoose = require('mongoose');

// Define Staff Schema
const staffSchema = new mongoose.Schema({
  staff_id: String,
  staff_name: String,
  salary: Number,
  designation: String,
});

// Add a new staff member using native MongoDB driver
app.post('/api/staff', async (req, res) => {
    try {
      const { staff_id, staff_name, salary, designation } = req.body;
  
      if (!staff_id || !staff_name || !salary || !designation) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newStaff = { staff_id, staff_name, salary, designation };
      const result = await staff.insertOne(newStaff); // native MongoDB insert
  
      res.status(201).json({ message: 'Staff added successfully!', staff: result.ops?.[0] || newStaff });
    } catch (error) {
      console.error('Error inserting staff:', error);
      res.status(500).json({ message: 'Failed to add staff member', error: error.message });
    }
  });
  

        
        

        // Start the server
        const PORT = 5000;
      
        app.listen(PORT, () => {
          console.log(`Server is running on http://localhost:${PORT}`);
      }).setTimeout(50000); 

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

main().catch(console.dir);
