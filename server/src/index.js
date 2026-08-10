// server.js
import "./env.js";

import http from "http";
import app from "./app.js";
import { setupWebSocketServer } from "./websocket.js";

const PORT = process.env.PORT || 7000;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
	try {
		// 1. Initialize databases & vector stores
		await app.ready();

		// 2. Wrap Express app with HTTP server
		const server = http.createServer(app);

		// 3. Attach WebSockets to the HTTP server
		setupWebSocketServer(server);

		// 4. Start listening on single port
		server.listen(PORT, HOST, () => {
			console.log(`HTTP Server running on http://${HOST}:${PORT}`);
			console.log(`WebSocket Server running on ws://${HOST}:${PORT}`);
		});
	} catch (error) {
		console.error("Failed to start server:", error);
		process.exit(1);
	}
};

startServer();
