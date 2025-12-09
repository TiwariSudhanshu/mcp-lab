import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { supabase } from "../supabase.js";

export function registerUpdateUserTool(server: McpServer) {
    server.tool(
        "update_user",
        {
            id: z.string().describe("The unique ID of the user to update"),
            email: z.string().email().optional().describe("New email address (optional)"),
            role: z.string().optional().describe("New role (optional)"),
            name: z.string().optional().describe("New name (optional)"),
        },
        async ({ id, email, role, name }) => {
            const updates: Record<string, string> = {};
            if (email) updates.email = email;
            if (role) updates.role = role;
            if (name) updates.name = name;

            if (Object.keys(updates).length === 0) {
                throw new Error("No fields to update. Provide at least one of: email, role, name");
            }

            const { data, error } = await supabase
                .from("users")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) {
                throw new Error(`Failed to update user: ${error.message}`);
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
