"use client";

type FilesTabsProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function TrashTabs({ left, right }: FilesTabsProps) {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex items-center gap-2">{left}</div>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}
