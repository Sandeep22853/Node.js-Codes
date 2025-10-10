This project demonstrates several advanced Node.js features:

HTTP Server with Dynamic Imports: An HTTP server that uses dynamic import() with top-level await to load modules on-demand.

Efficient Stream Processing: A script that processes a large CSV file using Node.js streams (pipeline, readline, Transform) to count user email domains without loading the entire file into memory. This approach effectively handles backpressure.

EventEmitter-based Logger: A custom logger built on EventEmitter with support for multiple transports (e.g., console, file) and features size-based automatic log rotation.

1. Prerequisites
Node.js version 14.8.0 or higher (for top-level await support in ECMAScript Modules).

2. Start the Server
Open your terminal, navigate to the project's root directory, and run the following command:

3. Use the Endpoints
You can use a web browser or a tool like curl to interact with the server.

Trigger Logging:
Visit http://localhost:3000/log or run curl http://localhost:3000/log.
This will dynamically import the logger and write logs to both the console and the logs/server.log file. If the log file exceeds 50KB, it will be automatically rotated (e.g., to server.log.1).

Trigger CSV Processing:
Visit http://localhost:3000/process or run curl http://localhost:3000/process.
This will dynamically import the CSV processor. It will read data/users.csv as a stream, count the email domains, and write the aggregated results to out/domains.json without overwhelming the system's memory. The server will respond once the process is complete.

Home:
Visit http://localhost:3000/ to see a welcome message.