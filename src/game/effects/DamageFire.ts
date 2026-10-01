import { AnimatedSprite, Container } from 'pixi.js';

import type { Texture } from 'pixi.js';

export class DamageFire {
	public readonly container: Container;

	private sprite: AnimatedSprite;

	constructor(textures: Texture[]) {
		this.container = new Container();

		this.sprite = new AnimatedSprite(textures);

		this.sprite.anchor.set(0.5);

		this.sprite.animationSpeed = 0.12;

		this.sprite.loop = true;

		this.sprite.visible = false;

		this.container.addChild(this.sprite);

		this.sprite.play();
	}

	public setRandomOffset(minX: number, maxX: number, minY: number, maxY: number) {
		const randomX = Math.random() * (maxX - minX) + minX;

		const randomY = Math.random() * (maxY - minY) + minY;

		this.container.position.set(randomX, randomY);
	}

	public update(currentHealth: number, maxHealth: number) {
		const percentage = currentHealth / maxHealth;

		// VIDA BOA
		if (percentage > 0.6) {
			this.sprite.visible = false;

			return;
		}

		this.sprite.visible = true;

		// DANO MÉDIO
		if (percentage > 0.3) {
			this.sprite.width = 18;

			this.sprite.height = 26;

			this.sprite.alpha = 0.85;

			return;
		}

		// VIDA CRÍTICA
		this.sprite.width = 26;

		this.sprite.height = 36;

		this.sprite.alpha = 1;
	}

	public destroy() {
		this.sprite.stop();

		this.container.destroy({
			children: true,
		});
	}
}
