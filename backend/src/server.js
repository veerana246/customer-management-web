require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const customersRoutes = require('./routes/customers');
const addressesRoutes = require('./routes/addresses');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

app.use(cors());
app.use(express.json());
app.use((req,res,next) => { logger.info(`${req.method} ${req.path}`); next(); });

app.use('/api/customers', customersRoutes);
app.use('/api/addresses', addressesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));


module.exports = app;
