import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import { asConfigData } from '@/lib/config/data';

const CONFIG_JSON_FILE_NAME = 'config.json';
const MARKDOWN_FILE_NAME = 'content.md';

export const getFileDataAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (!(file instanceof Blob)) {
      reject(new Error('The input is not a Blob.'));
    }

    reader.readAsText(file);

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = (e) => {
      console.error(e);
      reject(e);
    };

    reader.onabort = (e) => {
      console.log('onabort', e);
    };
  });
};

export const parseA8MWFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    if (!(file instanceof Blob)) {
      reject(new Error('The input is not a Blob.'));
    }

    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      const zip = new JSZip();
      zip
        .loadAsync(e.target.result)
        .then((contents) => {
          return Promise.all([
            contents.files[MARKDOWN_FILE_NAME].async('text'),
            contents.files[CONFIG_JSON_FILE_NAME].async('text'),
          ]);
        })
        .then(([text, config]) => {
          resolve({
            text,
            config: asConfigData(JSON.parse(config)),
          });
        });
    };

    reader.onerror = (e) => {
      console.error(e);
      reject(e);
    };

    reader.onabort = (e) => {
      console.log('onabort', e);
    };
  });
};

const genConfigJs = (raw) => `window.contentConfig = ${raw}`;

export const saveContentAsWebsite = (sourceText, configInput = {}) => {
  const config = {
    ...configInput,
    sourceText,
  };

  const rawFileName = `${config.title}.txt`;

  const configBlob = new Blob([genConfigJs(JSON.stringify(config))], {
    type: 'text/javascript',
  });
  const rawFileBlob = new Blob([sourceText], { type: 'text/plain' });

  const access8mathConfig = { entry: rawFileName };
  const access8mathJsonBlob = new Blob([JSON.stringify(access8mathConfig)], {
    type: 'application/json',
  });

  fetch('./access8math-web-template.zip')
    .then((response) => response.blob())
    .then((zipData) => {
      JSZip.loadAsync(zipData).then((zip) => {
        zip.file('content-config.js', configBlob);
        zip.file(rawFileName, rawFileBlob);
        zip.file('Access8Math.json', access8mathJsonBlob);

        zip.generateAsync({ type: 'blob' }).then((newZipData) => {
          saveAs(newZipData, 'website.zip');
        });
      });
    });
};

export const saveContentAsOriginalFile = (sourceText, config = {}) => {
  const configBlob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  });
  const markdownBlob = new Blob([sourceText], { type: 'text/markdown' });

  const zip = new JSZip();
  zip.file(CONFIG_JSON_FILE_NAME, configBlob);
  zip.file(MARKDOWN_FILE_NAME, markdownBlob);
  zip.generateAsync({ type: 'blob' }).then((newZipData) => {
    saveAs(newZipData, 'export.a8mw');
  });
};
