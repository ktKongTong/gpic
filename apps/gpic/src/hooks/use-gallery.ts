import {useEffect, useState} from "react";
const imageExamples = [
  { id: 1, url: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9', description: 'Beautiful Landscape 1', style: 'Enhanced' },
  { id: 2, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b', description: 'Beautiful Landscape 2', style: 'Vibrant' },
  { id: 3, url: 'https://images.unsplash.com/photo-1606787620819-8bdf0c44c293', description: 'Beautiful Landscape 3', style: 'Dramatic' },
  { id: 4, url: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead', description: 'Beautiful Landscape 4', style: 'Moody' },
  // https://images.unsplash.com/photo-1526315801902-249a3d75fa6c
  // { id: 5, url: 'https://images.unsplash.com/photo-1526315801902-249a3d75fa6c', description: 'Beautiful Landscape 5', style: 'Cinematic' },
  { id: 6, url: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4', description: 'Beautiful Landscape 6', style: 'Retro' },
  { id: 8,
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    description: 'Beautiful Landscape 8',
    style: 'Smooth',
    originImageURL: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'
  },
];

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