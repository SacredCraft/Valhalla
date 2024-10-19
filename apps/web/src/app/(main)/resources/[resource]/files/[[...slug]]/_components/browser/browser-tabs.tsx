"use client";

type BrowserTabsProps = {
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function BrowserTabs({ left, right }: BrowserTabsProps) {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <div className="flex gap-2">{left}</div>
      <div className="flex gap-2">{right}</div>
    </div>
  );
}
