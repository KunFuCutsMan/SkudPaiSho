/* Wuxing Pai Sho */

import { GUEST, HOST } from "../CommonNotationObjects.js";
import { BRAND_NEW, currentMoveIndex, GameType, isAnimationsOn, rerunAll } from "../PaiShoMain";
import { WuxingActuator } from "./WuxingActuator.js";
import { WuxingGameManager } from "./WuxingGameManager.js";
import { WuxingGameNotation, WuxingNotationBuilder } from "./WuxingNotation.js";

export class WuxingController {

    /** @type {WuxingActuator} */
    actuator

    /** @type {WuxingGameManager} */
    theGame

    /** @type {WuxingNotationBuilder} */
    notationBuilder

    /** @type {WuxingGameNotation} */
    gameNotation

    isPaiShoGame = true

    /**
     * NOTE: The parameter's documentation was taken from GameControllerInterfaceReadme.md
     * @param {HTMLDivElement} gameContainer This is the div element that your game needs to be put in
     * @param {boolean} isMobile Boolean flag for if running on mobile device
     */
    constructor(gameContainer, isMobile) {
        this.actuator = new WuxingActuator(gameContainer, isMobile, isAnimationsOn())

        this.resetGameManager()
        this.resetNotationBuilder()
        this.resetGameNotation()

        this.hostAccentTiles = []
        this.guestAccentTiles = []
    }

    /**
     * Returns the GameType id for your game.
     * Add your game to GameType in PaiShoMain.js.
     */
    getGameTypeId() {
        return GameType.WuxingPaiSho.id
    }

    completeSetup() {

        rerunAll()
        this.callActuate()
    }

    /**
     * Called when rewinding moves.
     */
    resetGameManager() {
        this.theGame = new WuxingGameManager(this.actuator)
    }

    /**
     * Called when rewinding moves.
     */
    resetNotationBuilder() {
        this.notationBuilder = new WuxingNotationBuilder()
    }

    resetGameNotation() {
        this.gameNotation = this.getNewGameNotation()
    }

    getNewGameNotation() {
        return new WuxingGameNotation()
    }

    /**
     * Called when the game should re-render.
     */
    callActuate() {
        this.theGame.actuate()
    }

    /**
     * Called when the user's move needs to be reset, from clicking the Undo Move link.
     */
    resetMove() {
        if (this.notationBuilder.status === BRAND_NEW) {
            this.gameNotation.removeLastMove()
        }

        rerunAll()
    }

    cleanup() {}

    isSolitaire() {
        return false
    }

    getCurrentPlayer() {
        if (currentMoveIndex % 2 == 0) return GUEST
        return HOST
    }

    /* DISPLAY METHODS */

    /**
     * Should return the default string of the html content to put in the Help tab.
     * @returns {string}
     */
    getDefaultHelpMessageText() {
        return "asasasa"
    }

    

    getAdditionalMessage() {
        return ""
    }

    /* STATIC METHODS */

    /**
     * Returns the html representation of the inital tiles found at the beginning of the game for host.
     * Each tile is an empty div with a class that identifies them as the corresponding tile
     * @returns {string}
     * */
    static getHostTilesContainerDivs() {
        return ""
    }

    /**
     * Returns the html representation of the inital tiles found at the beginning of the game for guest.
     * Each tile is an empty div with a class that identifies them as the corresponding tile
     * @returns {string}
     * */
    /** @returns {string} */
    static getGuestTilesContainerDivs() {
        return ""
    }
}