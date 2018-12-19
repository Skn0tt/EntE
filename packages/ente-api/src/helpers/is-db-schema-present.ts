import { Connection } from "typeorm";

export const isDbSchemaPresent = async (
  connection: Connection
): Promise<boolean> => {
  const [result] = await connection.query(
    "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';"
  );
  const count: string = result["COUNT(*)"];
  return +count !== 0;
};
