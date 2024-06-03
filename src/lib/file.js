import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const CONFIG_JSON_FILE_NAME = 'config.json';
const MARKDOWN_FILE_NAME = 'content.md';

export function getFileDataAsText(file) {
  return new Promise(function (resolve, reject) {
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
}

export function parseA8MWFile(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    if (!(file instanceof Blob)) {
      reject(new Error('The input is not a Blob.'));
    }

    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      const zip = new JSZip();
      zip.loadAsync(e.target.result).then((contents) => {
        console.log(
          'parseA8MWFile config.json',
          contents.files[CONFIG_JSON_FILE_NAME],
        );
        console.log(
          'parseA8MWFile markdown',
          contents.files[MARKDOWN_FILE_NAME],
        );
        resolve(contents);
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
}

const genConfigJs = (raw) => `window.contentConfig = ${raw}`;

export const saveContentAsWebsite = (source, configInput = {}) => {
  const config = {
    title: '',
    ...configInput,
    sourceText: source,
  };

  const rawFileName = `${config.title}.txt`;

  const configBlob = new Blob([genConfigJs(JSON.stringify(config))], {
    type: 'text/javascript',
  });
  const rawFileBlob = new Blob([source], { type: 'text/plain' });

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

export const saveContentAsOriginalFile = (source, config = {}) => {
  const configBlob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  });
  const markdownBlob = new Blob([source], { type: 'text/markdown' });

  const zip = new JSZip();
  zip.file(CONFIG_JSON_FILE_NAME, configBlob);
  zip.file(MARKDOWN_FILE_NAME, markdownBlob);
  zip.generateAsync({ type: 'blob' }).then(function (newZipData) {
    saveAs(newZipData, 'export.a8mw');
  });
};
