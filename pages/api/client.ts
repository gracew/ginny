
import { Client, types } from 'pg';

types.setTypeParser(types.builtins.NUMERIC, (val: string) => Number(val));
const client = new Client();
if (process.env.NODE_ENV !== "test") {
  client.connect();
}
export { client };
