import React, { createContext, useContext, useState, useEffect } from "react";
import { documentsClient } from "@dynatrace-sdk/client-document";
import {
  ToastContainer,
  ToastOptions,
  showToast,
} from '@dynatrace/strato-components-preview/notifications';
import { Text } from '@dynatrace/strato-components';

interface DocContextType {
  docContent: any[];
  docData: any;
  setDocContent: React.Dispatch<React.SetStateAction<any[]>>;
  updateDocContent: () => Promise<void>;
}

const DocContext = createContext<DocContextType | undefined>(undefined);

export const DocProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [docContent, setDocContent] = useState<any[]>([]);
  const [docData, setDocData] = useState<any>();

  console.log(docData)

  const fetchAndLoadDocContent = async () => {
    try {
      const docs = await documentsClient.listDocuments({ filter: `type == 'SuccessCriteriaList'` });

      let doc = docs.documents.find(
        (doc) => doc.name === "SuccessCriteria" && doc.type === "SuccessCriteriaList"
      );

      if (!doc) {
        const createdDoc = await documentsClient.createDocument({
          body: {
            name: "SuccessCriteria",
            type: "SuccessCriteriaList",
            content: new Blob([JSON.stringify([])], {
              type: "application/json",
            }),
          },
        });
        doc = createdDoc;
      }

      setDocData(doc);
      const contentResponse = await documentsClient.downloadDocumentContent({ id: doc.id });
      if (contentResponse) {
        const content = await contentResponse.get("json");

        // Sort content by cycle and then run
        const sortedContent = content.sort((a, b) => {
          // Compare cycles
          if (a.cycle < b.cycle) return -1;
          if (a.cycle > b.cycle) return 1;

          // Compare runs (secondary sorting)
          if (a.run < b.run) return -1;
          if (a.run > b.run) return 1;

          return 0;
        });

        setDocContent(sortedContent);
      }

      
    } catch (error) {
      console.error("Error fetching or creating document content:", error);
    }
  };

  const updateDocContent = async () => {
    try {
      await documentsClient.updateDocumentContent({
        id: docData.id,
        optimisticLockingVersion: docData.version,
        body: {
          content: new Blob([JSON.stringify(docContent)], { type: "application/json" }),
        },
      });
      showToast({
        title: 'Successfully Updated',
        type: 'success',
        message: (
          <Text>
            The Latest Criteria List has been updated
          </Text>
        ),
      })
      await fetchAndLoadDocContent(); // Reload the latest data
    } catch (error) {
      console.error("Error updating document content:", error);
    }
  };

  useEffect(() => {
    fetchAndLoadDocContent();
  }, []);

  return (
    <DocContext.Provider value={{ docContent, docData, setDocContent, updateDocContent }}>
      {children}
    </DocContext.Provider>
  );
};

export const useDocContext = (): DocContextType => {
  const context = useContext(DocContext);
  if (!context) {
    throw new Error("useDocContext must be used within a DocProvider");
  }
  return context;
};

