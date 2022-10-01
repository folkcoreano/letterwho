import ImageKit from "imagekit-javascript";

export const url = "https://ik.imagekit.io/letterwho/";

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
