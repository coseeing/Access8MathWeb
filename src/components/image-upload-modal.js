import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { IconPhoto, IconPlus, IconX } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import BasicModal from '@/components/core/modal/basic-modal';
import PrimaryButton from '@/components/core/button/primary-button';
import TextInput from '@/components/core/text-input';
import RadioGroup from '@/components/core/radio-group';

const MAX_FILE_SIZE_MB = 10;

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const ImageUploadModal = ({ isOpen, onClose, onConfirm }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [fileError, setFileError] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedError, setEmbedError] = useState('');
  const [altText, setAltText] = useState('');
  const [altTextError, setAltTextError] = useState('');
  const [display, setDisplay] = useState('');
  const [linkOption, setLinkOption] = useState('no-link');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetUrlError, setTargetUrlError] = useState('');

  const fileInputRef = useRef(null);
  const t = useTranslation('upload-image-modal');

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageInfo(null);
    setFileError('');
    setEmbedUrl('');
    setEmbedError('');
    setAltText('');
    setAltTextError('');
    setDisplay('');
    setLinkOption('no-link');
    setTargetUrl('');
    setTargetUrlError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(t('fileSizeExceeds', { maxSize: MAX_FILE_SIZE_MB }));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setImageInfo(null);
    setFileError('');
    setEmbedUrl('');
    const img = new Image();
    img.onload = () =>
      setImageInfo({
        width: img.width,
        height: img.height,
        size: (file.size / 1024).toFixed(0) + 'KB',
      });
    img.src = objectUrl;
  };

  const handleFileSelect = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) processFile(file);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageInfo(null);
    setFileError('');
  };

  const handleEmbed = () => {
    if (!embedUrl.trim()) {
      setEmbedError(t('embedUrlRequired'));
      return;
    }
    if (!isValidUrl(embedUrl)) {
      setEmbedError(t('embedUrlInvalid'));
      return;
    }
    setEmbedError('');
    setSelectedFile(null);
    setImageInfo(null);
    setPreviewUrl(embedUrl.trim());
  };

  const handleConfirm = () => {
    let valid = true;

    if (!previewUrl) {
      setFileError(t('imageRequired'));
      valid = false;
    }
    if (!altText.trim()) {
      setAltTextError(t('altTextRequired'));
      valid = false;
    }
    if (linkOption === 'with-link') {
      if (!targetUrl.trim()) {
        setTargetUrlError(t('targetUrlRequired'));
        valid = false;
      } else if (!isValidUrl(targetUrl)) {
        setTargetUrlError(t('targetUrlInvalid'));
        valid = false;
      }
    }
    if (!valid) return;

    onConfirm({
      file: selectedFile,
      sourceUrl: selectedFile ? null : previewUrl,
      altText: altText.trim(),
      display: display.trim(),
      targetUrl: linkOption === 'with-link' ? targetUrl.trim() : '',
    });
    handleClose();
  };

  return (
    <BasicModal
      title={t('title')}
      isOpen={isOpen}
      onClose={handleClose}
      onCancel={handleClose}
      onConfirm={handleConfirm}
      cancelLabel={t('cancel')}
      confirmLabel={t('confirm')}
    >
      <div className="flex flex-col gap-6">
        {/* Image source block */}
        <fieldset className="bg-bg-main flex flex-col gap-3 p-3 rounded-lg border-0 m-0">
          <legend className="sr-only">{t('imageSource')}</legend>
          {/* Preview box */}
          <div
            role="button"
            tabIndex={0}
            aria-label={t('dropZoneLabel')}
            className={`flex flex-col min-h-[143px] items-center justify-center rounded p-1 ${
              previewUrl ? 'bg-white' : 'bg-blue-100 border border-dashed border-black'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {previewUrl ? (
              <div className="flex flex-col gap-1 items-center w-full px-2">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt={t('imagePreview')}
                    className="max-h-20 max-w-[150px] border border-dashed border-primary object-contain"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 size-6 rounded-full bg-white border border-red-500 flex items-center justify-center hover:bg-red-50"
                    aria-label={t('removeImage')}
                  >
                    <IconX className="size-3.5 text-red-500" />
                  </button>
                </div>
                {selectedFile && (
                  <p className="text-sm font-medium text-primary truncate max-w-full">
                    {selectedFile.name}
                  </p>
                )}
                {imageInfo && (
                  <p className="text-xs text-text-secondary text-center">
                    {t('fileSize')}：{imageInfo.size} {t('dimensions')}：{imageInfo.width} x{' '}
                    {imageInfo.height} px
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <IconPhoto className="size-5 text-primary" stroke={2} />
                <p className="text-sm font-bold text-text-primary">{t('dropTitle')}</p>
                <p className="text-xs text-text-secondary text-center">{t('dropMeta')}</p>
              </div>
            )}
          </div>

          {/* File select button */}
          <div className="flex justify-center">
            <input
              id="file-input"
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/svg+xml"
              className="sr-only peer"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-input"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer rounded peer-focus:outline peer-focus:outline-2 peer-focus:outline-primary"
            >
              <IconPlus className="size-4" />
              {t('chooseFile')}
            </label>
          </div>

          {fileError && (
            <p role="alert" className="text-sm text-error text-center">
              {fileError}
            </p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border-main" />
            <span className="text-xs font-medium text-text-primary">or</span>
            <div className="flex-1 h-px bg-border-main" />
          </div>

          {/* URL embed */}
          <div className="flex flex-col gap-2">
            <label htmlFor="embed-url" className="text-base text-text-primary">
              {t('embedFromUrl')}
            </label>
            <p id="embed-url-hint" className="text-xs text-text-secondary">{t('embedHint')}</p>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <TextInput
                  id="embed-url"
                  aria-describedby="embed-url-hint"
                  value={embedUrl}
                  onChange={(val) => {
                    setEmbedUrl(val);
                    setEmbedError('');
                  }}
                  placeholder={t('embedUrlPlaceholder')}
                  error={embedError}
                />
              </div>
              <PrimaryButton size="l" onClick={handleEmbed} className="shrink-0">
                {t('embed')}
              </PrimaryButton>
            </div>
          </div>
        </fieldset>

        {/* Alt text */}
        <TextInput
          id="alt-text"
          label={t('altText')}
          value={altText}
          onChange={(val) => {
            setAltText(val);
            setAltTextError('');
          }}
          placeholder={t('altTextPlaceholder')}
          error={altTextError}
          required
        />

        {/* Display / caption */}
        <TextInput
          id="image-display"
          label={t('display')}
          hint={t('optional')}
          value={display}
          onChange={(val) => setDisplay(val)}
          placeholder={t('displayPlaceholder')}
        />

        {/* External link */}
        <RadioGroup
          name="image-link-option"
          label={t('externalLink')}
          options={[
            { value: 'no-link', label: t('noLink') },
            { value: 'with-link', label: t('withLink') },
          ]}
          value={linkOption}
          onChange={(val) => {
            setLinkOption(val);
            setTargetUrlError('');
          }}
        />
        {linkOption === 'with-link' && (
          <TextInput
            id="target-url"
            label={t('targetUrl')}
            value={targetUrl}
            onChange={(val) => {
              setTargetUrl(val);
              setTargetUrlError('');
            }}
            placeholder={t('targetUrlPlaceholder')}
            error={targetUrlError}
            required
          />
        )}
      </div>
    </BasicModal>
  );
};

ImageUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ImageUploadModal;
