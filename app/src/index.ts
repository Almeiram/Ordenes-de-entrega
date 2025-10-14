import app from "./server";
import { syncDB } from "./config/sync";

const PORT = process.env.APP_PORT;

const start = async () => {
    try {
        await syncDB();
        app.listen(PORT, () => {
            console.log('Server listening in the port:3000')
        });
    } catch (error) {
        console.error('Error to star the app: ', error);
        process.exit(1);
    }
}

start();