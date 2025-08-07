/**
 * Tool registry that manages all tool handlers
 */

import { MetabaseClient } from "../client/metabase-client.js";
import { DashboardToolHandlers } from "./dashboard-tools.js";
import { CardToolHandlers } from "./card-tools.js";
import { DatabaseToolHandlers } from "./database-tools.js";
import { ErrorCode, McpError } from "../types/errors.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";

export class ToolRegistry {
  private dashboardHandlers: DashboardToolHandlers;
  private cardHandlers: CardToolHandlers;
  private databaseHandlers: DatabaseToolHandlers;

  constructor(private client: MetabaseClient) {
    this.dashboardHandlers = new DashboardToolHandlers(client);
    this.cardHandlers = new CardToolHandlers(client);
    this.databaseHandlers = new DatabaseToolHandlers(client);
  }

  /**
   * Get all available tool schemas
   */
  getAllToolSchemas(): Tool[] {
    return [
      ...this.dashboardHandlers.getToolSchemas(),
      ...this.cardHandlers.getToolSchemas(),
      ...this.databaseHandlers.getToolSchemas(),
      // Add other tool schemas for collections, users, etc.
      ...this.getAdditionalToolSchemas(),
    ];
  }

  /**
   * Handle a tool call
   */
  async handleTool(name: string, args: any): Promise<any> {
    // Dashboard tools
    if (this.isDashboardTool(name)) {
      return await this.dashboardHandlers.handleTool(name, args);
    }

    // Card tools
    if (this.isCardTool(name)) {
      return await this.cardHandlers.handleTool(name, args);
    }

    // Database tools
    if (this.isDatabaseTool(name)) {
      return await this.databaseHandlers.handleTool(name, args);
    }

    // Handle other tools directly
    return await this.handleAdditionalTools(name, args);
  }

  private isDashboardTool(name: string): boolean {
    return (
      name.startsWith("dashboard") ||
      [
        "list_dashboards",
        "create_dashboard",
        "update_dashboard",
        "delete_dashboard",
        "get_dashboard_cards",
        // "add_card_to_dashboard",
        "remove_card_from_dashboard",
        "update_dashboard_card",
        // "get_dashboard_embeddable",
        // "get_dashboard_params_valid_filter_fields",
        // "post_dashboard_pivot_query",
        "get_dashboard_public",
        "post_dashboard_save",
        "post_dashboard_save_to_collection",
        // "post_dashboard_query",
        // "post_dashboard_query_export",
        // "get_dashboard_execute",
        // "post_dashboard_execute",
        "post_dashboard_public_link",
        "delete_dashboard_public_link",
        "post_dashboard_copy",
        "get_dashboard",
        "put_dashboard_cards",
        "get_dashboard_items",
        // "get_dashboard_param_remapping",
        "get_dashboard_param_search",
        "get_dashboard_param_values",
        "get_dashboard_query_metadata",
        "get_dashboard_related",
      ].includes(name)
    );
  }

  private isCardTool(name: string): boolean {
    return (
      name.startsWith("card") ||
      [
        "list_cards",
        "create_card",
        "update_card",
        "delete_card",
        "execute_card",
      ].includes(name)
    );
  }

  private isDatabaseTool(name: string): boolean {
    return (
      name.startsWith("database") ||
      name.includes("query") ||
      [
        "list_databases",
        "execute_query",
        // "create_database",
        "create_sample_database",
        // "validate_database",
        "get_database",
        "update_database",
        "delete_database",
        // "get_database_autocomplete_suggestions",
        // "get_database_card_autocomplete_suggestions",
        "discard_database_field_values",
        "dismiss_database_spinner",
        "get_database_fields",
        "get_database_healthcheck",
        "get_database_idfields",
        "get_database_metadata",
        "rescan_database_field_values",
        // "get_database_schema_tables_without_schema",
        "get_database_schema_tables",
        "get_database_schema_tables_for_schema",
        "get_database_schemas",
        "sync_database_schema",
        "get_database_syncable_schemas",
        "get_database_usage_info",
        // "get_virtual_database_datasets",
        // "get_virtual_database_datasets_for_schema",
        // "get_virtual_database_metadata",
        // "get_virtual_database_schema_tables",
        // "get_virtual_database_schemas",
      ].includes(name)
    );
  }

  private getAdditionalToolSchemas(): Tool[] {
    return [
      // Collection tools
      {
        name: "list_collections",
        description: "List all collections in Metabase",
        inputSchema: {
          type: "object",
          properties: {
            archived: {
              type: "boolean",
              description: "Include archived collections",
              default: false,
            },
          },
        },
      },
      {
        name: "create_collection",
        description: "Create a new Metabase collection",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the collection" },
            description: {
              type: "string",
              description: "Description of the collection",
            },
            color: { type: "string", description: "Color of the collection" },
            parent_id: {
              type: "number",
              description: "Parent collection ID (null for root level)",
            },
          },
          required: ["name"],
        },
      },
      {
        name: "update_collection",
        description: "Update an existing collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to update" },
            name: { type: "string", description: "New name of the collection" },
            description: {
              type: "string",
              description: "New description of the collection",
            },
            color: { type: "string", description: "New color of the collection" },
            parent_id: {
              type: "number",
              description: "New parent collection ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "delete_collection",
        description: "Delete a collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to delete" },
          },
          required: ["id"],
        },
      },
      {
        name: "get_collection_items",
        description: "Get all items in a collection",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "number", description: "Collection ID to get items from" },
          },
          required: ["id"],
        },
      },
      {
        name: "move_to_collection",
        description: "Move items between collections",
        inputSchema: {
          type: "object",
          properties: {
            item_type: {
              type: "string",
              description: "Type of item to move",
              enum: ["card", "dashboard"],
            },
            item_id: { type: "number", description: "ID of the item to move" },
            collection_id: {
              type: "number",
              description: "Target collection ID (null for root level)",
            },
          },
          required: ["item_type", "item_id", "collection_id"],
        },
      },
      // User tools
      {
        name: "list_users",
        description: "List all users in Metabase",
        inputSchema: {
          type: "object",
          properties: {
            include_deactivated: {
              type: "boolean",
              description: "Include deactivated users",
              default: false,
            },
          },
        },
      },
      {
        name: "create_user",
        description: "Create a new Metabase user",
        inputSchema: {
          type: "object",
          properties: {
            first_name: { type: "string", description: "User's first name" },
            last_name: { type: "string", description: "User's last name" },
            email: { type: "string", description: "User's email address" },
            password: { type: "string", description: "User's password" },
            group_ids: {
              type: "array",
              description: "Array of group IDs to assign user to",
              items: { type: "number" },
            },
          },
          required: ["first_name", "last_name", "email"],
        },
      },
      // Permission tools
      {
        name: "list_permission_groups",
        description: "List all permission groups",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_permission_group",
        description: "Create a new permission group",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the permission group",
            },
          },
          required: ["name"],
        },
      },
      // Search tools
      {
        name: "search_content",
        description: "Search across all Metabase content",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query" },
            models: {
              type: "array",
              description: "Filter by content types",
              items: {
                type: "string",
                enum: ["card", "dashboard", "collection", "database", "table"],
              },
            },
          },
          required: ["query"],
        },
      },
    ];
  }

  private async handleAdditionalTools(name: string, args: any): Promise<any> {
    switch (name) {
      // Collection operations
      case "list_collections":
        return await this.handleListCollections(args);
      case "create_collection":
        return await this.handleCreateCollection(args);
      case "update_collection":
        return await this.handleUpdateCollection(args);
      case "delete_collection":
        return await this.handleDeleteCollection(args);
      case "get_collection_items":
        return await this.handleGetCollectionItems(args);
      case "move_to_collection":
        return await this.handleMoveToCollection(args);

      // User operations
      case "list_users":
        return await this.handleListUsers(args);
      case "create_user":
        return await this.handleCreateUser(args);

      // Permission operations
      case "list_permission_groups":
        return await this.handleListPermissionGroups();
      case "create_permission_group":
        return await this.handleCreatePermissionGroup(args);

      // Search operations
      case "search_content":
        return await this.handleSearchContent(args);

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  }

  private async handleListCollections(args: any): Promise<any> {
    const { archived = false } = args;
    const collections = await this.client.getCollections(archived);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collections, null, 2),
        },
      ],
    };
  }

  private async handleCreateCollection(args: any): Promise<any> {
    const { name, description, color, parent_id } = args;

    if (!name) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Collection name is required"
      );
    }

    const collectionData: any = { name };
    if (description !== undefined) collectionData.description = description;
    if (color !== undefined) collectionData.color = color;
    if (parent_id !== undefined) collectionData.parent_id = parent_id;

    const collection = await this.client.createCollection(collectionData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collection, null, 2),
        },
      ],
    };
  }

  private async handleListUsers(args: any): Promise<any> {
    const { include_deactivated = false } = args;
    const users = await this.client.getUsers(include_deactivated);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(users, null, 2),
        },
      ],
    };
  }

  private async handleCreateUser(args: any): Promise<any> {
    const { first_name, last_name, email, password, group_ids } = args;

    if (!first_name || !last_name || !email) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "first_name, last_name, and email are required"
      );
    }

    const userData: any = { first_name, last_name, email };
    if (password !== undefined) userData.password = password;
    if (group_ids !== undefined) userData.group_ids = group_ids;

    const user = await this.client.createUser(userData);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(user, null, 2),
        },
      ],
    };
  }

  private async handleListPermissionGroups(): Promise<any> {
    const groups = await this.client.getPermissionGroups();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(groups, null, 2),
        },
      ],
    };
  }

  private async handleCreatePermissionGroup(args: any): Promise<any> {
    const { name } = args;

    if (!name) {
      throw new McpError(ErrorCode.InvalidParams, "Group name is required");
    }

    const group = await this.client.createPermissionGroup(name);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(group, null, 2),
        },
      ],
    };
  }

  private async handleSearchContent(args: any): Promise<any> {
    const { query, models } = args;

    if (!query) {
      throw new McpError(ErrorCode.InvalidParams, "Search query is required");
    }

    const params: any = { q: query };
    if (models && Array.isArray(models) && models.length > 0) {
      params.models = models.join(",");
    }

    const results = await this.client.apiCall("GET", "/api/search", params);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }

  private async handleUpdateCollection(args: any): Promise<any> {
    const { id, name, description, color, parent_id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (color !== undefined) updates.color = color;
    if (parent_id !== undefined) updates.parent_id = parent_id;

    const collection = await this.client.updateCollection(id, updates);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(collection, null, 2),
        },
      ],
    };
  }

  private async handleDeleteCollection(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    await this.client.deleteCollection(id);
    return {
      content: [
        {
          type: "text",
          text: `Collection ${id} deleted successfully`,
        },
      ],
    };
  }

  private async handleGetCollectionItems(args: any): Promise<any> {
    const { id } = args;

    if (!id) {
      throw new McpError(ErrorCode.InvalidParams, "Collection ID is required");
    }

    const items = await this.client.apiCall("GET", `/api/collection/${id}/items`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(items, null, 2),
        },
      ],
    };
  }

  private async handleMoveToCollection(args: any): Promise<any> {
    const { item_type, item_id, collection_id } = args;

    if (!item_type || !item_id || collection_id === undefined) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "item_type, item_id, and collection_id are required"
      );
    }

    const endpoint = item_type === "card" ? `/api/card/${item_id}` : `/api/dashboard/${item_id}`;
    const result = await this.client.apiCall("PUT", endpoint, {
      collection_id: collection_id,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}
