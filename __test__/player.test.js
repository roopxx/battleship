import { Player } from "../src/player";

let playerOne, playerTwo;

beforeEach(() => {
  playerOne = new Player("User", true);
  playerTwo = new Player("Computer");
  playerOne.opponent = playerTwo;
  playerTwo.opponent = playerOne;
});

describe("A Player can attack opponent board", () => {
  test("Player attacking his/her opponent's board ", () => {
    expect(playerOne.attackOpponent([3, 4])).toEqual([false, [3, 4], false]);
  });

  test("Players cannot attack on his/her opponent's board twice ", () => {
    playerOne.attackOpponent([3, 4]);
    expect(playerOne.attackOpponent([3, 6])).toEqual("Not your turn!!!");
    playerTwo.attackOpponent([3, 4]);
    expect(playerTwo.attackOpponent([3, 6])).toEqual("Not your turn!!!");
  });

  test("Players can switch turns", () => {
    playerOne.attackOpponent([3, 4]);
    expect(playerTwo.attackOpponent([3, 6])).toEqual([false, [3, 6], false]);
    playerOne.attackOpponent([5, 7]);
    expect(playerTwo.attackOpponent([7, 5])).toEqual([false, [7, 5], false]);
  });
});

describe("Prevent players from making wrong moves", () => {
  test("Preventing attacks which lies outside the boundaries - horizontally", () => {
    expect(playerOne.attackOpponent([1, 10])).toEqual(
      "Your attack is out of boundaries"
    );

    expect(playerOne.attackOpponent([1, -10])).toEqual(
      "Your attack is out of boundaries"
    );
  });

  test("Preventing attacks which lies outside the boundaries -vertically", () => {
    expect(playerOne.attackOpponent([12, 7])).toEqual(
      "Your attack is out of boundaries"
    );

    expect(playerOne.attackOpponent([-1, 1])).toEqual(
      "Your attack is out of boundaries"
    );
  });
});
