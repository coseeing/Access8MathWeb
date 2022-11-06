export function getFileDataAsText(file) {
	return new Promise(function (resolve, reject) {
		try {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = (e) => {
				resolve(e.target.result);
				// this.local_front_url = URL.createObjectURL(new Blob(e.target.result));
				// url = URL.createObjectURL(file);
			};
		} catch (error) {
			reject();
		}
	});
}
