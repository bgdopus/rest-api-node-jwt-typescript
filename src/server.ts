import dotenv from 'dotenv';
dotenv.config();
import express from "express";

import compression from "compression";
import cors from "cors";

import { UserRoutes } from "./routes/userRoutes";

class Server {
  public app: express.Application;
  private dbService;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public routes(): void {
    this.app.use("/api/user", new UserRoutes().router);
  }

  public config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(cors());
  }


  public async start(): Promise<void> {
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "  API is running at http://localhost:%d",
        this.app.get("port")
      );
    });
  }

}

const server = new Server();

server.start();
