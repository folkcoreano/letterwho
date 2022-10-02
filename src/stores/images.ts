import ImageKit from "imagekit-javascript";

const imgkit = new ImageKit({
	publicKey: "public_oqUrT5tJYCiGVCOi8ezeeSe5zp0=",
	urlEndpoint: "https://ik.imagekit.io/letterwho",
});

export function folder(path: string, width?: string) {
	if (width) {
		return imgkit.url({
			path: path + ".jpg",
			transformation: [{width: width}],
		});
	} else {
		return imgkit.url({
			path: path + ".jpg",
		});
	}
}

export function url(url: string, width?: string) {
	if (width) {
		return imgkit.url({
			path: url,
			transformation: [{width: width}],
		});
	} else {
		return imgkit.url({
			path: url,
		});
	}
}
