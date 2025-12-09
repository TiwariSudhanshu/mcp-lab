import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { supabase } from "../supabase.js";

export function registerListUsersTool(server: McpServer) {
    server.tool(
        "list_users",          // tool name (what the LLM sees)
        {},  // params schema (empty -> no args)
        async ()=>{
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
