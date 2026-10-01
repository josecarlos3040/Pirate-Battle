import { Container, Sprite } from 'pixi.js';

import type { Texture } from 'pixi.js';

import { GAME_CONFIG } from '../config/gameConfig';

import { HealthBar } from '../ui/HealthBar';

import { DamageFire } from '../effects/DamageFire';

export class Player {
	public readonly container: Container;

	public readonly collisionRadius = 30;

	public health: number = GAME_CONFIG.player.maxHealth;

	public isDead = false;

	private sprite: Sprite;

	private healthBar: HealthBar;

	private damageFire: DamageFire;

	private normalTexture: Texture;

	private damagedTexture: Texture;

	private speed = GAME_CONFIG.player.movementSpeed;

	private rotationSpeed = GAME_CONFIG.player.rotationSpeed;

	constructor(texture: Texture, damagedTexture: Texture, fireTextures: Texture[]) {
		this.container = new Container();

		this.normalTexture = texture;

		this.damagedTexture = damagedTexture;

		// =========================
		// SHIP
		// =========================

		this.sprite = new Sprite(this.normalTexture);

		this.sprite.anchor.set(0.5);

		this.sprite.rotation = Math.PI;

		this.sprite.width = 70;

		this.sprite.height = 100;

		this.container.addChild(this.sprite);

		// =========================
		// FIRE
		// =========================

		this.damageFire = new DamageFire(fireTextures);

		this.damageFire.setRandomOffset(-14, 14, -18, 16);

		this.container.addChild(this.damageFire.container);

		// =========================
		// HEALTH BAR
		// =========================

		this.healthBar = new HealthBar(70, 8);

		this.healthBar.container.position.set(0, -60);

		this.container.addChild(this.healthBar.container);

		this.updateDamageVisual();
	}

	public update(
		deltaTime: number,
		forward: boolean,
		left: boolean,
		right: boolean,
		arenaWidth: number,
		arenaHeight: number,
	) {
		if (this.isDead) {
			return;
		}

		if (left) {
			this.container.rotation -= this.rotationSpeed * deltaTime;
		}

		if (right) {
			this.container.rotation += this.rotationSpeed * deltaTime;
		}

		if (forward) {
			this.container.x += Math.sin(this.container.rotation) * this.speed * deltaTime;

			this.container.y -= Math.cos(this.container.rotation) * this.speed * deltaTime;
		}

		const margin = 40;

		this.container.x = Math.max(
			margin,
			Math.min(
				arenaWidth - margin,

				this.container.x,
			),
		);

		this.container.y = Math.max(
			margin,
			Math.min(
				arenaHeight - margin,

				this.container.y,
			),
		);
	}

	public takeDamage(amount: number) {
		this.health -= amount;

		if (this.health < 0) {
			this.health = 0;
		}

		this.healthBar.update(this.health, GAME_CONFIG.player.maxHealth);

		this.updateDamageVisual();

		if (this.health <= 0) {
			this.isDead = true;
		}
	}

	private updateDamageVisual() {
		const percentage = this.health / GAME_CONFIG.player.maxHealth;

		// =========================
		// NORMAL
		// =========================

		if (percentage > 0.6) {
			this.sprite.texture = this.normalTexture;
		} else {
			// =====================
			// DAMAGED VERSION
			// =====================

			this.sprite.texture = this.damagedTexture;
		}

		// FIRE
		this.damageFire.update(this.health, GAME_CONFIG.player.maxHealth);
	}
}
