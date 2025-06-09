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
          if (!imagesFolder) {
            resolve({
              text,
              config: asConfigData(config),
              imagesFolder: { files: {} },
            });
            return;
          }

          const imageFiles = Object.entries(contents.files)
            .filter(([path]) => path.startsWith('images/') && path !== 'images/')
            .reduce(
              (acc, [path, file]) => {
                return {
                  ...acc,
                  files: {
                    ...acc.files,
                    [path]: file,
                  },
                };
              },
              { files: {} }
            );

          resolve({
            text,
            config: asConfigData(config),
            imagesFolder: imageFiles,
          });
        })
        .catch(reject);
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
    images: Object.entries(imagesToExport).reduce((acc, [fileID, { fileName }]) => {
      acc[fileID] = fileName;
      return acc;
    }, {}),
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
        for (const [, { fileName, file }] of Object.entries(imagesToExport)) {
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
  const images = Object.entries(imagesToExport).reduce((acc, [fileId, { fileName }]) => {
    const key = fileId;
    return { ...acc, [key]: fileName };
  }, {});

  const configWithMapping = {
    ...config,
    images,
  };

  const configBlob = new Blob([JSON.stringify(configWithMapping, null, 2)], {
    type: 'application/json',
  });

  const zip = new JSZip();
  const imagesFolder = zip.folder('images');
  for (const [, { fileName, file }] of Object.entries(imagesToExport)) {
    if (file instanceof Blob) {
      const imageBlob = await file.arrayBuffer();
      imagesFolder.file(fileName, imageBlob);
    } else {
      console.error(`File for ${fileName} is not a Blob.`);
    }
  }

  const markdownBlob = new Blob([sourceText], { type: 'text/markdown' });

  zip.file(CONFIG_JSON_FILE_NAME, configBlob);
  zip.file(entry, markdownBlob);
  zip.generateAsync({ type: 'blob' }).then((newZipData) => {
    saveAs(
      newZipData,
      `${
        config.title || i18n.t('untitledDocument', { ns: 'setting-modal' })
      }.${ORIGINAL_FILE_EXTENSION}`
    );
  });
};
