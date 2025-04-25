import { useState } from 'react'
import FileUploader from './FileUploader'
import CanvasRenderer from './CanvasRenderer'

const CanvasBoard = () => {
  return (
    <>
      <FileUploader />
      <CanvasRenderer />
    </>
  )
}

export default CanvasBoard