import { Container, Sprite } from 'pixi.js';

import type { IslandTextures } from '../core/GameAssets';

export class Island {
	public readonly container: Container;

	public readonly collisionRadius: number;

	private tileWidth: number;

	private tileHeight: number;

	constructor(x: number, y: number, textures: IslandTextures) {
		this.container = new Container();

		this.container.position.set(x, y);

		this.tileWidth = textures.center.width;

		this.tileHeight = textures.center.height;

		// ================================
		// TOP ROW
		// ================================

		this.createTile(textures.topLeft, -this.tileWidth, -this.tileHeight);

		this.createTile(textures.topCenter, 0, -this.tileHeight);

		this.createTile(textures.topRight, this.tileWidth, -this.tileHeight);

		// ================================
		// MIDDLE ROW
		// ================================

		this.createTile(textures.middleLeft, -this.tileWidth, 0);

		this.createTile(textures.center, 0, 0);

		this.createTile(textures.middleRight, this.tileWidth, 0);

		// ================================
		// BOTTOM ROW
		// ================================

		this.createTile(textures.bottomLeft, -this.tileWidth, this.tileHeight);

		this.createTile(textures.bottomCenter, 0, this.tileHeight);

		this.createTile(textures.bottomRight, this.tileWidth, this.tileHeight);

		// ================================
		// COLLISION
		// ================================

		const totalWidth = this.tileWidth * 3;

		const totalHeight = this.tileHeight * 3;

		this.collisionRadius = Math.min(totalWidth, totalHeight) * 0.38;
	}

	private createTile(
		texture: IslandTextures[keyof IslandTextures],

		x: number,
		y: number,
	) {
		const sprite = new Sprite(texture);

		sprite.anchor.set(0.5);

		sprite.position.set(x, y);

		sprite.width = this.tileWidth;

		sprite.height = this.tileHeight;

		this.container.addChild(sprite);
	}

	public destroy() {
		this.container.destroy({
			children: true,
		});
	}
}
