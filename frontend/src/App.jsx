import React, { useRef, useState } from 'react';
import './App.css';

const initialValues = {
  name: '',
  message: '',
};

const validateForm = ({ name, message, file }) => {
  const errors = {};
  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName) {
    errors.name = 'Name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!trimmedMessage) {
    errors.message = 'Message is required.';
  } else if (trimmedMessage.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  if (!file) {
    errors.file = 'Select a file to upload.';
  }

  return errors;
};

function App() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState(initialValues);
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file || null);
    setErrors((prev) => ({ ...prev, file: undefined }));
  };

  const handleFileChange = (e) => {
    handleFileSelect(e.target.files?.[0] || null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateForm({ ...formData, file: selectedFile });

    setErrors(nextErrors);
    setRequestError(null);
    setResponse(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('message', formData.message.trim());
    payload.append('file', selectedFile);

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/submit', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || {});
        setRequestError(data.message || 'Unable to submit the form.');
        return;
      }

      setResponse(data);
      setFormData(initialValues);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">TalentDesk tech test</p>
        <h1>Collect a polished message and file upload in one pass.</h1>
        <p className="hero-copy">
          The form validates input before submit, supports drag-and-drop uploads,
          and shows the stored file path returned by the backend.
        </p>
      </section>

      <section className="card">
        <form className="submission-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ada Lovelace"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Share the purpose of this upload."
              rows="5"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            <div className="field-hint">
              Minimum 10 characters. Keep it concise and specific.
            </div>
            {errors.message && <p id="message-error" className="field-error">{errors.message}</p>}
          </div>

          <div className="field-group">
            <span className="field-label">Attachment</span>
            <button
              type="button"
              className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                className="sr-only"
                type="file"
                name="file"
                onChange={handleFileChange}
              />
              <span className="dropzone-title">Drop a file here</span>
              <span className="dropzone-copy">or click to browse from your device</span>
              {selectedFile && (
                <span className="file-pill">
                  {selectedFile.name}
                  {' '}
                  ·
                  {Math.ceil(selectedFile.size / 1024)}
                  {' '}
                  KB
                </span>
              )}
            </button>
            {errors.file && <p className="field-error">{errors.file}</p>}
          </div>

          {requestError && <p className="request-error">{requestError}</p>}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit form'}
          </button>
        </form>

        {response && (
          <aside className="response-panel" aria-live="polite">
            <p className="eyebrow">Submission saved</p>
            <h2>{response.name}</h2>
            <p>{response.message}</p>
            <dl>
              <div>
                <dt>Original file</dt>
                <dd>{response.file.originalName}</dd>
              </div>
              <div>
                <dt>Stored path</dt>
                <dd>{response.file.path}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{response.file.type}</dd>
              </div>
            </dl>
          </aside>
        )}
      </section>
    </main>
  );
}

export default App;
