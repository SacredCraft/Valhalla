import { Editor } from "./_components/editor";

export default async function RawPage() {
  return (
    <div>
      <Editor defaultLanguage="yaml" />
    </div>
  );
}
