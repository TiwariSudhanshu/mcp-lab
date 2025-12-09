import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { supabase } from "../supabase.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerListUsersTool(server: McpServer) {
    server.tool(
        "list_users",          // tool name (what the LLM sees)
        {},  // params schema (empty -> no args)
        async ()=>{
             if (!canExecute("list_users", Current_Role)) {
        return {
          content: [
            {
              type: "text",
              text: "Permission denied: current role is not allowed to list users."
            }
          ]
        };
      }
            const {data, error} = await supabase.from("users").select("*");
            if (error) {
                throw new Error(`Failed to fetch users: ${error.message}`);
            }
            return{
                content:[
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    }
                ]
            };
        }
    );
}
