class Frame {
    public rolls: [number, number];
    public type: string;
    public bonus: number;

    constructor(roll1: number, roll2: number){
        //error handling
        if (roll1 === null || roll2 === null) {
            throw new Error('Rolls cannot be empty.');
        }
        if (roll1 < 0 || roll1 > 10 || roll2 < 0 || roll2 > 10) {
            throw new Error('Roll values must be between 0 and 10.');
        }
    
        if (roll1 + roll2 > 10) {
            throw new Error('The sum of roll1 and roll2 cannot exceed 10.');
        }

        // initialization attributes:
        this.rolls = [roll1, roll2];
        this.type = 'open';
        this.bonus = 0;

        // check and update type immediately on init.
        this.checkType();
    }

    // Get total before bonuses
    getInitialTotal(): number {
        return this.rolls[0] + this.rolls[1];
    }

    // Return true if frame is a strike
    isStrike(): boolean {
        return this.rolls[0] === 10;
    }

    // Return true if frame is a spare
    isSpare(): boolean {
        return this.getInitialTotal() === 10 && !this.isStrike();
    }

    // Checks if frame is a strike or spare and updates this.type
    checkType(): void {
        if (this.isStrike()) {
            this.type = 'strike';
        } else if (this.isSpare()) {
            this.type = 'spare';
        }
    }

    // Add bonus (calculated from the next 1-2 rolls in Scorecard)
    updateBonus(bonus: number): void {
        this.bonus = bonus;
    }

    // Get the current total, inclusive of any bonuses.
    getCurrentTotal(): number {
        return this.getInitialTotal() + this.bonus;
    }
}

export default Frame;