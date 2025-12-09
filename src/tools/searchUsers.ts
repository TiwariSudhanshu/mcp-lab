import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";
import { canExecute, Current_Role } from "../permissions.js";

export function registerSearchUsersTool(server: McpServer) {
    server.tool(
        "search_users",
        {
            query: z.string().optional().describe("Search term to match against email or name"),
            role: z.string().optional().describe("Filter by role"),
            limit: z.number().optional().describe("Maximum number of results (default 10)"),
        },
        async ({ query, role, limit = 10 }) => {
            if (!canExecute("search_users", Current_Role)) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Permission denied: current role is not allowed to search users."
                        }
                    ]
                };
            }
            let queryBuilder = supabase.from("users").select("*");

            if (query) {
                queryBuilder = queryBuilder.or(`email.ilike.%${query}%,name.ilike.%${query}%`);
            }

            if (role) {
                queryBuilder = queryBuilder.eq("role", role);
            }

            const { data, error } = await queryBuilder.limit(limit);

            if (error) {
                throw new Error(`Failed to search users: ${error.message}`);
            }

            return {
                content: [
                    {
                        type: "text",
                        text: `Found ${data.length} user(s):\n${JSON.stringify(data, null, 2)}`,
                    },
                ],
            };
        }
    );
}
