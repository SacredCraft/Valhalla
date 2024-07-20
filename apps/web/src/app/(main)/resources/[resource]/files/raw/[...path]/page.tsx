import { Editor } from "./_components/editor";

export default async function RawPage() {
  return (
    <div className="">
      <Editor defaultLanguage="yaml" />
    </div>
  );
}
