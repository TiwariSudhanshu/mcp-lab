import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerGetUserByIdTool(server: McpServer) {
    server.tool(
        "get_user_by_id",
        {
            id: z.string().describe("The unique ID of the user to retrieve"),
        },
        async ({ id }) => {
            if (!canExecute("get_user_by_id", Current_Role)) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Permission denied: current role is not allowed to get user by ID."
                        }
                    ]
                };
            }
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
