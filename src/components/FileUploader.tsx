import { useRef } from 'react';
import { useNoteStore } from '@/stores/useNoteStore';

const FileUploader = () => {
  const { setFile } = useNoteStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = 'file-uploader-input';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="inline-flex items-center p-2 focus:outline-none cursor-pointer"
      >
        <img src='/upload-file.png' alt="파일 올리기" className='w-5' />
      </label>
      <input
        type="file"
        accept=".pdf, image/*"
        onChange={handleChange}
        className="opacity-0 absolute w-0 h-0"
        id={inputId}
        ref={fileInputRef}
      />
    </div >
  );
};

export default FileUploader;