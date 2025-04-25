import { useNoteStore } from '@/stores/useNoteStore';

const FileUploader = () => {
  const { setFile } = useNoteStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  return (
    <input
      type="file"
      accept=".pdf, image/*"
      onChange={handleChange}
      className="p-4"
    />
  )
}

export default FileUploader