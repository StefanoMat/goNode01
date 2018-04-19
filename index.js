const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const moment = require('moment');
const bodyParser = require('body-parser'); // visualizar informações


const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const checkNameMiddleware = ((req, res, next) => {
  if (req.query.nome == null || req.query.nome === '') {
    res.redirect('/');
  } else {
    next();
  }
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('main');
});

app.get('/major', checkNameMiddleware, (req, res) => {
  const username = req.query.nome;
  res.render('major', { nome: username });
});

app.get('/minor', checkNameMiddleware, (req, res) => {
  const username = req.query.nome;
  res.render('minor', { nome: username });
});


app.post('/check', (req, res, next) => {
  const birthday = `${req.body.birthday}`;
  const idade = moment().diff(moment(birthday, 'YYYY/MM/DD'), 'years');
  const username = `${req.body.username}`;
  if (idade >= 18) {
    res.redirect(`/major?nome=${username}`);
  } else {
    res.redirect(`/minor?nome=${username}`);
  }
  next();
});

app.listen(3000);
