import { isValidAutomergeUrl } from "@automerge/react";
import { useState } from "react";
import { useHash } from "./useHash";
import { Editor } from "./Editor";
import { DocumentUrlInput } from "./DocumentUrlInput";

function App() {
  const [locationHash, setLocationHash] = useHash();
  const [showUrlInput, setShowUrlInput] = useState(false);

  const docUrl = locationHash.substring(1);
  const hasValidUrl = docUrl && isValidAutomergeUrl(docUrl);
  const hasInvalidUrl = docUrl.length > 0 && !isValidAutomergeUrl(docUrl);

  const handleUrlSubmit = (url: string) => {
    setLocationHash(`#${url}`);
    setShowUrlInput(false);
  };

  const handleShowUrlInput = () => {
    setShowUrlInput(true);
  };

  const handleCancelUrlInput = () => {
    setShowUrlInput(false);
  };

  // Show URL input if:
  // 1. No URL in hash at all
  // 2. Invalid URL in hash
  // 3. User clicked to change URL
  if (!docUrl || hasInvalidUrl || showUrlInput) {
    return (
      <DocumentUrlInput
        initialUrl={hasInvalidUrl ? docUrl : ""}
        showError={hasInvalidUrl}
        errorMessage="The URL in the address bar is not a valid Automerge URL"
        onUrlSubmit={handleUrlSubmit}
        onCancel={hasValidUrl ? handleCancelUrlInput : undefined}
      />
    );
  }

  // Show editor for valid URLs
  if (hasValidUrl) {
    return <Editor docUrl={docUrl} onChangeUrl={handleShowUrlInput} />;
  }

  return null;
}

export default App;
