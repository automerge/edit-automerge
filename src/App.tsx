import { isValidAutomergeUrl } from "@automerge/react";
import { useHash } from "./useHash";
import { Editor } from "./Editor";

function App() {
  const locationHash = useHash();

  const docUrl = `${locationHash.substring(1)}`;

  if (isValidAutomergeUrl(docUrl)) {
    return <Editor docUrl={docUrl} />;
  } else {
    return <p>Invalid URL: {docUrl}</p>;
  }
}

export default App;
