import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPingTool } from "./tools/ping.js";
import { registerListUsersTool } from "./tools/listUsers.js";
import { registerCreateUserTool } from "./tools/createUser.js";
import { registerGetUserByIdTool } from "./tools/getUserById.js";
import { registerUpdateUserTool } from "./tools/updateUser.js";
import { registerDeleteUserTool } from "./tools/deleteUser.js";
import { registerSearchUsersTool } from "./tools/searchUsers.js";
import { registerCountUsersTool } from "./tools/countUsers.js";

const server = new McpServer({
  name: "mcp-lab",
  version: "1.0.0",
});

// Utility tools
registerPingTool(server);

// User CRUD tools
registerListUsersTool(server);
registerCreateUserTool(server);
registerGetUserByIdTool(server);
registerUpdateUserTool(server);
registerDeleteUserTool(server);
registerSearchUsersTool(server);
registerCountUsersTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ MCP server started ");
