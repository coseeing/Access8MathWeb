import { saveAs } from 'file-saver';
import JSZip from 'jszip';

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

const genConfigJs = (raw) => `window.contentConfig = ${raw}`;

export const saveContentAsOutput = (source, configInput = {}) => {
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
          saveAs(newZipData, 'output.zip');
        });
      });
    });
};
