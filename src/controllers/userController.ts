import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import DbService from '../services/DbService';
import { User } from "../models/interfaces";
import { fork } from "child_process";

export class UserController {

  constructor() {
    DbService.createDb();
  }
  public async registerUser(req: Request, res: Response) {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    const user: User = {
      username: req.body.username,
      password: hashedPassword,

    };
    
    DbService.createUser(user);

    const token = jwt.sign({ username: req.body.username, scope : req.body.scope }, process.env["JWT_SECRET"]);
    return res.status(200).send({ token: token });
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    if (!(username && password)) {
      return res.status(400).send("All input is required");
    }

    const userResult = await DbService.findUserByUsername(req.body.username);
    const user = userResult.rows[0];
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token = jwt.sign({ username: req.body.username, scope: req.body.scope }, process.env["JWT_SECRET"]);
        return res.status(200).send({ token: token });
      }

      return res.status(401).json({ status: "error", code: "unauthorized" });
    });
  }

  public async loadItems(req: Request, res: Response){
    try {
      const itemsResult = await DbService.getAllItems();
      const items = itemsResult.rows;
      console.log(items);
      return res.status(200).send({ items: items, message: "Items are loaded." });
    } catch (error) {
      return res.status(500).send("Server error.");
    }
  }

  public async add(req: Request, res: Response){
    try {
      if (!req.body) {
        return res.status(400).send("Bad request.");
      }
      const itemResult = await DbService.add(req.body);
      const item = itemResult.rows[0];
      console.log(item);
      return res.status(200).send({ data: item });
    } catch (error) {
      return res.status(500).send("Server error.");
    }
  }

  public async delete(req: Request, res: Response){
    try {
      const { id } = req.params
      await DbService.deleteById(id);
      console.log(`Item id=${id} deleted.`);
      return res.status(200).send({message: "Item deleted."});
    } catch (error) {
      return res.status(500).send("Server error.");
    }
  }

  public async update(req: Request, res: Response){
    try {
      const newItem = req.body;
      await DbService.updateById(newItem);
      return res.status(200).send({message: "Item is updated."});
    } catch (error) {
      return res.status(500).send("Server error.");
    }
  }

  public async heavyTask(req: Request, res: Response) {

    try {
      const child = fork("src/tasks/heavyTask.ts");

      child.on("close", function (code) {
        console.log("child process exited with code " + code);
        return res.status(200).send({message:"Long Running Operation Done!"});
      });
      
    } catch (error) {
      return res.status(500).send("Server error.");
    }
  }
}
