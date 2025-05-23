import * as Automerge from "@automerge/automerge";
import { AutomergeUrl, useDocument, useDocHandle } from "@automerge/react";
import ReactJson, { InteractionProps } from "@microlink/react-json-view";
import { useCallback, useState } from "react";
import { useColorScheme } from "./useColorScheme";

export const Editor = ({
  docUrl: originalDocumentUrl,
}: {
  docUrl: AutomergeUrl;
}) => {
  const [documentUrl, changeDocumentUrl] = useState(originalDocumentUrl);
  const [history, setHistory] = useState<AutomergeUrl[]>([]); // TODO: make these actual navigation effects?
  const colorScheme = useColorScheme();

  const [doc, changeDoc] = useDocument<Record<string, unknown>>(documentUrl);
  const handle = useDocHandle(documentUrl);

  // @ts-expect-error "might use it later"
  const _onSelectAutomergeUrl = useCallback(
    (url: AutomergeUrl) => {
      setHistory([documentUrl, ...history]);
      changeDocumentUrl(url);
    },
    [history, setHistory, changeDocumentUrl],
  );

  const onEdit = useCallback(
    ({ namespace, new_value, name }: InteractionProps) => {
      if (!name) {
        throw new Error("invalid path");
        return;
      }
      changeDoc(function (doc) {
        atPath(doc, namespace, (parent) => {
          Reflect.set(parent, name, new_value);
        });
      });
    },
    [changeDoc],
  );

  const onAdd = useCallback(function () {
    return true;
  }, []);

  const onDelete = useCallback(
    function ({ namespace, name }: InteractionProps) {
      if (!name) {
        throw new Error("invalid path");
      }
      changeDoc(function (doc) {
        atPath(doc, namespace, (parent) => {
          Reflect.deleteProperty(parent, name);
        });
      });
    },
    [changeDoc],
  );

  const onSelect = useCallback(function (arg: unknown) {
    console.log("select", arg);
    /*const { value } = arg;
    if (!(typeof value === "string")) {
      return;
    }

    if (isValidAutomergeUrl(value)) {
      onSelectAutomergeUrl(value);
    } else if (isServiceWorkerUrl(value)) {
      onSelectAutomergeUrl(parseServiceWorkerUrl(value));
    }*/
  }, []);

  // lifted from https://gist.github.com/davalapar/d0a5ba7cce4bc599f54800da22926da2
  // @ts-expect-error "might use it later"
  const _onDownloadDoc = useCallback(
    function () {
      if (!doc || !handle) {
        throw new Error("No document or handle found");
      }
      const data = Automerge.save(doc);
      const filename = `${handle.documentId}.automerge`;
      const blobURL = URL.createObjectURL(
        new Blob([data], { type: "application/octet-stream" }),
      );

      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", filename);

      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
      }, 100);
    },
    [doc],
  );

  if (!doc) {
    return <div>Loading {documentUrl}...</div>;
  }

  return (
    <ReactJson
      collapsed={3}
      src={doc}
      onEdit={onEdit}
      onAdd={onAdd}
      onDelete={onDelete}
      onSelect={onSelect}
      theme={colorScheme == "dark" ? "monokai" : "rjv-default"}
    />
  );
};

function atPath<T>(
  obj: unknown,
  path: (string | null)[],
  f: (object: object) => T,
): T {
  let current = obj;

  for (const key of path) {
    if (key === null) {
      throw new Error(`invalid path: ${path}`);
    }
    if (typeof current === "object" && current != null) {
      current = Reflect.get(current, key);
    } else {
      throw new Error(`invalid path: ${path}`);
    }
  }

  if (typeof current === "object" && current != null) {
    return f(current);
  } else {
    throw new Error(`invalid path: ${path}`);
  }
}
