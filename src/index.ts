/* istanbul ignore file */
/* eslint-disable no-console */
import app from './app';
import 'dotenv/config';

const { PORT } = process.env;

const server = app.listen(PORT, () => console.log(
  `Server is running on PORT: ${PORT}`,
));

export default server;
