import type {
    Texture
} from "pixi.js";


export type IslandTextures = {
    topLeft: Texture;
    topCenter: Texture;
    topRight: Texture;

    middleLeft: Texture;
    center: Texture;
    middleRight: Texture;

    bottomLeft: Texture;
    bottomCenter: Texture;
    bottomRight: Texture;
};


export type HudTextures = {
    healthFrame: Texture;

    healthFillGreen: Texture;
    healthFillAmber: Texture;
    healthFillRed: Texture;

    heartIcon: Texture;

    counterPanel: Texture;
    scoreIcon: Texture;
    timeIcon: Texture;

    pauseButtonNormal: Texture;
    pauseButtonHover: Texture;
    pauseButtonPressed: Texture;

    pauseIcon: Texture;
};


export type GameAssets = {

    // SHIPS

    playerShip: Texture;
    playerShipDamaged: Texture;

    chaserShip: Texture;
    chaserShipDamaged: Texture;

    shooterShip: Texture;
    shooterShipDamaged: Texture;


    // PROJECTILES

    cannonball: Texture;


    // EFFECTS

    explosionFrames:
        Texture[];

    fireFrames:
        Texture[];


    // WORLD

    water:
        Texture;

    island:
        IslandTextures;


    // HUD

    hud:
        HudTextures;
};