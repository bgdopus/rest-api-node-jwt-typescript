const { Pool } = require("pg");

export class DbContext {
	private credentials = {
		user: "postgres",
		host: "localhost",
		database: "some_db",
		password: "123456",
		port: 5432
	};
	private client = null;

	constructor() {
		if (!this.client) {
			this.client = new Pool(this.credentials);
		}
	}

	public execute = async (query, values) => {
		try {
			await this.client.connect();     // gets connection
			return await this.client.query(query, values);  // sends queries
		} catch (error) {
			console.error(error.stack);
			return false;
		}
	}
}
