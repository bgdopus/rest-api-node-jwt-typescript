import { User } from '../models/interfaces';
import { DbContext } from './DbContext';
const pgtools = require("pgtools");

export class DbService {
	private initialConfig = {
		user: "postgres",
		host: "localhost",
		password: "123456",
		port: 5432
	};
	private db;

	constructor() {
		pgtools.createdb(this.initialConfig, "some_db", this.initDb.bind(this));
	}

	public createUser(user: User) {
		const text = `
			INSERT INTO users (username, password)
			VALUES ($1, $2)
			RETURNING id
		`;
		const values = [user.username, user.password];
		return this.db.execute(text, values).then(result => {
			if (result) {
				console.log('User created.');
			}
		});
	}

	public findUserByUsername(username: string) {
		const text = `SELECT * FROM users WHERE username = $1`;
		const values = [username];
		return this.db.execute(text, values);
	}
	
	public getAllItems() {
		const text = `SELECT * FROM items`;
		return this.db.execute(text, null);
	}

	public add(item) {
		const text = `INSERT INTO items (name, type, description)
		VALUES ($1, $2, $3)
		RETURNING *;`;
		const values = [item.name, item.type, item.description];
		return this.db.execute(text, values);
	}

	public deleteById(item) {
		const text = `DELETE FROM items WHERE id = $1`;
		const values = [item];
		return this.db.execute(text, values);
	}

	public updateById(item) {
		const text = `UPDATE items SET name = $2, type = $3, description = $4 WHERE id = $1`;
		const values = [item.id, item.name, item.type, item.description];
		return this.db.execute(text, values);
	}

	private seed() {
		const usersTableQuery = `
		CREATE TABLE IF NOT EXISTS "users" (
			"id" SERIAL,
			"username" VARCHAR(15) UNIQUE,
			"password" VARCHAR(100) NOT NULL,
			PRIMARY KEY ("id")
		);`;

		this.db.execute(usersTableQuery, null).then(result => {
			if (result) {
				console.log('User table created');
				return result;
			}
		});

		const itemsTableQuery = `
		CREATE TABLE IF NOT EXISTS "items" (
			"id" SERIAL,
			"name" VARCHAR(15) NOT NULL,
			"type" VARCHAR(15) NOT NULL,
			"description" VARCHAR(50) NOT NULL,
			PRIMARY KEY ("id")
		);
		INSERT INTO items (name, type, description)
		VALUES ('Milk', 'from cow', 'Milk from cow description');

		INSERT INTO items (name, type, description)
		VALUES ('coca-cola', 'cola', 'description description description');`;

		this.db.execute(itemsTableQuery, null).then(result => {
			if (result) {
				console.log('Items table created');
				return result;
			}
		});
	}

	private initDb(err, res) {
		if (err) {
			console.error(err);
			process.exit(-1);
		}
		console.log(res);
		this.db = new DbContext();
		this.seed();
	}
}
