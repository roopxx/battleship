import { Ship } from "../src/ship";

let shipTwo, shipThree, shipFive;

beforeEach(() => {
  shipTwo = new Ship(2);
  shipThree = new Ship(3);
  shipFive = new Ship(5);
});

test("Ship class instance generation", () => {
  expect(shipTwo).toBeDefined();
  expect(shipThree).toBeDefined();
  expect(shipFive).toBeDefined();
});

test("Ship class instance gets it's correct ship name", () => {
  expect(shipTwo.shipName).toBe("Destroyer");
  expect(shipThree.shipName).toBe("Submarine");
  expect(shipFive.shipName).toBe("Carrier");
});

test("ship instance has correct length as defined", () => {
  expect(shipThree.length).toBe(3);
  expect(shipTwo.length).toBe(2);
  expect(shipFive.length).toBe(5);
});

test("ship instance has 0 hits taken initially", () => {
  expect(shipThree.hitsTaken).toBe(0);
});

test("ship instance hits taken increases when it get hits", () => {
  shipThree.hit();
  expect(shipThree.hitsTaken).toBe(1);
  shipThree.hit();
  expect(shipThree.hitsTaken).toBe(2);
});

test("ship instance is sunk when hits taken is equal to its length", () => {
  shipThree.hit();
  shipThree.hit();
  shipThree.hit();
  expect(shipThree.isSunk()).toBe(true);
});

test("ship instance can switch its direction", () => {
  expect(shipTwo.switchDirection()).toBe("vertical");
  expect(shipFive.switchDirection()).toBe("vertical");
  expect(shipTwo.switchDirection()).toBe("horizontal");
});
