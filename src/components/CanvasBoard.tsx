import { useState } from 'react'
import FileUploader from './FileUploader'
import CanvasRenderer from './CanvasRenderer'

const CanvasBoard = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <FileUploader onFileUpload={setFile} />
      <CanvasRenderer file={file} />
    </>
  )
}

export default CanvasBoard