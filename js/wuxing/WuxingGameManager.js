import { DEPLOY, MOVE } from "../CommonNotationObjects"
import { debug } from "../GameData"
import { PaiShoMarkingManager } from "../pai-sho-common/PaiShoMarkingManager"
import { setGameLogText } from "../PaiShoMain"
import { WuxingActuator } from "./WuxingActuator"
import { WuxingBoard } from "./WuxingBoard"
import { WuxingNotationMove } from "./WuxingNotation"
import { WuxingBoardPoint } from "./WuxingPointBoard.js"
import { WuxingTileManager } from "./WuxingTileManager"

export class WuxingGameManager {

    /** @type {string} */
    gameLogText

    /** @type {boolean} */
    isCopy

    /** @type {WuxingActuator} */
    actuator

    /** @type {WuxingTileManager} */
    tileManager

    /** @type {WuxingBoard} */
    board

    /** @type {WuxingTileManager} */
    tileManager

    /** @type {PaiShoMarkingManager} */
    markingManager

    /** @type {string} */
    lastPlayerName

    constructor( actuator, ignoreActuate, isCopy ) {
        this.gameLogText = ''
        this.isCopy = isCopy
        this.actuator = actuator

        this.tileManager = new WuxingTileManager()
        this.markingManager = new PaiShoMarkingManager()

        this.setup(ignoreActuate)
    }

    /** Set up the game */
    setup(ignoreActuate) {
        this.board = new WuxingBoard()

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    /**
     * @param {*} moveToAnimate 
     */
    actuate(moveToAnimate) {
        if (this.isCopy) return

        this.actuator.actuate(this.board, this.tileManager, this.markingManager, moveToAnimate)
        setGameLogText(this.gameLogText)
    }

    /**
     * 
     * @param {WuxingBoardPoint} boardPoint 
     * @param {boolean} ignoreActuate 
     */
    revealPossibleMovePoints(boardPoint, ignoreActuate) {
        if (!boardPoint.hasTile()) return

        this.board.setPossibleMovePoints(boardPoint)

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    revealDeployPoints(player, tileCode, ignoreActuate) {
        this.board.setDeployPointsPossibleMoves(player, tileCode)

        if (!ignoreActuate) {
            this.actuate()
        }
    }

    hidePossibleMovePoints(ignoreActuate) {
        this.board.removePossibleMovePoints()
        this.tileManager.removeSelectedTileFlags()
        if (!ignoreActuate) {
            this.actuate()
        }
    }

    cleanup() {
    }

    /**
     * 
     * @param {WuxingNotationMove} move Move to play
     */
    runNotationMove(move, withActuate) {
        debug("From WuxingGameManager.js")
        debug("Running Move: " + move.fullMoveText + " Move type: " + move.moveType);

        //TODO: DO NOTATION MOVES
        if (move.moveType == MOVE) {
            let moveResults = this.board.moveTile(move.playerCode, move.startPoint, move.endPoint)

            // Did we capture a tile?
            if (moveResults && moveResults.capturedTile) {
                let capturedTile = moveResults.capturedTile
                this.tileManager.addToCapturedTiles( capturedTile, move.playerCode )
            }

            this.board.checkForEndGame(this.tileManager)
        }
        else if (move.moveType == DEPLOY) {
            let tile = this.tileManager.grabTile(move.playerCode, move.tileType)
            this.board.placeTile(tile, move.endPoint)
        }


        if (withActuate) {
            this.actuate()
        }

        this.lastPlayerName = move.playerCode
    }

    hasEnded() {
        return this.board.winners.length > 0
    }

    getWinner() {
        if (this.board.winners.length === 1) {
            return this.board.winners[0];
        } else if (this.board.winners.length > 1) {
            return "BOTH players";
        }
    }

    getWinReason() {
        return this.board.winnerReason
    }
}