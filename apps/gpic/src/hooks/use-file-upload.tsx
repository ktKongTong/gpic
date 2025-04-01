'use client'
import React, {useState} from "react";

const upload = async (f: File) => {
  const formData = new FormData()
  formData.append('file', f)
  const res = await fetch('/api/file/upload', { method: 'PUT', body: formData })
  const data = await res.json()
  if(!res.ok) {
    throw new Error('Failed to upload file')
  }
  // @ts-ignore
  const fileKey = data.url
  return fileKey as string
}

export type UploadFile = {
  state: 'UPLOADED' | 'LOCAL' | 'UPLOADING',
  id: string,
  preview?: string,
  file: File,
  url?: string
}

import {createContext, useContext} from 'react'
type FileUploaderContext = {
  files: UploadFile[],
  uploadFile: (f:File)=>Promise<void>,
  removeFile: (f:UploadFile) => void
}

const fileCtx = createContext<FileUploaderContext>({
  files: [],
  uploadFile: async (f) => {},
  removeFile: f => {}
})

const useFileStore = () => {
  const [files, setFiles] = useState<UploadFile[]>([])

  const upsertFile = (f: UploadFile) => {
    setFiles((prev: UploadFile[]) => {
      let idx = prev.findIndex((it) => it.id === f.id)
      prev.findIndex((it) => it.id === f.id)
      if (idx > -1) {
        return prev.with(idx, f)
      }else {
        return [...prev, f]
      }
    })
  }

  const removeFile = (f: UploadFile) => {
    setFiles(prev => prev.filter((it) => it.id !== f.id))
  }

  const getFileById = (id: string) => {
    return files.find((f) => f.id === id)
  }

  return {
    upsertFile,
    removeFile,
    getFileById,
    files
  }
}

export const useFileUpload = () => {
  // fileKey

  const {files, upsertFile, removeFile, getFileById} = useFileStore()
  // const upload
  const uploadFile = async (f: File) => {
    let file: UploadFile = { id: f.name, file: f, state: "LOCAL" }
    const uploadedFile = getFileById(file.id)
    if(uploadedFile && (uploadedFile.state == 'UPLOADED' || uploadedFile.state == 'UPLOADING')) {
      return
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        let tmp = getFileById(file.id) || file
        tmp.preview = e.target.result as string
        upsertFile(tmp)
      }
    };
    reader.readAsDataURL(f);
    try {
      upsertFile(file)
      const fileKey = await upload(f)
      file.state = 'UPLOADED'
      file.url = fileKey
    }catch (e) {
      console.error(e)
      file.state = 'LOCAL'
    }finally {
      upsertFile(file)
    }
  }
  return {
    files,
    uploadFile,
    removeFile
  }
}


const FileProvider = fileCtx.Provider

export const FileCtxProvider = ({children}: {children: React.ReactNode}) => {
  const ctx = useFileUpload()

  return <FileProvider value={ctx}>
    {children}
  </FileProvider>
}

export const useFiles = () => {
  return useContext(fileCtx)
}