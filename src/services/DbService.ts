import { User } from '../models/interfaces';
import pgtools from "pgtools";
import { Pool } from "pg";

export default class DbService {
	private static initialConfig = {
		user: "postgres",
		host: "localhost",
		password: "123456",
		port: 5432
	};
	private static pool;

	public static createDb() {
		pgtools.createdb(this.initialConfig, "some_db", DbService.seed.bind(this));
	}

	public static createUser(user: User) {
		const text = `
			INSERT INTO users (username, password)
			VALUES ($1, $2)
			RETURNING id
		`;
		const values = [user.username, user.password];
		return this.pool.query(text, values);
	}

	public static findUserByUsername(username: string) {
		const text = `SELECT * FROM users WHERE username = $1`;
		const values = [username];
		return this.pool.query(text, values);
	}
	
	public static getAllItems() {
		const text = `SELECT * FROM items`;
		return this.pool.query(text, null);
	}

	public static add(item) {
		const text = `INSERT INTO items (name, type, description)
		VALUES ($1, $2, $3)
		RETURNING *;`;
		const values = [item.name, item.type, item.description];
		return this.pool.query(text, values);
	}

	public static deleteById(item) {
		const text = `DELETE FROM items WHERE id = $1`;
		const values = [item];
		return this.pool.query(text, values);
	}

	public static updateById(item) {
		const text = `UPDATE items SET name = $2, type = $3, description = $4 WHERE id = $1`;
		const values = [item.id, item.name, item.type, item.description];
		return this.pool.query(text, values);
	}

	private static async seed(err, res) {
		if (err) {
			console.error(err);
			process.exit(-1);
		}
		console.log(res);
		this.pool = new Pool({
			user: "postgres",
			host: "localhost",
			database: "some_db",
			password: "123456",
			port: 5432
		});
		const usersTableQuery = `
		CREATE TABLE IF NOT EXISTS "users" (
			"id" SERIAL,
			"username" VARCHAR(15) UNIQUE,
			"password" VARCHAR(100) NOT NULL,
			PRIMARY KEY ("id")
		);`;

		this.pool.query(usersTableQuery, null).then(result => {
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

		this.pool.query(itemsTableQuery, null).then(result => {
			if (result) {
				console.log('Items table created');
				return result;
			}
		});
	}
}
