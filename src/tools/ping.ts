import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerPingTool(server: McpServer) {
  server.tool(
    "ping",          // tool name (what the LLM sees)
    {},              // params schema (empty -> no args)
    async () => {
      if (!canExecute("ping", Current_Role)) {
        return {
          content: [
            {
              type: "text",
              text: "Permission denied: current role is not allowed to execute ping."
            }
          ]
        };
      }
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
