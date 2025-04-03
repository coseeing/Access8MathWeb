async function toBlob(file) {
  const fileContent = await file.async('text');
  const isSvg = fileContent.includes('<svg');

  if (isSvg) {
    return new Blob([fileContent], { type: 'image/svg+xml' });
  } else {
    return await file.async('blob');
  }
}

export async function importSource(text, config = {}, imagesFolder, addImageToExport, setImageFiles, setDisplayConfig, createView, displayConfig) {
  if (!imagesFolder) {
    setDisplayConfig({ ...displayConfig, ...config });
    createView(text);
    return;
  }

  const newImageFiles = {};
  for (const [relativePath, file] of Object.entries(imagesFolder.files)) {
    if (!relativePath.endsWith('/')) {
      const fileName = relativePath.split('/').pop();
      const blob = await toBlob(file);
      const fileID = fileName.split('.')[0];
      newImageFiles[fileID] = blob;
      addImageToExport(fileID, blob);
    }
  }
  setImageFiles(newImageFiles);
  setDisplayConfig({ ...displayConfig, ...config });
  createView(text);
}