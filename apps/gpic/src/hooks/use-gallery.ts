import {useEffect, useState} from "react";

type Image = {
  id: number,
  url: string,
  description?: string,
  style?: string,
  originImageURL?: string,
}

export const useGallery = () => {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  return {
    loading,
    error,
    images
  }
}