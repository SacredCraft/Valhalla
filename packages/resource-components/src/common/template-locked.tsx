import { useResourceFileContext } from "../essential/providers";

export const TemplateLocked = () => {
  const { template } = useResourceFileContext();

  return (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center backdrop-blur-sm">
      <div className="text-2xl">
        <span className="font-bold">{template.name}</span> has been locked
      </div>
    </div>
  );
};
