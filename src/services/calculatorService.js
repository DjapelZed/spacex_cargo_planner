class CalculatorService {
    MAX_UNIT_POWER = 10

    getCargoBaysCountByBoxes(boxes) {
        const boxesValues = boxes
                            .split(",")
                            .map(box => parseFloat(box));
        const boxesSum = boxesValues.reduce((prev, curr) => prev + curr, 0);
        const baysCount = Math.ceil(boxesSum / this.MAX_UNIT_POWER);
        return baysCount;
    }
}

export default CalculatorService;