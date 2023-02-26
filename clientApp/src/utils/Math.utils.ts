export class MathUtils {
  /**
   * @description Gets random integer between the range (inclusive)
   * @param {Number} from
   * @param {Number} to
   */
  static getRandomInt(from: number, to: number) {
    from = Math.ceil(from);
    to = Math.floor(to);
    return Math.floor(Math.random() * (to - from + 1)) + from;
  }

  /**
   * @description Gets random value from the list
   * @param {Number[]} list
   * @returns {number}
   */
  static getRandomFromList(list: number[]) {
    return list[MathUtils.getRandomInt(0, list.length - 1)];
  }

  /**
   * @description Gets random integer between the range (inclusive) excluding specified Set
   * @param {Number} from
   * @param {Number} to
   * @param {Set<Number>} excluded
   */
  static getRandomWithoutExcluded(from: number, to: number, excluded: Set<number>) {
    while (true) {
      const random = MathUtils.getRandomInt(from, to);
      if (!excluded.has(random)) return random;
    }
  }

  /**
   * @description Generates number iterator between the range (inclusive)
   * @param {Number} from
   * @param {Number} to
   * @returns {Symbol.iterator}
   */
  static *numbers(from: number, to: number) {
    for (let i = from; i <= to; i++) yield i;
  }

  /**
   * @description Generates numbers between the range (inclusive)
   * @param {Number} from
   * @param {Number} to
   * @returns {Number[]}
   */
  static numberList(from: number, to: number) {
    /** @type {Number[]} */
    const nums = [];
    for (let i = from; i <= to; i++) nums.push(i);
    return nums;
  }

  /**
   * @param {Number} value
   * @param {Number} percent
   */
  static percent(value: number, percent: number) {
    return (value * percent) / 100;
  }

  static generateMatrix(rows: number, cols: number) {
    return Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(0));
  }
}
