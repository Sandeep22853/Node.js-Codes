const { connectDB, client } = require("./db");
const { ddlExamples } = require("./ddl");
const { dmlExamples } = require("./dml");
const { dclExamples } = require("./dcl");

async function runAll() {
  const db = await connectDB();

  try {
    await ddlExamples(db);
    await dmlExamples(db);
    await dclExamples(db);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

runAll();
