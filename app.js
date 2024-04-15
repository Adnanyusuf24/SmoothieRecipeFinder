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
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } else {
      // For Vercel, just export the app
      module.exports = app;
    }
  })
  .catch((err) => console.log('Database connection error:', err));

// routes
// Specific routes first
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// Then the wildcard route
app.get('*', checkUser);

app.use(authRoutes);