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

export function favicon(path: string) {
	return imgkit.url({
		path: `${path}.jpg`,
		transformation: [{width: "50", radius: "50", defaultImage: "/404a.jpg"}],
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
