"use client";

import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import type { ButtonProps } from "primereact/button";
import { Column } from "primereact/column";
import type { File } from "../types";

export default function FileTable({
  files,
  onAnalyze,
  onMove,
  selectedFiles,
  setSelectedFiles,
}: {
  files: File[];
  onAnalyze: (file: File) => void;
  onMove: (file: File) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}) {
  const fileInfoCellTemplate = (file: File) => {
    return (
      <div className="flex flex-col justify-around">
        <div>{file.name}</div>
        {file.status === "pending" && (
          <div className="text-xs text-gray-400">Pending...</div>
        )}
        {file.status === "analyzing" && (
          <div className="text-xs text-blue-600">Analyzing...</div>
        )}
        {file.status === "analyzed" && (
          <div className="text-xs">
            <span className="text-green-600 mr-1">⇒</span>
            <span className="text-gray-500">{file.destination}</span>
          </div>
        )}
        {file.status === "failed" && (
          <div className="text-xs text-red-700">
            Unable to analyze this file.
          </div>
        )}
      </div>
    );
  };
  const actionCellTemplate = (file: File) => {
    let actionButtonType: ButtonProps["severity"] = undefined;
    if (file.status === "failed") {
      actionButtonType = "warning";
    } else if (file.status === "pending") {
      actionButtonType = "secondary";
    }
    return (
      <>
        <Button
          loading={file.status === "analyzing" || file.status === "pending"}
          icon={
            file.status === "analyzed" || file.status === "failed"
              ? "pi pi-refresh"
              : "pi pi-send"
          }
          size="small"
          outlined
          severity={actionButtonType}
          title="Analyze this file"
          onClick={() => onAnalyze(file)}
        />
        {file.status === "analyzed" && (
          <Button
            icon="pi pi-file-export"
            severity="success"
            size="small"
            outlined
            className="ml-1"
            title="Move this file to its destination"
            onClick={() => onMove(file)}
          />
        )}
      </>
    );
  };
  return (
    <DataTable
      value={files}
      selectionMode="checkbox"
      selection={selectedFiles}
      onSelectionChange={(e) => {
        const value = e.value as File[];
        setSelectedFiles(value);
      }}
      dataKey="id"
      tableStyle={{ minWidth: "50rem" }}
    >
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>

      <Column header="File" body={fileInfoCellTemplate}></Column>
      <Column
        headerStyle={{ width: "8rem" }}
        header="Action"
        body={actionCellTemplate}
      ></Column>
    </DataTable>
  );
}
