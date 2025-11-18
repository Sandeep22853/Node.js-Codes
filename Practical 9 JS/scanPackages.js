import fs from "fs";
import path from "path";
import crypto from "crypto";

const nodeModulesPath = path.join(process.cwd(), "node_modules");
const visited = new Set();
const dependencyGraph = {};

function computeSHA256(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function getPackageInfo(packageDir) {
  const pkgPath = path.join(packageDir, "package.json");
  if (!fs.existsSync(pkgPath)) return null;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const files = fs.readdirSync(packageDir, { withFileTypes: true });

  // Compute SHA-256 hashes of all files inside package folder
  const hashes = [];
  for (const file of files) {
    const filePath = path.join(packageDir, file.name);
    if (file.isFile()) {
      hashes.push({ file: file.name, sha256: computeSHA256(filePath) });
    }
  }

  // Check license
  const licenseFile = files.find(f =>
    f.name.toLowerCase().includes("license")
  );

  return {
    name: pkg.name,
    version: pkg.version,
    license: pkg.license || null,
    hasLicenseFile: !!licenseFile,
    dependencies: pkg.dependencies ? Object.keys(pkg.dependencies) : [],
    hashes,
  };
}

function scanPackage(packageName, parent = null) {
  const packageDir = path.join(nodeModulesPath, packageName);
  if (visited.has(packageDir)) return;
  visited.add(packageDir);

  const info = getPackageInfo(packageDir);
  if (!info) return;

  dependencyGraph[info.name] = info.dependencies;

  // Recursively scan dependencies
  for (const dep of info.dependencies) {
    scanPackage(dep, info.name);
  }
}

function reportMissingLicenses() {
  console.log("\nPackages missing license info or file:\n");
  for (const [name, deps] of Object.entries(dependencyGraph)) {
    const pkgDir = path.join(nodeModulesPath, name);
    const info = getPackageInfo(pkgDir);
    if (info && (!info.license || !info.hasLicenseFile)) {
      console.log('- ${name}@${info.version}');
    }
  }
}

function main() {
  const topLevel = fs.readdirSync(nodeModulesPath).filter(f =>
    fs.existsSync(path.join(nodeModulesPath, f, "package.json"))
  );

  for (const pkg of topLevel) {
    scanPackage(pkg);
  }

  console.log("Dependency Graph:\n", dependencyGraph);
  reportMissingLicenses();
}

main();