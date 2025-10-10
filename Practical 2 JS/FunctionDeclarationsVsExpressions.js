console.log(add(2, 3));

function add(a, b) {
    return a + b;
}

console.log(add(5, 7));

try {
    console.log(multiply(2, 3));
} catch (err) {
    console.log("Error with function expression:", err.message);
}

const multiply = function(a, b) {
    return a * b;
};

console.log(multiply(4, 5));