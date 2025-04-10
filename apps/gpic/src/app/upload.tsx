'use client'
import React, { useState, useRef } from 'react';
import {Upload, UploadCloud, Image as ImageIcon, Delete, X, LoaderCircle} from 'lucide-react';
import { toast } from 'sonner';
import {UploadFile, useFiles} from "@/hooks/use-file-upload";
import { useTrans } from "@/i18n";
import {cn} from "@/lib/utils";

interface FileUploaderProps {
}

export const ImagePreview = ({file}: {file: UploadFile}) => {
  const { uploadFile, removeFile } = useFiles()
  return <div className={'h-20 w-20 rounded-lg relative'} onClick={(e) => {e.stopPropagation()}}>
    {
      (file.preview || file.url) ? <img
        src={file.preview || file.url}
        alt="Preview"
        className="h-20 w-20 object-contain bg-white/80 rounded-lg"
      /> : (
        <div className={'max-h-full max-w-full object-contain rounded-lg bg-black/70'}></div>
      )
    }
    {
      file.state === 'UPLOADING' && <div className={'absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center'}>
            <LoaderCircle className={'w-6 h-6 animate-spin'}/>
        </div>
    }
    <X className={'absolute right-1 top-1 w-5 h-5 p-1 bg-black/40 rounded-full'}  onClick={() => { removeFile(file) }}/>
  </div>
}


export const useFileUploader = () => {
  const {files, uploadFile, removeFile} = useFiles()
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFile(e.target.files);
    }
  };

  const handleFile = (newFiles: FileList) => {
    let filesList = [] as File[]
    for (const newFile of newFiles) {
      if(newFile) filesList.push(newFile);
    }
    if(files.length > 100) {
      toast.error('maximum size is 100');
      return;
    }
    for (const file of filesList.slice(0, 100-files.length)) {
      if (!file.type.match('image.*')) {
        toast('Please select an image file');
        return;
      }
      uploadFile(file)
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return {
    triggerFileInput,
    handleFileInput,
    handleDrop,
    handleDragLeave,
    handleDragOver,
    isDragging,
    fileInputRef
  }
}

const FileUploader: React.FC<FileUploaderProps> = () => {

  const {t, locale} = useTrans()

  const {files, uploadFile, removeFile} = useFiles()
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFile(e.target.files);
    }
  };

  const handleFile = (newFiles: FileList) => {
    let filesList = [] as File[]
    for (const newFile of newFiles) {
      if(newFile) filesList.push(newFile);
    }
    if(files.length > 100) {
      toast.error('maximum size is 100');
      return;
    }
    for (const file of filesList.slice(0, 100-files.length)) {
      if (!file.type.match('image.*')) {
        toast('Please select an image file');
        return;
      }
      uploadFile(file)
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
      <div
        className={
        cn(`drop-zone ${isDragging ? 'border-primary bg-white/5' : ''} flex flex-col justify-center items-center cursor-pointer`,
          'w-full backdrop-blur-md bg-card/40 max-h-96 overflow-y-auto bg-blend-soft-light min-h-60 h-auto rounded-lg border-dashed border-white border'
          )
      }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        {
          files.length > 0 ? (
          <div className={'flex flex-wrap gap-2 justify-center items-center p-2'}>
            {
              files.map((file) => (
                <div className=" overflow-hidden" key={file.id}>
                  <ImagePreview file={file}/>
                </div>
              ))
            }
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <UploadCloud className="h-8 w-8 text-white/70" />
            </div>
            <p className="text-white/70 text-center px-4">
              {t('components.uploader.tip')}
            </p>
          </>
        )}
        <input
          type='file'
          multiple={true}
          className="hidden"
          onChange={handleFileInput}
          accept="image/*"
          ref={fileInputRef}
        />
      </div>
  );
};

export default FileUploader;
