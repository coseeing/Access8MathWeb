import { saveAs } from 'file-saver';
import JSZip from 'jszip';

import i18n from '@/lib/i18n';

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

export const saveContentAsOutput = (source, configInput = {}) => {
  const config = {
    title: i18n.t('export.defaultTitle'),
    ...configInput,
  };

  const sourceblob = new Blob([source]);
  const configBlob = new Blob([JSON.stringify(config)], {
    type: 'application/json',
  });

  fetch('./template.zip')
    .then((response) => response.blob())
    .then((zipData) => {
      JSZip.loadAsync(zipData).then((zip) => {
        zip.file('build/source.txt', sourceblob);
        zip.file('build/content-config.json', configBlob);

        zip.generateAsync({ type: 'blob' }).then((newZipData) => {
          saveAs(newZipData, 'output.zip');
        });
      });
    });
};
