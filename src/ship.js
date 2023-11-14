// Basic ship class representing a ship with length, name, hits taken, sunk status, and direction
class Ship {
  // Constructor for creating a ship with a specified length and optional direction
  constructor(length, direction = "horizontal") {
    // Assign a random name to the ship based on its length
    this.shipName = [
      "Carrier",
      "Battleship",
      "Destroyer",
      "Submarine",
      "Patrol Boat",
    ][length % 6];

    // Initialize ship properties
    this.length = length;
    this.hitsTaken = 0;
    this.sunk = false;
    this.direction = direction;
  }

  // Method to register a hit on the ship
  hit() {
    // Increment the hits taken by 1
    if (this.hitsTaken < this.length) {
      this.hitsTaken += 1;
    }

    // Check if the ship is sunk after the hit
    this.isSunk();
  }

  // Method to check if the ship is sunk
  isSunk() {
    // Update the sunk status based on the number of hits taken
    return (this.sunk = this.hitsTaken === this.length);
  }

  // Method to switch the direction of the ship (horizontal to vertical or vice versa)
  switchDirection() {
    // Toggle the direction between horizontal and vertical
    this.direction =
      this.direction === "horizontal" ? "vertical" : "horizontal";

    // Return the updated direction
    return this.direction;
  }
}

// Export the Ship class for use in other modules
export { Ship };
