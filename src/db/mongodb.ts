import { MongoClient } from "mongodb";

export class MongoDBClient {
  private host = process.env.MONGODB_SERVICE_HOST;

  private port = process.env.MONGODB_SERVICE_PORT;

  private url = `mongodb://${this.host}:${this.port}`;

  public async read(key: string) {
    const client = new MongoClient(this.url);
    await client.connect();
    const db = client.db("demo");
    const col = db.collection("sample");
    const result = await col.findOne({ uuid: key });
    if (!result) {
      return { value: "Not Found" };
    }
    return { value: result.content as string };
  }

  public async write(key: string, value: string) {
    const client = new MongoClient(this.url);
    await client.connect();
    const db = client.db("demo");
    const col = db.collection("sample");
    try {
      await col.insertOne({ uuid: key, content: value });
    } catch (e) {
      return { value, error: `${e}` };
    }
    return { value };
  }
}
