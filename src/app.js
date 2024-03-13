// This is a dummy JavaScript file

// Define a function to greet the user
function greet(name) {
    console.log("Hello, " + name + "!");
}

// Call the greet function with a sample name
greet("John");

// Define an array of numbers
const numbers = [1, 2, 3, 4, 5];

// Calculate the sum of the numbers in the array
const sum = numbers.reduce((total, num) => total + num, 0);
console.log("The sum of the numbers is: " + sum);

// Define an object representing a person
const person = {
    name: "Alice",
    age: 30,
    occupation: "Engineer"
};

// Log information about the person
console.log("Person: ", person);

// Define a class to represent a car
class Car {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }

    displayInfo() {
        console.log(`Car: ${this.year} ${this.make} ${this.model}`);
    }
}

// Create a new instance of Car
const myCar = new Car("Toyota", "Camry", 2022);
myCar.displayInfo();

// Define a function to generate a random number between min and max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate and log a random number
const randomNumber = getRandomNumber(1, 100);
console.log("Random Number: " + randomNumber);
