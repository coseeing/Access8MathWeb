import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@headlessui/react';
import { useTranslation } from '@/lib/i18n';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SecondaryButton from '@/components/core/button/secondary-button';
import PrimaryButton from '@/components/core/button/primary-button';

const ImageUploadModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [altText, setAltText] = useState('');
  const [imageInfo, setImageInfo] = useState(null);
  const fileInputRef = useRef(null);
  const t = useTranslation('upload-image-modal');

  const resetImage = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageInfo(null);
  }, []);

  const resetForm = useCallback(() => {
    resetImage();
    setAltText('');
  }, [resetImage]);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          width: img.width,
          height: img.height,
          size: (file.size / 1024).toFixed(2) + ' KB'
        });
      };
      img.src = URL.createObjectURL(file);
    }
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect({ target: { files: [file] } });
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleConfirm = useCallback(() => {
    if (selectedFile && altText.trim()) {
      onConfirm(selectedFile, altText);
      handleClose();
    }
  }, [selectedFile, altText, onConfirm, handleClose]);

  const handleRemoveImage = useCallback(() => {
    resetImage();
  }, [resetImage]);

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      className="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="upload-image-title"
      aria-describedby="upload-image-description"
    >
      <div className="flex items-center justify-center min-h-screen" role="dialog" aria-modal="true">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog.Title id="upload-image-title" className="text-lg font-medium mb-4">
            {t('title')}
          </Dialog.Title>
          
          <div id="upload-image-description" className="sr-only">
            {t('modalDescription')}
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4 text-center cursor-pointer"
            onClick={() => !previewUrl && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                !previewUrl && fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={previewUrl ? t('replaceImage') : t('chooseFile')}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              aria-hidden="true"
            />
            {!previewUrl ? (
              <div className="flex items-center justify-center space-x-2 text-cyan">
                <PlusCircleIcon className="h-6 w-6" />
                <span>{t('chooseFile')}</span>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label={t('removeImage')}
                >
                  <XMarkIcon className="h-4 w-4 text-gray-900" />
                </button>
                <img
                  src={previewUrl}
                  alt={t('imagePreview')}
                  className="max-h-48 mx-auto"
                />
              </div>
            )}
          </div>

          {imageInfo && (
            <div className="mb-4 text-sm text-gray-600" aria-live="polite">
              <p>{t('dimensions')}: {imageInfo.width} x {imageInfo.height}px</p>
              <p>{t('fileSize')}: {imageInfo.size}</p>
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="alt-text-input" className="block text-sm font-medium text-gray-700 mb-1">
              {t('altText')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              <span className="sr-only">{t('required')}</span>
            </label>
            <input
              id="alt-text-input"
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full border rounded-md p-2"
              placeholder={t('altTextPlaceholder')}
              aria-required="true"
              aria-invalid={!altText.trim()}
              aria-describedby="alt-text-error"
            />
            {!altText.trim() && (
              <div id="alt-text-error" className="text-red-500 text-sm mt-1" role="alert">
                {t('altTextRequired')}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 w-full">
            <SecondaryButton
              onClick={handleClose}
              aria-label={t('cancel')}
              className="flex-1"
            >
              {t('cancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={handleConfirm}
              disabled={!selectedFile || !altText.trim()}
              aria-label={t('confirm')}
              className="flex-1"
            >
              {t('confirm')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

ImageUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ImageUploadModal;