import { isValidAutomergeUrl } from "@automerge/react";
import { useState, useEffect } from "react";

interface DocumentUrlInputProps {
  initialUrl?: string;
  showError?: boolean;
  errorMessage?: string;
  onUrlSubmit: (url: string) => void;
  onCancel?: () => void;
}

export const DocumentUrlInput = ({
  initialUrl = "",
  showError = false,
  errorMessage = "Invalid Automerge URL",
  onUrlSubmit,
  onCancel,
}: DocumentUrlInputProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(url.length > 0 && isValidAutomergeUrl(url));
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onUrlSubmit(url);
    }
  };

  return (
    <div className="document-url-input-container">
      <div className="document-url-input-form">
        <h2>Enter Document URL</h2>
        <form onSubmit={handleSubmit}>
          <div className="document-url-input-field">
            <label htmlFor="url-input" className="document-url-input-label">
              Automerge Document URL:
            </label>
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="automerge:..."
              className={`document-url-input ${showError ? "error" : ""}`}
              autoFocus
            />
          </div>

          {showError && (
            <div className="document-url-error">{errorMessage}</div>
          )}

          {url.length > 0 && !isValid && (
            <div className="document-url-warning">
              Please enter a valid Automerge URL
            </div>
          )}

          <div className="document-url-buttons">
            <button
              type="submit"
              disabled={!isValid}
              className="document-url-submit"
            >
              Load Document
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="document-url-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
