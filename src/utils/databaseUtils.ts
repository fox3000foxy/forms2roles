import { promises as fs } from 'fs';
import path from 'path';

/**
 * Lit un fichier JSON et retourne son contenu parsé
 * @param filePath - Chemin vers le fichier JSON
 * @returns Promise contenant les données parsées
 */
export async function readJson<T = any>(filePath: string): Promise<T> {
  try {
    const absolutePath = path.resolve(filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la lecture du fichier ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Écrit des données dans un fichier JSON
 * @param filePath - Chemin vers le fichier JSON
 * @param data - Données à écrire
 * @param indent - Nombre d'espaces pour l'indentation (défaut: 2)
 */
export async function writeJson(filePath: string, data: any, indent: number = 2): Promise<void> {
  try {
    const absolutePath = path.resolve(filePath);
    const jsonContent = JSON.stringify(data, null, indent);
    
    // Créer le répertoire parent s'il n'existe pas
    const dir = path.dirname(absolutePath);
    await fs.mkdir(dir, { recursive: true });
    
    await fs.writeFile(absolutePath, jsonContent, 'utf-8');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erreur lors de l'écriture du fichier ${filePath}: ${error.message}`);
    }
    throw error;
  }
}