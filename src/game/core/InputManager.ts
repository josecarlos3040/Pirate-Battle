export class InputManager {
    private keys = new Set<string>();

    constructor() {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        this.keys.add(event.code);
    };

    private onKeyUp = (event: KeyboardEvent) => {
        this.keys.delete(event.code);
    };

    isPressed(code: string) {
        return this.keys.has(code);
    }

    destroy() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);

        this.keys.clear();
    }
}