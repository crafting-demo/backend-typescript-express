import mysql, { RowDataPacket } from "mysql2";

import { DBConfig } from "./config";

export class MySQLClient {
  private db: mysql.Connection;

  private config = DBConfig;

  private host = process.env.MYSQL_SERVICE_HOST;

  constructor() {
    this.db = mysql.createConnection({
      host: this.host,
      user: this.config.User,
      password: this.config.Pass,
      database: this.config.DBName,
    });
  }

  public read(key: string) {
    const sql = `SELECT content FROM ${this.config.DBCollection} WHERE uuid=${key}`;
    let value: string = "";
    let error: string = "";
    this.db.query(sql, (err, result) => {
      if (err) {
        error = err.message;
      } else {
        const row = (<RowDataPacket>result)[0];
        value = row.content;
      }
    });
    return { value, error };
  }

  public write(key: string, value: string) {
    const sql = `INSERT INTO ${this.config.DBCollection} (uuid, content) VALUES (${key}, ${value})`;
    let error: string = "";
    this.db.query(sql, (err) => {
      if (err) {
        error = err.message;
      }
    });
    return { error };
  }
}
