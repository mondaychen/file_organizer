"use client";
import { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import type { File } from "../types";

export default function FileTable({
  files,
  onAnalyze,
  selectedFiles,
  setSelectedFiles,
}: {
  files: File[];
  onAnalyze: (file: File) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}) {
  const fileInfoCellTemplate = (file: File) => {
    return (
      <div className="flex flex-col justify-around">
        <div>{file.name}</div>
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
          <div className="text-xs text-red-700">Unable to analyze this file.</div>
        )}
      </div>
    );
  };
  const actionCellTemplate = (file: File) => {
    return (
      <Button
        loading={file.status === "analyzing"}
        icon={file.status === "analyzed" || file.status === 'failed' ? "pi pi-refresh" : "pi pi-send"}
        size="small"
        outlined
        severity={file.status === "analyzed" ? "success" : undefined}
        onClick={() => onAnalyze(file)}
      />
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
      <Column header="Action" body={actionCellTemplate}></Column>
    </DataTable>
  );
}
