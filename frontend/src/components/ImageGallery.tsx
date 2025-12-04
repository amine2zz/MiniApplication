import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: string[];
  canEdit: boolean;
  onImagesChange?: (images: string[]) => void;
  language: 'fr' | 'en';
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  canEdit, 
  onImagesChange,
  language 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedOverIndex, setDraggedOverIndex] = useState<number | null>(null);

  // Debug log for modal state
  console.log('ImageGallery render:', { canEdit, imagesLength: images.length, showModal });

  // Reset selected index when images change
  useEffect(() => {
    if (selectedImageIndex >= images.length && images.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [images.length, selectedImageIndex]);

  const texts = {
    fr: {
      noImages: 'Aucune image disponible',
      addImage: 'Ajouter une image',
      removeImage: 'Supprimer',
      imageUrl: 'URL de l\'image',
      add: 'Ajouter',
      cancel: 'Annuler',
      maxImages: 'Maximum 5 images autorisées',
      invalidUrl: 'URL d\'image invalide',
      viewFullsize: 'Cliquer pour voir en grand',
      chooseFile: 'Choisir un fichier image'
    },
    en: {
      noImages: 'No images available',
      addImage: 'Add image',
      removeImage: 'Remove',
      imageUrl: 'Image URL',
      add: 'Add',
      cancel: 'Cancel',
      maxImages: 'Maximum 5 images allowed',
      invalidUrl: 'Invalid image URL',
      viewFullsize: 'Click to view fullsize',
      chooseFile: 'Choose image file'
    }
  };

  const t = texts[language];

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    
    // Basic URL validation
    try {
      new URL(newImageUrl);
    } catch {
      alert(t.invalidUrl);
      return;
    }

    if (images.length >= 5) {
      alert(t.maxImages);
      return;
    }

    const updatedImages = [...images, newImageUrl.trim()];
    onImagesChange?.(updatedImages);
    setNewImageUrl('');
    setShowModal(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (images.length >= 5) {
      alert(t.maxImages);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Use the server URL instead of blob URL
      const serverUrl = `http://localhost:3001${result.url}`;
      const updatedImages = [...images, serverUrl];
      onImagesChange?.(updatedImages);
      
      // Reset modal state
      setShowModal(false);
      setUploadType('url');
      setNewImageUrl('');
      
      // Reset file input
      event.target.value = '';
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Erreur lors de l\'upload du fichier');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange?.(updatedImages);
    
    // Adjust selected index if necessary
    if (selectedImageIndex >= updatedImages.length && updatedImages.length > 0) {
      setSelectedImageIndex(updatedImages.length - 1);
    } else if (updatedImages.length === 0) {
      setSelectedImageIndex(0);
    } else if (selectedImageIndex > index) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleImageClick = (index: number, event?: React.MouseEvent) => {
    // Don't change selection if we're in the middle of a drag operation
    if (draggedIndex !== null || (event && isDragging)) {
      return;
    }
    setSelectedImageIndex(index);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(false); // Start as not dragging
    setStartX(e.pageX - (e.currentTarget as HTMLElement).offsetLeft);
    setScrollLeft((e.currentTarget as HTMLElement).scrollLeft);
    e.preventDefault();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const x = e.pageX - (e.currentTarget as HTMLElement).offsetLeft;
    const distance = Math.abs(x - startX);
    
    // Only start dragging if mouse moved more than 5px
    if (distance > 5 && !isDragging) {
      setIsDragging(true);
    }
    
    if (!isDragging) return;
    e.preventDefault();
    const walk = (x - startX) * 1.5;
    (e.currentTarget as HTMLElement).scrollLeft = scrollLeft - walk;
  };

  const handleImageDragStart = (e: React.DragEvent, index: number) => {
    if (!canEdit) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    if (!canEdit || draggedIndex === null) return;
    e.preventDefault();
    setDraggedOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDragLeave = () => {
    setDraggedOverIndex(null);
  };

  const handleImageDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!canEdit || draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDraggedOverIndex(null);
      return;
    }

    e.preventDefault();
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Remove dragged image from original position
    newImages.splice(draggedIndex, 1);
    
    // Insert at new position
    const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newImages.splice(insertIndex, 0, draggedImage);
    
    onImagesChange?.(newImages);
    
    // Reset drag state
    setDraggedIndex(null);
    setDraggedOverIndex(null);
    
    // Update selected index if needed
    if (selectedImageIndex === draggedIndex) {
      setSelectedImageIndex(insertIndex);
    } else if (selectedImageIndex > draggedIndex && selectedImageIndex <= insertIndex) {
      setSelectedImageIndex(selectedImageIndex - 1);
    } else if (selectedImageIndex < draggedIndex && selectedImageIndex >= insertIndex) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleImageDragEnd = () => {
    setDraggedIndex(null);
    setDraggedOverIndex(null);
  };

  if (images.length === 0 && !canEdit) {
    return (
      <div className="image-gallery-empty">
        <i className="fas fa-image"></i>
        <p>{t.noImages}</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      {images.length > 0 && (
        <div className="gallery-main">
          <div className="main-image-container">
            <img 
              src={images[selectedImageIndex]} 
              alt="Property" 
              className="main-image"
              title={t.viewFullsize}
            />
            {images.length > 1 && (
              <>
                <button 
                  className="nav-button nav-prev" 
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="nav-button nav-next" 
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}
            <div className="image-counter">
              {selectedImageIndex + 1} / {images.length}
            </div>
            
            {/* Navigation dots */}
            {images.length > 1 && (
              <div className="image-dots">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === selectedImageIndex ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div 
            className="thumbnail-container"
            onMouseDown={canEdit ? undefined : handleMouseDown}
            onMouseLeave={canEdit ? undefined : handleMouseLeave}
            onMouseUp={canEdit ? undefined : handleMouseUp}
            onMouseMove={canEdit ? undefined : handleMouseMove}
            style={{ 
              cursor: canEdit ? 'default' : (isDragging ? 'grabbing' : 'grab'),
              userSelect: isDragging ? 'none' : 'auto'
            }}
          >
            {images.map((image, index) => (
              <div 
                key={`${image}-${index}`} 
                className={`thumbnail ${
                  index === selectedImageIndex ? 'active' : ''
                } ${
                  canEdit && index === draggedIndex ? 'dragging' : ''
                } ${
                  canEdit && index === draggedOverIndex ? 'drag-over' : ''
                }`}
                onClick={(e) => handleImageClick(index, e)}
                draggable={canEdit}
                onDragStart={(e) => handleImageDragStart(e, index)}
                onDragOver={(e) => handleImageDragOver(e, index)}
                onDragLeave={handleImageDragLeave}
                onDrop={(e) => handleImageDrop(e, index)}
                onDragEnd={handleImageDragEnd}
                style={{ cursor: canEdit ? 'move' : 'pointer' }}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.png';
                  }}
                />
                {canEdit && (
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleRemoveImage(index);
                    }}
                    title={t.removeImage}
                    type="button"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {canEdit && images.length < 5 && (
        <div className="add-image-section">
          {images.length === 0 && (
            <div className="no-images-placeholder">
              <i className="fas fa-image"></i>
              <p>{t.noImages}</p>
            </div>
          )}
          <button 
            className="btn btn-secondary add-image-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Add image button clicked', { canEdit, imagesLength: images.length });
              setShowModal(true);
            }}
            type="button"
          >
            <i className="fas fa-plus"></i>
            {t.addImage}
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => {
          console.log('Modal overlay clicked');
          setShowModal(false);
        }}>
          <div className="modal-content" onClick={(e) => {
            e.stopPropagation();
            console.log('Modal content clicked');
          }}>
            <h3>{t.addImage}</h3>
            
            <div className="upload-type-selector">
              <label>
                <input 
                  type="radio" 
                  value="url" 
                  checked={uploadType === 'url'} 
                  onChange={(e) => setUploadType('url')}
                />
                URL
              </label>
              <label>
                <input 
                  type="radio" 
                  value="file" 
                  checked={uploadType === 'file'} 
                  onChange={(e) => setUploadType('file')}
                />
                Upload File
              </label>
            </div>

            {uploadType === 'url' ? (
              <input
                type="url"
                placeholder={t.imageUrl}
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="form-input"
              />
            ) : (
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="image-file-input"
                />
                <label htmlFor="image-file-input" className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{t.chooseFile}</span>
                </label>
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setNewImageUrl('');
                  setUploadType('url');
                }}
              >
                {t.cancel}
              </button>
              {uploadType === 'url' && (
                <button 
                  className="btn btn-primary"
                  onClick={handleAddImage}
                  disabled={!newImageUrl.trim()}
                >
                  {t.add}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;