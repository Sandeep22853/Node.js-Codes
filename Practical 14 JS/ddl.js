async function ddlExamples(db) {
  const usersCollection = await db.createCollection("users");
  console.log("Collection created: users");

  await usersCollection.createIndex({ email: 1 }, { unique: true });
  console.log("Index created on email");

}

module.exports = { ddlExamples };
