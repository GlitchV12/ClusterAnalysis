import Papa from 'papaparse';
import type { Dataset, DatasetColumn, VariableType } from '../../../types/dataset';

export class ParserService {
  /**
   * Parses a CSV file and returns a Promise that resolves to a Dataset object.
   */
  static async parseCSV(file: File): Promise<Dataset> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true, // Automatically converts numbers and booleans
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            return reject(new Error('Failed to parse CSV: ' + results.errors[0].message));
          }

          const rawData = results.data as Record<string, any>[];
          if (rawData.length === 0) {
            return reject(new Error('The uploaded file is empty or contains no valid rows.'));
          }

          // Extract columns from the first row or meta fields
          const headers = results.meta.fields || Object.keys(rawData[0] || {});
          if (headers.length === 0) {
            return reject(new Error('No columns found in the dataset.'));
          }

          const columns: DatasetColumn[] = headers.map((header, index) => {
            return {
              id: `col_${index}`,
              name: header,
              detectedType: 'unknown' as VariableType, // Will be refined in the Profiling phase
              missingCount: 0, // Calculated later
              uniqueCount: 0, // Calculated later
              isSelected: true,
            };
          });

          const dataset: Dataset = {
            id: `ds_${Date.now()}`,
            fileName: file.name,
            data: rawData,
            columns: columns,
            rowCount: rawData.length,
            colCount: columns.length,
          };

          resolve(dataset);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  }
}
