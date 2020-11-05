require('dotenv').config();
const app = require('./app.js');
const { PORT } = require('./config');

app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`));
