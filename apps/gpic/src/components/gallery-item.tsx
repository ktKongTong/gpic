
import React, { useState } from 'react';
import { SplitSquareVertical } from 'lucide-react';
import { GalleryImage } from './gallery';

interface GalleryItemProps {
  image: GalleryImage;
}

const GalleryItem: React.FC<GalleryItemProps> = ({ image }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const toggleComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowComparison(!showComparison);
  };

  return (
    <div
      className="rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:translate-y-[-4px] bg-card/40 backdrop-blur-sm mb-6"
    >
      <div className="relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="h-8 w-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          </div>
        )}
        {showComparison && image.originImageURL ? (

          <div className={'flex w-full'}>
            <div className="w-1/2 h-full overflow-hidden border-r border-white/20">
              <img
                src={image.originImageURL}
                alt="Before"
                className="w-full object-cover"
                onLoad={handleImageLoad}
                loading="lazy"
              />
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                Before
              </div>
            </div>
            <div className="w-1/2 h-full overflow-hidden">
              <img
                src={image.url}
                alt="After"
                className="w-full object-cover"
                onLoad={handleImageLoad}
                loading="lazy"
              />
              <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                After
              </div>
            </div>
          </div>
        ) : (

          <img
            src={image.url}
            alt={image.description || `Image ${image.id}`}
            className={`w-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 touch-auto hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white w-full">
            <h3 className="text-lg font-medium">{image.description || `Image ${image.id}`}</h3>
            {image.style && (
              <p className="text-sm opacity-80">Style: {image.style}</p>
            )}
            {image.prompt && (
              <p className="text-sm opacity-80 line-clamp-2 mt-1">"{image.prompt}"</p>
            )}

            {image.originImageURL && (
              <button
                onClick={toggleComparison}
                className="mt-2 flex items-center text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
              >
                <SplitSquareVertical className="h-3 w-3 mr-1" />
                {showComparison ? 'Hide Comparison' : 'Show Before/After'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryItem;