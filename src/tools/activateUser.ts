import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerActivateUserTool(server: McpServer) {
  server.tool(
    "activate_user",
    {
      userId: z.string().describe("The ID of the user to activate")
    },
    async ({ userId }) => {
      // 1) Permission check
      if (!canExecute("activate_user", Current_Role)) {
        return {
          content: [
            { type: "text", text: "Permission denied: cannot activate user." }
          ]
        };
      }

      // 2) Read current user status from DB
      const { data, error } = await supabase
        .from("users")
        .select("status")
        .eq("id", userId)
        .single();

      if (error) throw new Error(error.message);

      // 3) Enforce workflow rule: only 'verified' → 'active'
      if (data.status !== "verified") {
        throw new Error(
          `Invalid transition: cannot activate user in '${data.status}' state`
        );
      }

      // 4) Actually update DB
      const { error: updateError } = await supabase
        .from("users")
        .update({ status: "active" })
        .eq("id", userId);

      if (updateError) throw new Error(updateError.message);

      // 5) Return human-readable confirmation for Claude
      return {
        content: [
          { type: "text", text: "User successfully activated." }
        ]
      };
    }
  );
}
