require('dotenv').config();
const knex = require('knex');
const app = require('./app.js');
const { PORT, DATABSE_URL } = require('./config');

app.set('db', knex({
	client: 'pg',
	connection: DATABSE_URL
}));

app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
