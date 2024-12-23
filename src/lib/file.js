import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import i18n from '@/lib/i18n';

import { asConfigData } from '@/lib/config/data';

const CONFIG_JSON_FILE_NAME = 'Access8Math.json';

export const ORIGINAL_FILE_EXTENSION = 'a8m';

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
        .then(parseConfigFile)
        .then(extractEntryData)
        .then(async ({ text, config, contents }) => {
          const imagesFolder = contents.folder('images');
          const imageFiles = imagesFolder 
            ? Object.entries(contents.files)
                .filter(([path]) => path.startsWith('images/') && path !== 'images/')
                .reduce((acc, [path, file]) => {
                  acc.files[path] = file;
                  return acc;
                }, { files: {} })
            : { files: {} };
          
          resolve({
            text,
            config: {
              ...asConfigData(config),
            },
            imagesFolder: imageFiles
          });
        })
        .catch(reject);
    };

    reader.onerror = reject;
  });
};

const parseConfigFile = (zipContents) => {
  const configFilename = CONFIG_JSON_FILE_NAME;

  if (!(configFilename in zipContents.files)) {
    throw new Error(`Config file ${configFilename} is missing in archive.`);
  }

  return zipContents.files[configFilename].async('text').then((configText) => {
    const config = JSON.parse(configText);

    return { config, contents: zipContents };
  });
};

const extractEntryData = ({ config, contents }) => {
  if (!config.entry) {
    throw new Error('No "entry" field specified in config.');
  }

  const entryFilename = config.entry;
  if (!(entryFilename in contents.files)) {
    throw new Error(`Entry file ${entryFilename} is missing in archive.`);
  }

  return contents.files[entryFilename].async('text').then((entryText) => ({
    text: entryText,
    config,
    contents,
  }));
};

const genConfigJs = (raw) => `window.contentConfig = ${raw}`;

export const saveContentAsWebsite = (sourceText, configInput = {}, imagesToExport = {}) => {
  let updatedSourceText = sourceText;
  const config = {
    ...configInput,
    sourceText: updatedSourceText,
    images: Object.entries(imagesToExport).reduce((acc, [fileID, file]) => {
      const fileName = `${fileID}.${file.type.split('/')[1]}`;
      acc[fileID] = fileName;
      return acc;
    }, {})
  };

  const configBlob = new Blob([genConfigJs(JSON.stringify(config))], {
    type: 'text/javascript',
  });

  fetch('./access8math-web-template.zip')
    .then((response) => response.blob())
    .then((zipData) => {
      JSZip.loadAsync(zipData).then(async (zip) => {
        zip.file('content-config.js', configBlob);

        const imagesFolder = zip.folder('images');
        for (const [fileName, file] of Object.entries(imagesToExport)) {
          const imageBlob = await file.arrayBuffer();
          imagesFolder.file(fileName, imageBlob);
        }

        zip.generateAsync({ type: 'blob' }).then((newZipData) => {
          saveAs(newZipData, `${config.title}.zip`);
        });
      });
    });
};

export const saveContentAsOriginalFile = async (sourceText, config, imagesToExport) => {
  const { entry } = config;
  const configWithMapping = {
    ...config,
    images: Object.keys(imagesToExport).reduce((acc, fileName) => {
      const key = fileName.split('.')[0];
      acc[key] = fileName;
      return acc;
    }, {})
  };

  const configBlob = new Blob([JSON.stringify(configWithMapping, null, 2)], {
    type: 'application/json',
  });
  let updatedSourceText = sourceText;
  const zip = new JSZip();
  const imagesFolder = zip.folder('images');

  for (const [fileName, file] of Object.entries(imagesToExport)) {
    const imageBlob = await file.arrayBuffer();
    imagesFolder.file(fileName, imageBlob);
  }

  const markdownBlob = new Blob([updatedSourceText], { type: 'text/markdown' });

  zip.file(CONFIG_JSON_FILE_NAME, configBlob);
  zip.file(entry, markdownBlob);
  zip.generateAsync({ type: 'blob' }).then((newZipData) => {
    saveAs(newZipData, `${config.title || i18n.t('untitledDocument', { ns: 'setting-modal' })}.${ORIGINAL_FILE_EXTENSION}`);
  });
};
