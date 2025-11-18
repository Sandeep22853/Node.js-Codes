import { pathToFileURL } from 'url';

export async function dynamicImport(filePath) {
  try {
    if (filePath.endsWith('.json')) {
      
      const fileUrl = pathToFileURL(filePath).href;
      const mod = await import(fileUrl, { assert: { type: 'json' } });
      return mod.default; 
    }

    const mod = await import(filePath);

    if (mod && 'default' in mod) return mod.default;
    return mod;
  } catch (err) {
    console.error(' Failed to dynamically import', filePath, '-', err.message);
    return null;
  }
}