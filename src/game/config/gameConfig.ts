export const GAME_CONFIG = {
    arena: {
        width: 1920,
        height: 1080,
    },

    match: {
        duration: 120,
        enemySpawnInterval: 3,
    },

    player: {
        maxHealth: 100,

        movementSpeed: 250,
        rotationSpeed: 2.5,

        frontWeapon: {
            damage: 25,
            projectileSpeed: 700,
            projectileLifetime: 1.5,
            cooldown: 0.4,
        },

        sideWeapon: {
            damage: 20,
            projectileSpeed: 650,
            projectileLifetime: 1.5,
            cooldown: 1,
            projectileCount: 3,
        },
    },

    chaser: {
        maxHealth: 50,
        movementSpeed: 150,
        rotationSpeed: 2,
        collisionDamage: 25,
    },

    shooter: {
        maxHealth: 60,
        movementSpeed: 100,
        rotationSpeed: 1.5,

        attackRange: 400,

        weapon: {
            damage: 15,
            projectileSpeed: 400,
            projectileLifetime: 2,
            cooldown: 1.5,
        },
    },
} as const;