## Performance Profiling

A representative combat scenario was profiled using the Chrome DevTools
Performance panel on the production build.

The profile included:

- Player movement and rotation
- Front and side weapon firing
- Multiple active enemies
- Multiple simultaneous projectiles
- Enemy AI and collision checks

The game keeps the real-time simulation inside PixiJS instead of synchronizing
entity state with React every frame.

During profiling, no continuous growth of React DOM nodes or event listeners
was observed when entering and leaving matches.

Entities and projectiles are explicitly removed when they become inactive,
and the PixiJS game instance cleans up its ticker callbacks and browser event
listeners when unmounted.

The current implementation uses simple circular collision checks, which are
appropriate for the number of simultaneous entities used by the game.