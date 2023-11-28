export function getFileDataAsText(file) {
  return new Promise(function (resolve, reject) {
    try {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        resolve(e.target.result);
      };
    } catch (error) {
      reject();
    }
  });
}
