import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";

export function registerCountUsersTool(server: McpServer) {
    server.tool(
        "count_users",
        {
            role: z.string().optional().describe("Filter count by role (optional)"),
        },
        async ({ role }) => {
            let queryBuilder = supabase.from("users").select("*", { count: "exact", head: true });

            if (role) {
                queryBuilder = queryBuilder.eq("role", role);
            }

            const { count, error } = await queryBuilder;

            if (error) {
                throw new Error(`Failed to count users: ${error.message}`);
            }

            const message = role
                ? `Total users with role "${role}": ${count}`
                : `Total users: ${count}`;

            return {
                content: [
                    {
                        type: "text",
                        text: message,
                    },
                ],
            };
        }
    );
}
