import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerCreateUserTool(server: McpServer) {
    server.tool(
        "create_user",
        {
            email: z.string().email().describe("The email address of the user"),
            role: z.string().describe("The role of the user (e.g., admin, user, moderator)"),
            name: z.string().optional().describe("The name of the user (optional)"),
        },
        async ({ email, role, name }) => {
            if (!canExecute("create_user", Current_Role)) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Permission denied: current role is not allowed to create users."
                        }
                    ]
                };
            }
            const { data, error } = await supabase
                .from("users")
                .insert({ email, role, name })
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to create user: ${error.message}`);
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
