import type { PointerEvent } from 'react';

type MobileControlsProps = {
	onPause: () => void;
};

export function MobileControls({ onPause }: MobileControlsProps) {
	const pressKey = (code: string) => {
		window.dispatchEvent(
			new KeyboardEvent('keydown', {
				code,
			}),
		);
	};

	const releaseKey = (code: string) => {
		window.dispatchEvent(
			new KeyboardEvent('keyup', {
				code,
			}),
		);
	};

	const getButtonEvents = (code: string) => ({
		onPointerDown: (event: PointerEvent) => {
			event.preventDefault();

			pressKey(code);
		},

		onPointerUp: (event: PointerEvent) => {
			event.preventDefault();

			releaseKey(code);
		},

		onPointerCancel: () => {
			releaseKey(code);
		},

		onPointerLeave: () => {
			releaseKey(code);
		},
	});

	return (
		<div
			className="
                mobile-controls
            "
		>
			<button
				className="
                    mobile-pause
                "
				aria-label="Pause game"
				onClick={onPause}
			>
				II
			</button>

			<div
				className="
                    mobile-movement
                "
			>
				<button
					aria-label="
                        Rotate left
                    "
					{...getButtonEvents('KeyA')}
				>
					←
				</button>

				<button
					aria-label="
                        Move forward
                    "
					{...getButtonEvents('KeyW')}
				>
					↑
				</button>

				<button
					aria-label="
                        Rotate right
                    "
					{...getButtonEvents('KeyD')}
				>
					→
				</button>
			</div>

			<div
				className="
                    mobile-weapons
                "
			>
				<button
					aria-label="
                        Fire left cannons
                    "
					{...getButtonEvents('KeyQ')}
				>
					L
				</button>

				<button
					aria-label="
                        Fire front cannon
                    "
					{...getButtonEvents('Space')}
				>
					FIRE
				</button>

				<button
					aria-label="
                        Fire right cannons
                    "
					{...getButtonEvents('KeyE')}
				>
					R
				</button>
			</div>
		</div>
	);
}
