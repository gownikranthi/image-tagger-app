import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 20px',
  borderWidth: 2,
  borderRadius: 8,
  borderColor: '#dee2e6',
  borderStyle: 'dashed',
  backgroundColor: '#f8f9fa',
  color: '#6c757d',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer'
};

const activeStyle = {
  borderColor: '#4B0082' // Indigo
};

const acceptStyle = {
  borderColor: '#28a745', // Green
  backgroundColor: '#f0fff4'
};

const rejectStyle = {
  borderColor: '#dc3545', // Red
  backgroundColor: '#fff0f1'
};


function ImageUploader({ onFilesAccepted }) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {'image/*': ['.heic', '.jpeg', '.png', '.jpg']},
    onDrop: acceptedFiles => {
      onFilesAccepted(acceptedFiles);
    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  return (
    <div {...getRootProps({style})}>
      <input {...getInputProps()} />
      <p>Drag & drop image files here, or click to select files</p>
    </div>
  );
}

export default ImageUploader;