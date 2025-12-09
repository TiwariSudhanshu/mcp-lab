import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";

export function registerGetUserByIdTool(server: McpServer) {
    server.tool(
        "get_user_by_id",
        {
            id: z.string().describe("The unique ID of the user to retrieve"),
        },
        async ({ id }) => {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                throw new Error(`Failed to fetch user: ${error.message}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(data, null, 2),
                    },
                ],
            };
        }
    );
}
