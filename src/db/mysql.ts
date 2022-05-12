import mysql from "mysql2/promise";

export class MySQLClient {
  private host = process.env.MYSQL_SERVICE_HOST;

  public async read(key: string) {
    const conn = await this.connect();
    const sql = `SELECT content FROM sample WHERE uuid='${key}'`;
    const [rows] = await conn.execute(sql);
    if (!rows || (Array.isArray(rows) && !rows.length)) {
      return { value: "Not Found" };
    }
    const result = rows as mysql.RowDataPacket[];
    return { value: result[0].content as string };
  }

  public async write(key: string, value: string) {
    const conn = await this.connect();
    const sql = `INSERT INTO sample (uuid, content) VALUES ('${key}', '${value}')`;
    await conn.execute(sql);
    return { value };
  }

  private async connect() {
    return mysql.createConnection({
      host: this.host,
      user: "brucewayne",
      password: "batman",
      database: "demo",
    });
  }
}
