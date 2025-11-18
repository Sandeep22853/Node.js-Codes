async function dmlExamples(db) {
  const users = db.collection("users");

  await users.insertOne({ name: "Alice", email: "alice@example.com" });
  await users.insertMany([
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" },
  ]);

  const allUsers = await users.find().toArray();
  console.log("All Users:", allUsers);

  await users.updateOne({ name: "Alice" }, { $set: { email: "alice123@example.com" } });

  await users.deleteOne({ name: "Charlie" });
}

module.exports = { dmlExamples };
