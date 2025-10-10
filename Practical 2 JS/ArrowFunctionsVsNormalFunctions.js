const obj = {
    arrowFunc: () => {
        console.log("Hello from Arrow function");
    },
    normalFunc: function() {
        console.log("Hello from Normal function");
    }
};

obj.arrowFunc();
obj.normalFunc();