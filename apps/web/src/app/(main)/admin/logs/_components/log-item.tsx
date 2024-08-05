import React from "react";

import { Log, User } from "@sacred-craft/valhalla-database";

export const LogItem = ({ log }: { log: Log & { operators: User[] } }) => {
  switch ((log.action as { type: string }).type) {
    case "REPLACE":
      return <Replace log={log} />;
    case "COPY":
      return <COPY log={log} />;
    case "DELETE":
      return <DELETE log={log} />;
    case "WRITE":
      return <Write log={log} />;
    case "RENAME":
      return <Rename log={log} />;
    case "CREATE":
      return <Create log={log} />;
    case "MOVE_TO_TRASH":
      return <MoveToTrash log={log} />;
    case "RESTORE_FROM_TRASH":
      return <RestoreFromTrash log={log} />;
    case "DELETE_FROM_TRASH":
      return <DeleteFromTrash log={log} />;
    case "RESTORE_ALL_FROM_TRASH":
      return <RestoreAllFromTrash />;
    case "DELETE_ALL_FROM_TRASH":
      return <DeleteAllFromTrash />;
  }
  return <span>Unknown action</span>;
};

const Replace = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "REPLACE";
    resource: string;
    source: string[];
    destination: string[];
  };

  return (
    <>
      <span> replaced </span>
      <span>{action.resource}</span>
      <span> from </span>
      <span>{action.source.join("/")}</span>
      <span> to </span>
      <span>{action.destination.join("/")}</span>
    </>
  );
};

const COPY = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "COPY";
    resource: string;
    source: string[];
    destination: string[];
    cut?: boolean;
  };

  return (
    <>
      {action.cut ? <span> cut </span> : <span> copied </span>}
      <span>{action.resource}</span>
      <span> from </span>
      <span>{action.source.join("/")}</span>
      <span> to </span>
      <span>{action.destination.join("/")}</span>
    </>
  );
};

const DELETE = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "DELETE";
    resource: string;
    path: string[];
  };

  return (
    <>
      <span> deleted </span>
      <span>{action.resource}</span>
      <span> at </span>
      <span>{action.path.join("/")}</span>
    </>
  );
};

const Write = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "WRITE";
    resource: string;
    path: string[];
    version: string;
    comment?: string;
  };

  return (
    <>
      <span> wrote </span>
      <span>{action.resource}</span>
      <span> at </span>
      <span>{action.path.join("/")}</span>
      <span> to </span>
      <span>{action.version}</span>
      {action.comment && (
        <>
          <span> with comment </span>
          <span>{action.comment}</span>
        </>
      )}
    </>
  );
};

const Rename = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "RENAME";
    resource: string;
    oldPath: string[];
    newPath: string[];
  };

  return (
    <>
      <span> renamed </span>
      <span>{action.resource}</span>
      <span> from </span>
      <span>{action.oldPath.join("/")}</span>
      <span> to </span>
      <span>{action.newPath.join("/")}</span>
    </>
  );
};

const Create = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "CREATE";
    resource: string;
    isDir: boolean;
    path: string[];
  };

  return (
    <>
      <span> created </span>
      <span>{action.resource}</span>
      <span> at </span>
      <span>{action.path.join("/")}</span>
    </>
  );
};

const MoveToTrash = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "MOVE_TO_TRASH";
    resource: string;
    path: string[];
    originName: string;
    trashName: string;
  };

  return (
    <>
      <span> moved </span>
      <span>{action.resource}</span>
      <span> from </span>
      <span>{action.path.join("/")}</span>
      <span> to trash </span>
    </>
  );
};

const RestoreFromTrash = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "RESTORE_FROM_TRASH";
    resource: string;
    path: string[];
    originName: string;
    trashName: string;
  };

  return (
    <>
      <span> restored </span>
      <span>{action.resource}</span>
      <span> from trash </span>
    </>
  );
};

const DeleteFromTrash = ({ log }: { log: Log & { operators: User[] } }) => {
  const action = log.action as {
    type: "DELETE_FROM_TRASH";
    resource: string;
    path: string[];
    originName: string;
    trashName: string;
  };

  return (
    <>
      <span> deleted </span>
      <span>{action.resource}</span>
      <span> from trash </span>
    </>
  );
};

const RestoreAllFromTrash = () => {
  return <span> restored all from trash </span>;
};

const DeleteAllFromTrash = () => {
  return <span> deleted all from trash </span>;
};
