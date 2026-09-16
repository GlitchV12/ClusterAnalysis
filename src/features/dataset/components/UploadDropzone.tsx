import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType2, AlertCircle } from 'lucide-react';
import { ParserService } from '../services/parser.service';
import { useDatasetStore } from '../../../state/dataset.store';
import { useProjectStore } from '../../../state/project.store';
import './UploadDropzone.css';

export function UploadDropzone() {
  const { setDataset, setLoading, setError, error, isLoading } = useDatasetStore();
  const { setProject } = useProjectStore();
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    setDragError(null);
    setError(null);

    if (fileRejections.length > 0) {
      setDragError('Only CSV files are supported at this time.');
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    setLoading(true);
    
    try {
      // Small artificial delay to show loading state for UX as per blueprint
      await new Promise(resolve => setTimeout(resolve, 600)); 
      
      const parsedDataset = await ParserService.parseCSV(file);
      setDataset(parsedDataset);
      setProject(parsedDataset.id, file.name);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while parsing the file.');
    } finally {
      setLoading(false);
    }
  }, [setDataset, setLoading, setError, setProject]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="upload-container">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="dropzone-content">
            <div className="spinner"></div>
            <h3>Analyzing dataset</h3>
            <p>Reading rows and identifying columns...</p>
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="icon-wrapper">
              <UploadCloud size={48} className="upload-icon" />
            </div>
            <h3>Drop your dataset here</h3>
            <p>or click to browse from your computer</p>
            
            <div className="file-types">
              <span className="badge"><FileType2 size={14} /> CSV supported</span>
            </div>
          </div>
        )}
      </div>

      {(error || dragError) && (
        <div className="error-alert">
          <AlertCircle size={20} className="error-icon" />
          <div className="error-text">
            <strong>Upload failed</strong>
            <p>{error || dragError}</p>
          </div>
        </div>
      )}
    </div>
  );
}
