import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPingTool } from "./tools/ping.js";
import { registerListUsersTool } from "./tools/listUsers.js";

const server = new McpServer({
  name: "mcp-lab",
  version: "1.0.0",
});

registerPingTool(server);
registerListUsersTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);


console.error("✅ MCP server started ");