"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Tooltip } from "primereact/tooltip";

import FileTable from "./FileTable";
import DestinationList from "./DestinationList";

import type { File } from "../types";

interface CustomWindow extends Window {
  __FILE_ORGANIZER__?: {
    API_LIST_DIR: string;
    WS_URL: string;
  };
}
declare const window: CustomWindow;

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
  const [files, setFiles] = useState<File[]>([]);
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
  const onAnalyze = (file: File) => {
    file.status = "analyzing";
    setFiles([...files]);
    postData(API_ANALYZE_FILE, {
      file: file.name,
      dir: path,
      destinations,
    }).then((data) => {
      if (data.destination != null) {
        file.destination = data.destination;
        file.status = "analyzed";
      } else {
        file.status = "failed";
      }
    }).catch((err) => {
      file.destination = undefined;
      file.status = "failed";
    }).finally(() => {
      setFiles([...files]);
    });
  };
  return (
    <div className="flex justify-items-stretch">
      <Tooltip target=".-app-tooltip" showDelay={500} />
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
        <FileTable
          files={files}
          onAnalyze={onAnalyze}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </div>
      <div className="pl-4 w-96 flex-none">
        <h2 className="font-semibold text-xl pb-2">Settings</h2>
        <Panel header="Destinations">
          <DestinationList destinations={destinations} setDestinations={setDestinations} />
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
