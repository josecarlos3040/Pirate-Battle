import { Container, Sprite } from 'pixi.js';

import type { Texture } from 'pixi.js';

import { GAME_CONFIG } from '../config/gameConfig';

import { HealthBar } from '../ui/HealthBar';

import { DamageFire } from '../effects/DamageFire';

export class Chaser {
	public readonly container: Container;

	public readonly collisionRadius = 30;

	public health: number = GAME_CONFIG.chaser.maxHealth;

	public isDead = false;

	private sprite: Sprite;

	private healthBar: HealthBar;

	private damageFire: DamageFire;

	private normalTexture: Texture;

	private damagedTexture: Texture;

	private speed = GAME_CONFIG.chaser.movementSpeed;

	private rotationSpeed = GAME_CONFIG.chaser.rotationSpeed;

	constructor(
		x: number,
		y: number,

		texture: Texture,
		damagedTexture: Texture,

		fireTextures: Texture[],
	) {
		this.container = new Container();

		this.container.position.set(x, y);

		this.normalTexture = texture;

		this.damagedTexture = damagedTexture;

		// ================================
		// SHIP SPRITE
		// ================================

		this.sprite = new Sprite(this.normalTexture);

		this.sprite.anchor.set(0.5);

		// Ajuste caso o sprite esteja
		// virado para o lado contrário.
		this.sprite.rotation = Math.PI;

		this.sprite.width = 65;

		this.sprite.height = 90;

		this.container.addChild(this.sprite);

		// ================================
		// DAMAGE FIRE
		// ================================

		this.damageFire = new DamageFire(fireTextures);

		this.damageFire.setRandomOffset(-12, 12, -16, 14);

		this.container.addChild(this.damageFire.container);

		// ================================
		// HEALTH BAR
		// ================================

		this.healthBar = new HealthBar(55, 6);

		this.healthBar.container.position.set(0, -55);

		this.container.addChild(this.healthBar.container);

		this.healthBar.update(this.health, GAME_CONFIG.chaser.maxHealth);

		this.updateDamageVisual();
	}

	// ==================================
	// UPDATE
	// ==================================

	public update(deltaTime: number, playerX: number, playerY: number) {
		if (this.isDead) {
			return;
		}

		const dx = playerX - this.container.x;

		const dy = playerY - this.container.y;

		// Rotação necessária para apontar
		// o navio para o player.
		const targetRotation = Math.atan2(dx, -dy);

		let rotationDifference = targetRotation - this.container.rotation;

		// Normaliza para -PI / PI.
		rotationDifference = Math.atan2(
			Math.sin(rotationDifference),

			Math.cos(rotationDifference),
		);

		const maxRotation = this.rotationSpeed * deltaTime;

		rotationDifference = Math.max(
			-maxRotation,

			Math.min(maxRotation, rotationDifference),
		);

		this.container.rotation += rotationDifference;

		// ================================
		// FORWARD MOVEMENT
		// ================================

		this.container.x += Math.sin(this.container.rotation) * this.speed * deltaTime;

		this.container.y -= Math.cos(this.container.rotation) * this.speed * deltaTime;
	}

	// ==================================
	// DAMAGE
	// ==================================

	public takeDamage(amount: number) {
		if (this.isDead) {
			return;
		}

		this.health -= amount;

		if (this.health < 0) {
			this.health = 0;
		}

		this.healthBar.update(this.health, GAME_CONFIG.chaser.maxHealth);

		this.updateDamageVisual();

		if (this.health <= 0) {
			this.isDead = true;
		}
	}

	// ==================================
	// DAMAGE VISUAL
	// ==================================

	private updateDamageVisual() {
		const percentage = this.health / GAME_CONFIG.chaser.maxHealth;

		// ------------------------------
		// HEALTHY
		// ------------------------------

		if (percentage > 0.6) {
			this.sprite.texture = this.normalTexture;
		} else {
			// --------------------------
			// DAMAGED SHIP
			// --------------------------

			this.sprite.texture = this.damagedTexture;
		}

		// Garante que mudar a textura
		// não altere o tamanho do barco.
		this.sprite.width = 65;

		this.sprite.height = 90;

		// Controla fogo com base no HP.
		this.damageFire.update(this.health, GAME_CONFIG.chaser.maxHealth);
	}

	// ==================================
	// DESTROY
	// ==================================

	public destroy() {
		this.damageFire.destroy();

		this.container.destroy({
			children: true,
		});
	}
}
