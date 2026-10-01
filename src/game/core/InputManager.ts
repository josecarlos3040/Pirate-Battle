export class InputManager {
	private keys = new Set<string>();

	constructor() {
		window.addEventListener('keydown', this.onKeyDown);

		window.addEventListener('keyup', this.onKeyUp);
	}

	private onKeyDown = (event: KeyboardEvent) => {
		const gameKeys = ['KeyW', 'KeyA', 'KeyD', 'Space', 'KeyQ', 'KeyE', 'Escape'];

		if (gameKeys.includes(event.code)) {
			event.preventDefault();
		}

		this.keys.add(event.code);
	};

	private onKeyUp = (event: KeyboardEvent) => {
		this.keys.delete(event.code);
	};

	isPressed(code: string) {
		return this.keys.has(code);
	}

	clear() {
		this.keys.clear();
	}

	destroy() {
		window.removeEventListener('keydown', this.onKeyDown);

		window.removeEventListener('keyup', this.onKeyUp);

		this.clear();
	}
}
