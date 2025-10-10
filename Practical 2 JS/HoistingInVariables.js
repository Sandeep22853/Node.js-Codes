console.log(a);
var a = 10;

try {
    console.log(b);
    let b = 20;
} catch (err) {
    console.log("Error with let:", err.message);
}

try {
    console.log(c);
    const c = 30;
} catch (err) {
    console.log("Error with const:", err.message);
}