import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { IconAlertTriangle, IconPhoto, IconPlus, IconX } from '@tabler/icons-react';
import { useTranslation } from '@/lib/i18n';
import { ellipsizeMiddle, isValidUrl } from '@/lib/url';
import BasicModal from '@/components/core/modal/basic-modal';
import PrimaryButton from '@/components/core/button/primary-button';
import TextInput from '@/components/core/text-input';
import RadioGroup from '@/components/core/radio-group';

const MAX_FILE_SIZE_MB = 10;

const ImageSource = ({ onChange }) => {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedError, setEmbedError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const fileInputRef = useRef(null);
  const blobUrlRef = useRef(null);

  const t = useTranslation('upload-image-modal');

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  const resetSourceState = ({ resetFileInput = false } = {}) => {
    setUploadFile(null);
    setUploadError(false);
    setEmbedError(false);
    setPreviewUrl(null);
    setImageInfo(null);
    setStatusMessage('');
    revokeBlobUrl();
    if (resetFileInput && fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = (file) => {
    if (!file) return;

    resetSourceState();

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setUploadError(true);
      setStatusMessage(t('announceUploadFailed', { maxSize: MAX_FILE_SIZE_MB }));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    blobUrlRef.current = objectUrl;

    setUploadFile(file);
    setPreviewUrl(objectUrl);

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

  const handleEmbed = () => {
    const trimmed = embedUrl.trim();
    if (!trimmed) return;

    resetSourceState({ resetFileInput: true });

    if (!isValidUrl(trimmed)) {
      setEmbedError(true);
      setStatusMessage(t('announceEmbedFailed'));
      return;
    }

    setPreviewUrl(trimmed);
  };

  const handleRemoveImage = () => {
    resetSourceState({ resetFileInput: true });
  };

  useEffect(() => {
    if (uploadError || embedError || !previewUrl) {
      onChange(null);
      return;
    }
    onChange({
      file: uploadFile,
      sourceUrl: uploadFile ? null : previewUrl,
    });
  }, [uploadError, embedError, previewUrl, onChange, uploadFile]);

  useEffect(() => revokeBlobUrl, [revokeBlobUrl]);

  const renderPreviewBody = () => {
    if (uploadError) {
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          <IconAlertTriangle className="size-5 text-error" stroke={2} aria-hidden="true" />
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold text-error">{t('uploadFailed')}</p>
            <p className="text-sm font-medium text-error">{t('uploadFailedHint')}</p>
          </div>
          <p className="text-xs text-text-secondary text-center">
            {t('dropMeta', { maxSize: MAX_FILE_SIZE_MB })}
          </p>
        </div>
      );
    }
    if (embedError) {
      return (
        <div className="flex flex-col items-center gap-2 py-4">
          <IconAlertTriangle className="size-5 text-error" stroke={2} aria-hidden="true" />
          <div className="flex flex-col items-center">
            <p className="text-sm font-bold text-error">{t('embedLoadFailed')}</p>
            <p className="text-sm font-medium text-error">{t('embedLoadFailedHint')}</p>
          </div>
          <p className="text-xs text-text-secondary text-center">
            {t('dropMeta', { maxSize: MAX_FILE_SIZE_MB })}
          </p>
        </div>
      );
    }
    if (previewUrl) {
      return (
        <div className="flex flex-col gap-1 items-center w-full px-2">
          <div className="relative">
            <img
              src={previewUrl}
              alt={t('imagePreview')}
              className="max-h-20 max-w-[150px] border border-dashed border-primary object-contain"
              onError={() => {
                if (!uploadFile) {
                  setEmbedError(true);
                  setPreviewUrl(null);
                  setStatusMessage(t('announceEmbedFailed'));
                }
              }}
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
          <p className="text-sm font-medium text-primary truncate max-w-full">
            {uploadFile ? (
              <>
                <span className="sr-only">{uploadFile.name}</span>
                <span aria-hidden="true">{ellipsizeMiddle(uploadFile.name)}</span>
              </>
            ) : (
              <>
                <span className="sr-only">{previewUrl}</span>
                <span aria-hidden="true">{ellipsizeMiddle(previewUrl)}</span>
              </>
            )}
          </p>
          {imageInfo && (
            <p className="text-xs text-text-secondary text-center">
              {t('fileSize')}：{imageInfo.size} {t('dimensions')}：{imageInfo.width} x{' '}
              {imageInfo.height} px
            </p>
          )}
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <IconPhoto className="size-5 text-primary" stroke={2} aria-hidden="true" />
        <p className="text-sm font-bold text-text-primary">{t('dropTitle')}</p>
        <p className="text-xs text-text-secondary text-center">
          {t('dropMeta', { maxSize: MAX_FILE_SIZE_MB })}
        </p>
      </div>
    );
  };

  return (
    <fieldset className="bg-bg-main flex flex-col gap-3 p-3 rounded-lg border-0 m-0">
      <legend className="sr-only">{t('imageSource')}</legend>

      {/* Status message for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </div>

      {/* Preview box */}
      <div
        className={`flex flex-col min-h-[143px] items-center justify-center rounded p-1 ${
          previewUrl || uploadError || embedError
            ? 'bg-white'
            : 'bg-blue-100 border border-dashed border-black'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderPreviewBody()}
      </div>

      {/* File select button */}
      <div className="flex justify-center">
        <input
          id="file-input"
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/png, image/gif, image/bmp, image/webp, image/svg"
          className="sr-only peer"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="file-input"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline cursor-pointer rounded peer-focus:outline peer-focus:outline-2 peer-focus:outline-primary"
        >
          <IconPlus className="size-4" aria-hidden="true" />
          {t('chooseFile')}
        </label>
      </div>

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
        <p id="embed-url-hint" className="text-xs text-text-secondary">
          {t('embedHint')}
        </p>
        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <TextInput
              id="embed-url"
              aria-describedby="embed-url-hint"
              value={embedUrl}
              onChange={(val) => setEmbedUrl(val)}
              placeholder={t('embedUrlPlaceholder')}
            />
          </div>
          <PrimaryButton size="l" onClick={handleEmbed} className="shrink-0">
            {t('embed')}
          </PrimaryButton>
        </div>
      </div>
    </fieldset>
  );
};

ImageSource.propTypes = {
  onChange: PropTypes.func.isRequired,
};

const ImageUploadModal = ({ isOpen, onClose, onConfirm }) => {
  const [imageSource, setImageSource] = useState(null);
  const [altText, setAltText] = useState('');
  const [altTextError, setAltTextError] = useState('');
  const [caption, setCaption] = useState('');
  const [linkOption, setLinkOption] = useState('no-link');
  const [targetUrl, setTargetUrl] = useState('');
  const [targetUrlError, setTargetUrlError] = useState('');

  const t = useTranslation('upload-image-modal');

  const resetForm = () => {
    setImageSource(null);
    setAltText('');
    setAltTextError('');
    setCaption('');
    setLinkOption('no-link');
    setTargetUrl('');
    setTargetUrlError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (!imageSource) return; // TODO: ask designer where to show image validation error

    let valid = true;
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
      file: imageSource.file,
      sourceUrl: imageSource.sourceUrl,
      altText: altText.trim(),
      display: caption.trim(),
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
        {/* Image source */}
        <ImageSource onChange={setImageSource} />

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
          label={t('caption')}
          hint={t('optional')}
          value={caption}
          onChange={(val) => setCaption(val)}
          placeholder={t('captionPlaceholder')}
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
