import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticationMiddleware } from '../auth/auth';

export class UserRoutes {

    router: Router;
    public userController: UserController;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.routes();
    }
    routes() {
        this.router.route('/login').post(this.userController.loginUser.bind(this))
        this.router.route('/register').post(this.userController.registerUser.bind(this))

        this.router.route('/items').get(authenticationMiddleware, this.userController.loadItems.bind(this));
        this.router.route('/add').post(authenticationMiddleware, this.userController.add.bind(this));
        this.router.route('/delete/:id').delete(authenticationMiddleware, this.userController.delete.bind(this));
        this.router.route('/update').put(authenticationMiddleware, this.userController.update.bind(this));
        this.router.route('/long-running-job').get(authenticationMiddleware, this.userController.heavyTask.bind(this));
    }
}