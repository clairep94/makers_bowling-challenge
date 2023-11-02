class TenthFrameSpecial {
    public rolls: [number, number, number];
    public type: string;

    constructor(roll1: number, roll2: number, roll3: number){
        //error handling
        if (roll1 === null || roll2 === null || roll3 === null) {
            throw new Error('Rolls cannot be empty.');
        }
        if (roll1 < 0 || roll1 > 10 || roll2 < 0 || roll2 > 10 || roll3 < 0 || roll3 > 10) {
            throw new Error('Roll values must be between 0 and 10.');
        }

        // initialization attributes:
        this.rolls = [roll1, roll2, roll3];
        this.type = '';

        // check and update type immediately on init.
        this.checkType();

        //error handling
        if (this.type !== 'strike' && roll1 + roll2 > 10) {
            throw new Error('The sum of roll1 and roll2 cannot exceed 10 if roll1 is not a strike.')
        }
        if (this.type === '') {
            throw new Error('The initial frame must be a strike or a spare.');
        }
    }

    // Return true if frame is a strike
    isStrike(): boolean {
        return this.rolls[0] === 10;
    }

    // Return true if frame is a spare
    isSpare(): boolean {
        return this.rolls[0] + this.rolls[1] === 10 && !this.isStrike();
    }

    // Checks if frame is a strike or spare and updates this.type
    checkType(): void {
        if (this.isStrike()) {
            this.type = 'strike';
        } else if (this.isSpare()) {
            this.type = 'spare';
        }
    }

    // Using same method name as above so that ScoreCard use frame.getCurrentTotal() forEach frame in frames
    getCurrentTotal(): number {
        // equivalent of sum(self.rolls)
        return this.rolls.reduce((sum, roll) => sum + roll, 0);
    }

    updateBonus(): void {
        // empty method to match Frame class when used in ScoreCard
    }
}

export default TenthFrameSpecial;