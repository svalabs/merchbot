import express from 'express';
import crypto from 'crypto';
import { db } from './database';

import bodyParser from 'body-parser';
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    required: '${label} ist ein Pflichtpfeld',
  },
});

const schema = yup.object().required().shape({
  name: yup.string().label('Name').required(),
  email: yup.string().label('E-Mail-Adresse').email('Ungültige E-Mail-Adresse').required(),
  address: yup.string().label('Adresse').required(),
  city: yup.string().label('Ort').required(),
  plz: yup.string().label('Postleitzahl').required().matches(/^[0-9]{5}$/, 'Bitte überprüfen Sie die eingegebene Postleitzahl'),
  items: yup.array().of(yup.string()).required('Bitte wählen Sie einen oder mehrere Merch-Artikel aus').label('Artikelauswahl'),
});

const app = express();
const port = 5000;
const password = process.env.VOTE_PASSWORD || crypto.randomBytes(20).toString('hex');

app.listen(port,  () => console.log(`Listening on port ${port} with the password "${password}"`));

app.use(bodyParser.json());

// create a GET route
app.get('/orders', (req, res) => {
  if (req.query.password !== password) {
    res.status(403).json({ error: `Bad or missing password : ${req.query.password}` });
    return;
  }

  db.all('SELECT * FROM orders', (err, rows) => {
    if (err) {
      res.status(400).json({ error:err.message });
      return;
    }
    res.json({
      message: 'success',
      data:rows,
    });
  });
});

app.post('/submit', (req, res) => {
  schema.validate(req.body, { strict: true, stripUnknown: true }).then((data) => {
    const INSERT_QUERY =
        'INSERT INTO orders(name, street, plz, email, items, city) VALUES(?, ?, ?, ?, ?, ?)';
    const { address, name, plz, email, city } = data;
    const items = data.items.join('|');
    db.run(INSERT_QUERY, [name, address, plz, email, items, city], (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: 'Database error' });
      }
      res.json({
        message: 'success',
      });
    });
  }).catch((err) => {
    res.status(400).json({ error:err.message });
  });
});