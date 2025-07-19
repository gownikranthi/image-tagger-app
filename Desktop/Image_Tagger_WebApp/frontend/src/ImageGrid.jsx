import React from 'react';

function ImageCard({ file, result, onSelect, isSelected }) {
  const cardClassName = `image-card ${isSelected ? 'selected' : ''} ${result?.status || ''}`;

  const renderCardContent = () => {
    if (result?.status === 'processing') {
      return <div className="card-status">Processing...</div>;
    }
    if (result?.status === 'error') {
      return <div className="card-status error">Error: Analysis Failed</div>;
    }
    return (
      <div className="card-info">
        <p><strong>Category:</strong> {result.category || 'N/A'}</p>
        <p><strong>Sub-category:</strong> {result.subcategory || 'N/A'}</p>
        <p><strong>Description:</strong> {result.description || 'N/A'}</p>
      </div>
    );
  };

  return (
    <div className={cardClassName} onClick={() => onSelect(file.name)}>
      <img src={URL.createObjectURL(file)} alt={file.name} className="thumbnail" />
      {renderCardContent()}
      <input 
        type="checkbox" 
        checked={isSelected} 
        readOnly 
        className="selection-checkbox"
      />
    </div>
  );
}

function ImageGrid({ files, analysisResults, onSelectImage, selectedFiles }) {
  return (
    <div className="image-grid">
      {files.map((file) => {
        const result = analysisResults[file.name];
        const isSelected = selectedFiles.has(file.name);
        return (
          <ImageCard 
            key={file.name} 
            file={file} 
            result={result} 
            onSelect={onSelectImage}
            isSelected={isSelected}
          />
        );
      })}
    </div>
  );
}

export default ImageGrid;