import Frame from '../lib/frame';
import TenthFrameSpecial from '../lib/tenthframe';

/*
10 Pin Scoring Rules:

Every frame is 1-2 rolls
    Open Frame(a, b) -> Less than 10 pins -> (a + b);
    Spare(a, b = 10) -> 10 pins over 2 rolls -> (10) + (a);
    Strike(a=10) -> 10 pins over 1 roll -> (10) + (a + b) or (10) + (10) + (b);

    For the 10th frame, if the player rolls a strike or spare, they can roll again for the bonus
*/

interface ScoreCardObject {
    number: number;
    rolls: number[];
    type: string;
    frameScore: number;
}

class ScoreCard {
    frames: (Frame | TenthFrameSpecial)[];

    constructor() {
        this.frames = [];
    }

    // ADDING FRAMES:
    addFrame(frame: Frame | TenthFrameSpecial) {
        this.frames.push(frame);
    }

    // ======= SHOWING THE SCORECARD ================= //

    // SCORECARD:
    showScoreCard(): ScoreCardObject[] {
        // bowling scorecard shows the cumulative score after each frame.
        let scorecard: ScoreCardObject[] = [];
        let cumulative_score = 0;


        this.frames.forEach((frame: Frame | TenthFrameSpecial) => {
            cumulative_score += this.getFrameTotal(frame);

            const frameScoreCard: ScoreCardObject = {
                number: this.frames.indexOf(frame) + 1,  // 1-10
                rolls: frame.rolls,
                type: frame.type, // open, spare, strike
                frameScore: cumulative_score,
            };
            scorecard.push(frameScoreCard);
        });
        return scorecard;
    }

    // ======= GET THE TOTAL SCORE ================= //

    // GET GAME TOTAL:
    getGameTotal(): number {
        let total = 0;
        // getFrameTotal each frame from this.frames
        // Add total of each frame
        this.frames.forEach((frame: Frame | TenthFrameSpecial) => {
            total += this.getFrameTotal(frame);
        });
        return total;
    }

    // ------------- supportive functions: ----------------------  //

    // GET FRAME TOTAL:
    getFrameTotal(frame: Frame | TenthFrameSpecial): number {
        // Checks for and adds bonuses for the following conditions:
        // Frames 1-9: strike or spare

        // No bonus updates for the following conditions:
        // Frames 1-10: open
        // Frame 10: strike or spare

        if (!(frame instanceof TenthFrameSpecial)) {
            this.checkForBonus(frame);
        }

        return frame.getCurrentTotal();
    }

    // CHECK FOR BONUSES:
    checkForBonus(frame: Frame): void {
        // Updates the bonus of each frame depending on the frame type
        // Use for frames 1-9. If 10th frame is special, just use frame.getCurrentTotal()
        
        // if frame type is spare, try get spare bonus if the next roll has happened
        if (frame.type === 'spare') {
            this.getSpareBonus(frame)

        // if frame type is strike, try to get the bonus if the next 1 or 2 rolls have happened.
        } else if (frame.type === 'strike') {
            this.getStrikeBonus(frame)
        }
    }

    // GETTING SPARE BONUS:
    getSpareBonus(frame: Frame | TenthFrameSpecial): number {
        let bonus = 0;
        // find the index of the current frame
        const thisFrameIndex = this.frames.indexOf(frame);
        // find the next frame
        const nextFrame = this.frames[thisFrameIndex + 1];

        // If nextFrame has happened:
        if (nextFrame !== undefined) {
            // find the first roll of the next frame
            bonus += nextFrame.rolls[0];
            // update the frame bonus
            frame.updateBonus(bonus);
        }
        // no bonus added if next roll hasn't happened yet.

        return bonus;
    }

    // GETTING STRIKE BONUS:
    getStrikeBonus(frame: Frame | TenthFrameSpecial): number {
        let bonus = 0;
        // find the index of the current frame
        const thisFrameIndex = this.frames.indexOf(frame);
        // find the next frame
        const nextFrame = this.frames[thisFrameIndex + 1];

        // If nextFrame has happened:
        if (nextFrame !== undefined) {
            // Add the first roll to the bonus. This is roll 1/2 of a strike bonus.
            bonus += nextFrame.rolls[0];

            // ========= Finding roll 2/2 of the strike bonus:===========

            // CASE 1: if the nextFrame is a strike AND is NOT frame 10 (thisFrame is NOT frame 9):
            if (nextFrame.type === 'strike' && thisFrameIndex !== 8) {
                const nextNextFrame = this.frames[thisFrameIndex + 2];

                // Try to find the nextNextFrame:
                // This allows the score to be updated for a frame sequence STRIKE, STRIKE, No roll yet.
                if (nextNextFrame !== undefined) {
                    bonus += nextNextFrame.rolls[0];
                } // no bonus added if the nextNextFrame hasn't happened yet.

            // CASE 2: nextFrame is NOT a strike OR nextFrame IS a strike on frame 10:
            // If pattern is Strike + Spare || Strike + Open || Strike + 10th Frame special
            } else {
                // Add the second roll to the bonus. This is roll 2/2 of the strike bonus.
                bonus += nextFrame.rolls[1];
            }
        } // no bonus added if nextFrame hasn't happened yet.

        // update the bonus of this frame with the cumulated bonus:
        frame.updateBonus(bonus);
        return bonus;
    }

}

export default ScoreCard;
