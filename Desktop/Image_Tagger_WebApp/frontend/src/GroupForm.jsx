import React, { useState } from 'react';

function GroupForm({ onConfirmGroup }) {
  const [language, setLanguage] = useState('Hindi');
  const [imageGrouping, setImageGrouping] = useState('');
  const [imageQuality, setImageQuality] = useState('High');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!imageGrouping) {
      alert('Please enter an Image Grouping number.');
      return;
    }
    onConfirmGroup({ language, imageGrouping, imageQuality });
  };

  return (
    <form className="group-form" onSubmit={handleSubmit}>
      <h3>Finalize Group Metadata</h3>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option>Hindi</option>
            <option>English</option>
            <option>Japanese</option>
            <option>French</option>
            <option>Spanish</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="grouping">Image Grouping</label>
          <input 
            type="text" 
            id="grouping" 
            placeholder="e.g., 1" 
            value={imageGrouping}
            onChange={(e) => setImageGrouping(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quality">Image Quality</label>
          <select id="quality" value={imageQuality} onChange={(e) => setImageQuality(e.target.value)}>
            <option>High</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      <button type="submit" className="confirm-button">Confirm Group</button>
    </form>
  );
}

export default GroupForm;