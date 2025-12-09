import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPingTool(server: McpServer) {
  server.tool(
    "ping",          // tool name (what the LLM sees)
    {},              // params schema (empty -> no args)
    async () => {
      return {
        content: [
          {
            type: "text",
            text: "pong",
          },
        ],
      };
    }
  );
}
