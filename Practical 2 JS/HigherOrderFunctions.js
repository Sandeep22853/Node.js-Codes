function calculate(operation, a, b) {
    return operation(a, b);
}

function add(x, y) {
    return x + y;
}

function subtract(x, y) {
    return x - y;
}

console.log(calculate(add, 10, 5));
console.log(calculate(subtract, 10, 5));
console.log(calculate((x, y) => x * y, 4, 5));
console.log(calculate((x, y) => x / y, 20, 4));