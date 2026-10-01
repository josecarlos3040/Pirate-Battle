import { Container, Sprite } from 'pixi.js';

import type { Texture } from 'pixi.js';

import { GAME_CONFIG } from '../config/gameConfig';

import { HealthBar } from '../ui/HealthBar';

import { DamageFire } from '../effects/DamageFire';

export class Shooter {
	public readonly container: Container;

	public readonly collisionRadius = 30;

	public health: number = GAME_CONFIG.shooter.maxHealth;

	public isDead = false;

	private sprite: Sprite;

	private healthBar: HealthBar;

	private damageFire: DamageFire;

	private normalTexture: Texture;

	private damagedTexture: Texture;

	private speed = GAME_CONFIG.shooter.movementSpeed;

	private rotationSpeed = GAME_CONFIG.shooter.rotationSpeed;

	private shootCooldown = 0;

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
		// SHIP
		// ================================

		this.sprite = new Sprite(this.normalTexture);

		this.sprite.anchor.set(0.5);

		this.sprite.rotation = Math.PI;

		this.sprite.width = 65;

		this.sprite.height = 90;

		this.container.addChild(this.sprite);

		// ================================
		// FIRE
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

		this.healthBar.update(this.health, GAME_CONFIG.shooter.maxHealth);

		this.updateDamageVisual();
	}

	// ==================================
	// UPDATE
	// ==================================

	public update(deltaTime: number, playerX: number, playerY: number): boolean {
		if (this.isDead) {
			return false;
		}

		// ================================
		// COOLDOWN
		// ================================

		if (this.shootCooldown > 0) {
			this.shootCooldown -= deltaTime;
		}

		// ================================
		// PLAYER DIRECTION
		// ================================

		const dx = playerX - this.container.x;

		const dy = playerY - this.container.y;

		const distance = Math.sqrt(dx * dx + dy * dy);

		const targetRotation = Math.atan2(dx, -dy);

		let rotationDifference = targetRotation - this.container.rotation;

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
		// MOVE TOWARD PLAYER
		// ================================

		if (distance > GAME_CONFIG.shooter.attackRange) {
			this.container.x += Math.sin(this.container.rotation) * this.speed * deltaTime;

			this.container.y -= Math.cos(this.container.rotation) * this.speed * deltaTime;

			return false;
		}

		// ================================
		// FIRE
		// ================================

		if (this.shootCooldown <= 0) {
			this.shootCooldown = GAME_CONFIG.shooter.weapon.cooldown;

			return true;
		}

		return false;
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

		this.healthBar.update(this.health, GAME_CONFIG.shooter.maxHealth);

		this.updateDamageVisual();

		if (this.health <= 0) {
			this.isDead = true;
		}
	}

	// ==================================
	// DAMAGE VISUAL
	// ==================================

	private updateDamageVisual() {
		const percentage = this.health / GAME_CONFIG.shooter.maxHealth;

		// ------------------------------
		// NORMAL SHIP
		// ------------------------------

		if (percentage > 0.6) {
			this.sprite.texture = this.normalTexture;
		} else {
			// --------------------------
			// DAMAGED SHIP
			// --------------------------

			this.sprite.texture = this.damagedTexture;
		}

		// Mantém tamanho mesmo se
		// textura danificada tiver
		// dimensões diferentes.
		this.sprite.width = 65;

		this.sprite.height = 90;

		this.damageFire.update(this.health, GAME_CONFIG.shooter.maxHealth);
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
