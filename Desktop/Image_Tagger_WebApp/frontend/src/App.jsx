import React, { useState } from 'react';
import './index.css';
import ImageUploader from './ImageUploader.jsx';
import ImageGrid from './ImageGrid.jsx';
import GroupForm from './GroupForm.jsx';

const resizeImage = (file) => {
  // ... (resizeImage function remains the same as before)
};


function App() {
  const [files, setFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({}); // Changed to an object
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(new Set());

  const handleFilesAccepted = async (acceptedFiles) => {
    setFiles(acceptedFiles);
    setAnalysisResults({}); // Clear previous results
    setSelectedFiles(new Set());
    setIsLoading(true);

    const results = {};
    const CONCURRENT_UPLOADS = 3; // Process 3 images at a time

    for (let i = 0; i < acceptedFiles.length; i += CONCURRENT_UPLOADS) {
      const chunk = acceptedFiles.slice(i, i + CONCURRENT_UPLOADS);
      
      const analysisPromises = chunk.map(async (file) => {
        // Set initial status for this file
        setAnalysisResults(prev => ({...prev, [file.name]: { status: 'processing' }}));

        try {
          const resizedFile = await resizeImage(file);
          const formData = new FormData();
          formData.append('file', resizedFile);
          
          const response = await fetch('https://image-tagger-app.onrender.com/api/analyze', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Server returned an error');
          
          const data = await response.json();
          // Update state with successful result for this file
          setAnalysisResults(prev => ({...prev, [file.name]: { status: 'complete', ...data }}));

        } catch (error) {
          // Update state with error for this file
          setAnalysisResults(prev => ({...prev, [file.name]: { status: 'error', error: error.message }}));
        }
      });
      await Promise.all(analysisPromises);
    }
    setIsLoading(false);
  };
  
  // ... (handleSelectImage and handleConfirmGroup functions remain the same)

  return (
    <div className="App">
      <div className="main-container">
        {/* ... (header and uploader remain the same) ... */}

        {isLoading && <p className="loading-text">Analyzing Images... Please Wait.</p>}

        {files.length > 0 && (
          <div className="results-container">
            <h3>Step 2: Select Images for a Group</h3>
            <ImageGrid 
              files={files} 
              analysisResults={analysisResults} 
              onSelectImage={handleSelectImage}
              selectedFiles={selectedFiles}
            />
          </div>
        )}

        {selectedFiles.size > 0 && (
          <div className="form-container">
            <GroupForm onConfirmGroup={handleConfirmGroup} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;