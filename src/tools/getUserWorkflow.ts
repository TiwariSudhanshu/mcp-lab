import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getUserWorkflowState } from "../resources/userWorkFlows.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerGetUserWorkflowTool(server: McpServer) {
  server.tool(
    "get_user_workflow",
    {
      userId: z.string().describe("The ID of the user to get workflow state for")
    },
    async ({ userId }) => {
      if (!canExecute("get_user_workflow", Current_Role)) {
        return {
          content: [
            { type: "text", text: "Permission denied: cannot read user workflow state." }
          ]
        };
      }

      const data = await getUserWorkflowState(userId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2)
          }
        ]
      };
    }
  );
}
