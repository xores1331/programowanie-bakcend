const path = require('path');
const express = require('express');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const { engine } = require('express-handlebars');

const app = express();

app.engine('.hbs', engine({extname: '.hbs', defaultLayout: 'main-layout.hbs'}));
app.set('view engine', '.hbs');
app.set('views', 'views');

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/' });
});

app.listen(33333);
