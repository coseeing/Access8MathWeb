/**
 * Extract image IDs from HTML content
 * @param {string} html - HTML content
 * @returns {Set<string>} Set of image IDs
 */
export function extractImageIdsFromHtml(html) {
  const imageIds = new Set();

  if (!html || typeof html !== 'string') {
    return imageIds;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const imgElements = doc.querySelectorAll('img');

    imgElements.forEach((img) => {
      const dataId = img.getAttribute('data-seemark-image-id');
      if (dataId) {
        imageIds.add(dataId);
        return;
      }
    });
  } catch (error) {
    console.warn('HTML parsing failed:', error);
  }

  return imageIds;
}

/**
 * Extract image IDs from markdown text
 * @param {string} text - Markdown text content
 * @returns {Set<string>} Set of image IDs
 */
export function extractImageIdsFromText(text) {
  const imageIds = new Set();

  if (!text || typeof text !== 'string') {
    return imageIds;
  }

  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;

  while ((match = imageRegex.exec(text)) !== null) {
    const imageId = match[2];
    if (
      imageId &&
      typeof imageId === 'string' &&
      !imageId.startsWith('http') &&
      !imageId.includes('/') &&
      !imageId.includes('.')
    ) {
      const trimmedImageId = imageId.trim();
      if (trimmedImageId.length > 0) {
        imageIds.add(trimmedImageId);
      }
    }
  }

  return imageIds;
}

/**
 * Clean unused image resources
 * @param {Object} imagesToExport - Current image export list
 * @param {string} htmlContent - HTML content
 * @param {string} markdownText - Markdown text content (optional, as fallback)
 * @returns {Object} Cleaned image export list
 */
export function cleanUnusedImageResources(imagesToExport, htmlContent, markdownText = null) {
  if (!imagesToExport || typeof imagesToExport !== 'object' || Array.isArray(imagesToExport)) {
    return {};
  }

  const imageKeys = Object.keys(imagesToExport);
  if (imageKeys.length === 0) {
    return {};
  }

  let usedImageIds = extractImageIdsFromHtml(htmlContent);

  if (usedImageIds.size === 0 && markdownText) {
    const htmlHasImages =
      htmlContent && typeof htmlContent === 'string' && htmlContent.includes('<img');
    if (htmlHasImages) {
      console.warn(
        '[Images] HTML contains img tags but parsing failed, falling back to markdown check'
      );
      usedImageIds = extractImageIdsFromText(markdownText);
    } else {
      console.log('[Images] No images found in HTML content');
    }
  }

  const cleanedImages = Object.entries(imagesToExport).reduce((acc, [imageId, imageData]) => {
    if (imageId && typeof imageId === 'string' && usedImageIds.has(imageId.trim())) {
      return { ...acc, [imageId]: imageData };
    }
    return acc;
  }, {});

  return cleanedImages;
}
