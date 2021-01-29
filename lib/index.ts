import express from 'express';
import config from './config';
config(); // Execute before importing routes
import routes from './routes'

const app: express.Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes
app.use(process.env.SUBDIR as string, routes);

app.listen(process.env.PORT, () => {
    console.log('Listening port:', process.env.PORT);
});