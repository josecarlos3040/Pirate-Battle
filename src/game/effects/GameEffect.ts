import { AnimatedSprite, Container } from 'pixi.js';

import type { Texture } from 'pixi.js';

export class GameEffect {
	public readonly container: Container;

	public isDead = false;

	private sprite: AnimatedSprite;

	private baseWidth: number;

	private baseHeight: number;

	constructor(
		x: number,
		y: number,

		textures: Texture[],

		width: number,
		height: number,

		animationSpeed = 0.2,
	) {
		this.container = new Container();

		this.container.position.set(x, y);

		this.baseWidth = width;

		this.baseHeight = height;

		this.sprite = new AnimatedSprite(textures);

		this.sprite.anchor.set(0.5);

		this.sprite.width = this.baseWidth;

		this.sprite.height = this.baseHeight;

		this.sprite.animationSpeed = animationSpeed;

		this.sprite.loop = false;

		// ==================================
		// DIMINUI CONFORME A ANIMAÇÃO AVANÇA
		// ==================================

		this.sprite.onFrameChange = (currentFrame) => {
			const totalFrames = textures.length;

			if (totalFrames <= 1) {
				return;
			}

			const progress = currentFrame / (totalFrames - 1);

			// Começa em 100%
			// termina em 55%
			const scale = 1 - progress * 0.45;

			this.sprite.width = this.baseWidth * scale;

			this.sprite.height = this.baseHeight * scale;
		};

		this.sprite.onComplete = () => {
			this.isDead = true;
		};

		this.container.addChild(this.sprite);

		this.sprite.play();
	}

	public destroy() {
		this.sprite.stop();

		this.container.destroy({
			children: true,
		});
	}
}
