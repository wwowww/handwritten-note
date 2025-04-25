interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader = ({ onFileUpload }: FileUploaderProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileUpload(file);
  }

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