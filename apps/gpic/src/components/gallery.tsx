import React, { useState, useEffect } from 'react';
import GalleryItem from "@/components/gallery-item";
import {useGallery} from "@/hooks/use-gallery";

export interface GalleryImage {
  id: string | number;
  url: string;
  description?: string;
  style?: string;
  prompt?: string;
  originImageURL?: string;
}

const Gallery = () => {
  const { images } = useGallery()
  const [columns, setColumns] = useState<GalleryImage[][]>([[], [], []]);
  useEffect(() => {
    const handleResize = () => {
      const newColumns: GalleryImage[][] = [[], [], []];
      // For mobile, use 1 column
      const columnCount = window.innerWidth < 768 ? 1 : (window.innerWidth < 1024 ? 2 : 2);

      images.forEach((image, index) => {
        newColumns[index % columnCount].push(image);
      });

      setColumns(newColumns.filter(column => column.length > 0));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {columns.map((column, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col">
          {column.map((image) => (
            <GalleryItem key={image.id} image={image} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;