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
import {toast} from "sonner";
import {api} from "@/lib/api";
import {useMutation} from "@tanstack/react-query";
type FileUploaderContext = {
  files: UploadFile[],
  uploadFile: (f:File)=>Promise<void> | void,
  removeFile: (f:UploadFile) => void,
  removeAll: () => void
}

const fileCtx = createContext<FileUploaderContext>({
  files: [],
  uploadFile: async (f) => {},
  removeFile: f => {},
  removeAll: () => {},
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
  const removeAll = () => {
    setFiles([])
  }
  return {
    upsertFile,
    removeFile,
    getFileById,
    removeAll,
    files
  }
}


function readAsDataURL(file: File) {
  return new Promise((resolve, reject)=>{
    let fileReader = new FileReader();
    fileReader.onload = function(){
      return resolve({data:fileReader.result, name:file.name, size: file.size, type: file.type});
    }
    fileReader.readAsDataURL(file);
  })
}

export const useFileUpload = () => {
  const {mutate} = useMutation({
    mutationKey: ['file-upload'],
    mutationFn: async (f: File) => {
      let file: UploadFile = { id: f.name, file: f, state: "UPLOADING" }
      upsertFile(file)
      const uploadedFile = getFileById(file.id)
      if(uploadedFile && (uploadedFile.state == 'UPLOADED' || uploadedFile.state == 'UPLOADING')) {
        throw new Error('file is already uploading/uploaded')
      }
      const fileUrl = await readAsDataURL(file.file)
      // @ts-ignore
      file.url = fileUrl.data
      upsertFile(file)
      const uploadResult = await api.uploadFile(f)
      file.state = 'UPLOADED'
      file.url = uploadResult.url
      return file
    },
    onError: (e, file) => {
      toast.error('上传失败，请稍后再试', {description: e.message})
      console.error(e)
    },
    onSuccess: async (data) => {
      upsertFile(data)
    }
  })
  const {files, upsertFile, removeFile, getFileById, removeAll} = useFileStore()
  return {
    files,
    uploadFile:mutate,
    removeFile,
    removeAll,
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