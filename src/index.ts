import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerPingTool } from "./tools/ping.js";
import { registerCreateUserTool } from "./tools/createUser.js";
import { registerUpdateUserTool } from "./tools/updateUser.js";
import { registerDeleteUserTool } from "./tools/deleteUser.js";
import { registerVerifyUserTool } from "./tools/verifyUser.js";
import { registerActivateUserTool } from "./tools/activateUser.js";
import { registerGetUserWorkflowTool } from "./tools/getUserWorkflow.js";
import { getUserWorkflowState } from "./resources/userWorkFlows.js";
const server = new McpServer({
  name: "mcp-lab",
  version: "1.0.0",
});

server.registerResource(
  "user_workflow_state",
  new ResourceTemplate("user://workflow/{userId}", { list: undefined }),
  {},
  async (uri, variables) => {
    const data = await getUserWorkflowState(variables.userId as string);
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(data),
        },
      ],
    };
  }
)

// Utility tools
registerPingTool(server);

// User query tools
registerGetUserWorkflowTool(server);

// User mutation tools
registerCreateUserTool(server);
registerUpdateUserTool(server);
registerDeleteUserTool(server);
registerVerifyUserTool(server);
registerActivateUserTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ MCP server started ");
