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
  const actionCellTemplate = (file: File) => {
    return (
      <Button
        loading={file.status === "analyzing"}
        icon={file.status === "analyzed" ? "pi pi-refresh" : "pi pi-send"}
        size="small"
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

      <Column field="name" header="Name"></Column>
      <Column field="destination" header="Destination"></Column>
      <Column header="Action" body={actionCellTemplate}></Column>
    </DataTable>
  );
}
