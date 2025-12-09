import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";

export function registerDeleteUserTool(server: McpServer) {
    server.tool(
        "delete_user",
        {
            id: z.string().describe("The unique ID of the user to delete"),
        },
        async ({ id }) => {
            const { data, error } = await supabase
                .from("users")
                .delete()
                .eq("id", id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to delete user: ${error.message}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: `User deleted successfully: ${JSON.stringify(data, null, 2)}`,
                    },
                ],
            };
        }
    );
}
