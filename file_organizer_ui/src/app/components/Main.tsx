"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import { Tooltip } from "primereact/tooltip";

interface CustomWindow extends Window {
  __FILE_ORGANIZER__?: {
    API_LIST_DIR: string;
    WS_URL: string;
  };
}
declare const window: CustomWindow;

interface File {
  id: string;
  name: string;
  status: "ready" | "failed" | "analyzing" | "analyzed" | null;
  destination?: string;
}

let API_LIST_DIR = "http://127.0.0.1:5000/listdir";
let API_ANALYZE_FILE = "http://127.0.0.1:5000/analyze";
let WS_URL = "ws://localhost:8080/ws";

if (typeof window !== "undefined") {
  API_LIST_DIR = window.__FILE_ORGANIZER__?.API_LIST_DIR || API_LIST_DIR;
  WS_URL = window.__FILE_ORGANIZER__?.WS_URL || WS_URL;
}

async function postData(url: string, data = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // Recommendation: handle errors
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const DEFAULT_DESTINATIONS = [
  "~/Downloads/software/games",
  "~/Downloads/software",
  "~/Downloads/pictures",
  "~/Downloads/other",
  "~/Documents/work",
  "~/Documents/personal",
  "~/Documents/personal/family",
  "~/Documents/personal/legal",
  "~/Documents/personal/tax",
];

export default function Main() {
  const [path, setPath] = useState<string>("~/Downloads");
  const [currentDir, setCurrentDir] = useState<string | null>(null);
  const [files, setFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [destinations, setDestinations] =
    useState<string[]>(DEFAULT_DESTINATIONS);
  const [newDes, setNewDes] = useState<string>("");
  const onShowFiles = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    postData(API_LIST_DIR, { dir: path }).then((data) => {
      setCurrentDir(path);
      setSelectedFiles([]);
      setFiles(data.map((name: string) => ({ id: name, name })));
    });
  };
  const onAddDestination = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDestinations([...destinations, newDes]);
    setNewDes("");
  };
  const onAnalyse = (file: File) => {
    file.status = "analyzing";
    setFiles([...files]);
    postData(API_ANALYZE_FILE, {
      file: file.name,
      dir: path,
      destinations,
    }).then((data) => {
      file.destination = data.destination;
      file.status = "analyzed";
      setFiles([...files]);
    });
  };
  const actionCellTemplate = (file: File) => {
    return (
      <Button
        loading={file.status === "analyzing"}
        icon={file.status === 'analyzed' ? 'pi pi-refresh' : "pi pi-send"}
        size="small"
        severity={file.status === 'analyzed' ? "success" : undefined}
        onClick={() => onAnalyse(file)}
      />
    );
  };
  return (
    <div className="flex justify-items-stretch">
      <div className="flex-1">
        <div className="mb-2 flex justify-items-stretch">
          <form className="grow basis-0" onSubmit={onShowFiles}>
            <InputText
              className="w-64"
              placeholder="Path to a messy directory"
              value={path}
              onChange={(e) => setPath(e.target.value)}
            />
            <Button
              icon={currentDir === path ? "pi pi-refresh" : "pi pi-folder-open"}
              className="ml-2"
              label={currentDir === path ? "Refresh" : "Show Files"}
            />
          </form>
          <div>
            <Button
              label={`Analyze (${selectedFiles.length})`}
              disabled={selectedFiles.length === 0}
            />
          </div>
        </div>
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
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>

          <Column field="name" header="Name"></Column>
          <Column field="destination" header="Destination"></Column>
          <Column header="Action" body={actionCellTemplate}></Column>
        </DataTable>
      </div>
      <div className="pl-4 w-96 flex-none">
        <h2 className="font-semibold text-xl pb-2">Settings</h2>
        <Panel header="Destinations">
          <Tooltip target=".-app-tooltip" showDelay={500} />
          <ul className="">
            {destinations.map((dest) => (
              <li className="mb-2 pb-2 border-b-2" key={dest}>
                <div className="flex justify-between">
                  <div
                    className="truncate leading-10 -app-tooltip"
                    data-pr-tooltip={dest}
                    data-pr-position="left"
                  >
                    {dest}
                  </div>
                  <Button
                    icon="pi pi-trash"
                    size="small"
                    className="ml-2"
                    onClick={() =>
                      setDestinations(destinations.filter((d) => d !== dest))
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
          <form className="mb-2 flex" onSubmit={onAddDestination}>
            <InputText
              className="grow mr-2"
              placeholder="Add a new destination"
              value={newDes}
              onChange={(e) => setNewDes(e.target.value)}
            />
            <Button label="Add" />
          </form>
        </Panel>
      </div>
    </div>
  );
}
