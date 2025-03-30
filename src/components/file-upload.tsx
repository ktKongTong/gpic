import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UploadCloud, ImagePlus, Sparkles, Loader2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {motion} from 'motion/react';
const useImageUpload = (onImageSelect: (image: File | null) => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const onDrop = useCallback(
      (acceptedFiles: File[]) => {
          if (acceptedFiles?.length) {
              onImageSelect(acceptedFiles[0]);
              const reader = new FileReader();
              // read as base64
              reader.onload = (event) => {
                  setImage(event.target?.result as string);
              };
              reader.readAsDataURL(acceptedFiles[0]);
          } else {
              onImageSelect(null);
              setImage(null);
          }
          setIsDragging(false);
      },
      [onImageSelect]
  );

  const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
      },
      onDragEnter: () => setIsDragging(true),
      onDragLeave: () => setIsDragging(false),
  });

  const handleUploadClick = () => {
      fileInputRef.current?.click();
  };

  const removeImage = () => {
      onImageSelect(null);
      setImage(null);
  };

  return {
      image,
      getRootProps,
      getInputProps,
      handleUploadClick,
      isDragging,
      fileInputRef,
      removeImage
  };
};

export const ImageUpload = ({ onImageSelect, image }: {
   onImageSelect: (image: File | null) => void, image: File | null }) => {
  const {
      getRootProps,
      getInputProps,
      handleUploadClick,
      isDragging,
      fileInputRef,
      image: imgSrc,
      removeImage
  } = useImageUpload(onImageSelect);

  return (
      <div
          {...getRootProps()}
          className={cn(
              "flex flex-col items-center justify-center w-full",
              "border-2 border-dashed border-gray-700 rounded-xl",
              "cursor-pointer transition-colors duration-300",
              "hover:border-gray-600 bg-black/20",
              isDragging && "border-purple-500/80 bg-gradient-to-br from-black/20 to-transparent", // Apply style when dragging
          )}
      >
          <input {...getInputProps()} ref={fileInputRef} className="hidden" />
          <div className="text-center py-12">
              {imgSrc ? (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                  >
                      <img
                          src={imgSrc}
                          alt="Uploaded"
                          className="max-w-full h-auto rounded-lg border border-white/10 shadow-lg"
                          style={{ maxHeight: '200px', objectFit: 'contain' }}
                      />
                      <Button
                          variant="ghost"
                          onClick={() => removeImage()}
                          className="absolute top-1 right-1 bg-black/50 text-white hover:bg-black/70 rounded-full"
                      >
                          <X className="w-4 h-4" />
                      </Button>
                  </motion.div>
              ) : (
                  <>
                      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg text-gray-300">
                          点击上传或拖拽图片到此处
                      </p>
                  </>
              )}
              {!image && (
                  <Button
                      variant="outline"
                      onClick={handleUploadClick}
                      className="mt-4"
                  >
                      选择文件
                  </Button>
              )}
          </div>
      </div>
  );
};
