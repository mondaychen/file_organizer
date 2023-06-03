"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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
}

let API_LIST_DIR = "http://127.0.0.1:5000/listdir";
let WS_URL = "ws://localhost:8080/ws";

if (typeof window !== "undefined") {
  API_LIST_DIR = window.__FILE_ORGANIZER__?.API_LIST_DIR || API_LIST_DIR;
  WS_URL = window.__FILE_ORGANIZER__?.WS_URL || WS_URL;
}

async function getData(url: string, params: Record<string, string> = {}) {
  const res = await fetch(url + "?" + new URLSearchParams(params));
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default function Main() {
  const [path, setPath] = useState<string>("~/Downloads");
  const [files, setFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(API_LIST_DIR, { dir: path }).then((data) => {
      setFiles(data.map((name: string) => ({ id: name, name })));
    });
  };
  return (
    <div className="flex justify-items-stretch">
      <div className="grow">
        <form className="mb-2" onSubmit={onSubmit}>
          <InputText
            className="w-64"
            placeholder="Path to a messy directory"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
          <Button className="ml-2" label="Show Files" />
        </form>
        <DataTable
          value={files}
          selectionMode="checkbox"
          selection={selectedFiles!}
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
        </DataTable>
      </div>
      <div className="flex-none ml-2.5 border-l-2 w-96 border-cyan-800 px-2">
        <form className="mb-2">
          <input
            className="rounded px-4 py-2 w-64 focus:outline-blue-600"
            type="text"
            placeholder="New destination directory"
          />
        </form>
      </div>
    </div>
  );
}
