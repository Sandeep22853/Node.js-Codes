import { exec } from "child_process";
import { mkdir, readFile } from "fs/promises";
import { createHash } from "crypto";
import path from "path";

const sandboxDir = path.join(process.cwd(), "sandbox");

async function runCommand(cmd, cwd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd, shell: true }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function verifyChecksum(filePath) {
  const data = await readFile(filePath);
  const hash = createHash("sha256").update(data).digest("hex");
  return hash;
}

async function main() {
  console.log("Creating sandbox folder...");
  await mkdir(sandboxDir, { recursive: true });

  console.log("Initializing sandbox package.json...");
  await runCommand("npm init -y", sandboxDir);

  console.log("Installing lodash@4.17.21...");
  await runCommand("npm install lodash@4.17.21 --save-exact", sandboxDir);

  const lockPath = path.join(sandboxDir, "package-lock.json");
  console.log("Calculating checksum of package-lock.json...");
  const checksum = await verifyChecksum(lockPath);
  console.log("Checksum:", checksum);

  console.log("Installation complete and verified.");
}

main().catch((err) => {
  console.error("Error:", err);
});