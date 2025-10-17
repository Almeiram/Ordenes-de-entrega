import dotenv from "dotenv";
import {app} from "./server";
import { syncDB } from "./config/syncDB";
import { envConfig, validateEnvConfig } from "./config/env";

dotenv.config();

const PORT = envConfig.APP_PORT;

const start = async () => {
  try {
    validateEnvConfig();
    
    await syncDB();

    app.listen(PORT, () => {
      console.log(`Server listening on PORT http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error conecting with DB :", error);
    process.exit(1);
  }
};

start();