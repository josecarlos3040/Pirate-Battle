import { Container, TilingSprite } from 'pixi.js';

import type { Texture } from 'pixi.js';

export class Ocean {
	public readonly container: Container;

	private sprite: TilingSprite;

	constructor(texture: Texture, width: number, height: number) {
		this.container = new Container();

		this.sprite = new TilingSprite({
			texture,
			width,
			height,
		});

		this.container.addChild(this.sprite);
	}

	public resize(width: number, height: number) {
		this.sprite.width = width;

		this.sprite.height = height;
	}

	public destroy() {
		this.container.destroy({
			children: true,
		});
	}
}
