async function dclExamples(db) {
  await db.command({
    createUser: "appUser",
    pwd: "password123",
    roles: [{ role: "readWrite", db: "myDatabase" }],
  });
  console.log("User created: appUser");
}

module.exports = { dclExamples };
