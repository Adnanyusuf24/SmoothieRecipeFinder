//const dbURI = 'mongodb+srv://RecipeFinder:Test1234cluster0.yl9aluj.mongodb.net/?retryWrites=true&w=majority';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // Conditionally start server based on environment
    if (process.env.NODE_ENV !== 'production') {
        const PORT = process.env.PORT || 3000; // Use PORT environment variable
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
  })
  .catch((err) => console.log('Database connection error:', err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);