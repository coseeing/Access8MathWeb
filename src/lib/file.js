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

export const saveAsTemplateZip = (source) => {
  const blob = new Blob([source]);

  fetch('./template.zip')
    .then((response) => response.blob())
    .then((zipData) => {
      JSZip.loadAsync(zipData).then((zip) => {
        // update to proper folder name
        zip.file('build/source.txt', blob);

        zip.generateAsync({ type: 'blob' }).then((newZipData) => {
          saveAs(newZipData, 'output.zip');
        });
      });
    });
};
