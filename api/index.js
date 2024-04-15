const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/authRoutes'); // Go up one directory level
const { requireAuth, checkUser } = require('../middleware/authMiddleware'); // Go up one directory level

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, '..', 'public'))); // Adjust path for static files
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views')); // Adjust path for views

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  })
  .catch(err => console.log('Database connection error:', err));

// Routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// Wildcard route for checking user in all other cases
app.get('*', checkUser);

// Export the app only in production environment (for Vercel)
if (process.env.NODE_ENV === 'production') {
    module.exports = app;
}
