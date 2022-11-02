import ImageKit from "imagekit-javascript";

const imgkit = new ImageKit({
	publicKey: "public_oqUrT5tJYCiGVCOi8ezeeSe5zp0=",
	urlEndpoint: "https://ik.imagekit.io/letterwho",
});

export function folder(path: string, width?: string) {
	return width
		? imgkit.url({
				path: `${path}.jpg`,
				transformation: [{width, defaultImage: "/404a.jpg"}],
		  })
		: imgkit.url({
				path: `${path}.jpg`,
				transformation: [{defaultImage: "/404a.jpg"}],
		  });
}

export function homeFolder(path: string, width: string, height: string) {
	return imgkit.url({
		path: `${path}.jpg`,
		transformation: [{width, height, focus: "top", defaultImage: "/404a.jpg"}],
	});
}

export function favicon(path: string) {
	return imgkit.url({
		path: `${path}.jpg`,
		transformation: [{width: "100", radius: "10", defaultImage: "/404a.jpg"}],
	});
}

export function char(path: string, size: string) {
	return imgkit.url({
		path: `${path}.jpg`,
		transformation: [{width: size, height: size, focus: "auto", defaultImage: "/404a.jpg"}],
	});
}

export function url(url: string, width?: string) {
	return width
		? imgkit.url({
				path: url,
				transformation: [{width, defaultImage: "/404a.jpg"}],
		  })
		: imgkit.url({
				path: url,
				transformation: [{defaultImage: "/404a.jpg"}],
		  });
}
