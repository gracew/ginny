
import { Client, types } from 'pg';

types.setTypeParser(types.builtins.NUMERIC, (val: string) => Number(val));
const client = new Client();
client.connect();
export { client };
