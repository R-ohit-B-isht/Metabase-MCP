/**
 * Dashboard-related tool handlers
 */
import { ErrorCode, McpError } from "../types/errors.js";
export class DashboardToolHandlers {
    client;
    constructor(client) {
        this.client = client;
    }
    getToolSchemas() {
        return [
            {
                name: "list_dashboards",
                description: "List all dashboards in Metabase",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "create_dashboard",
                description: "Create a new Metabase dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Name of the dashboard" },
                        description: {
                            type: "string",
                            description: "Optional description for the dashboard",
                        },
                        parameters: {
                            type: "array",
                            description: "Optional parameters for the dashboard",
                            items: { type: "object" },
                        },
                        collection_id: {
                            type: "number",
                            description: "Optional ID of the collection to save the dashboard in",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "update_dashboard",
                description: "Update an existing Metabase dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard to update",
                        },
                        name: { type: "string", description: "New name for the dashboard" },
                        description: {
                            type: "string",
                            description: "New description for the dashboard",
                        },
                        parameters: {
                            type: "array",
                            description: "New parameters for the dashboard",
                            items: { type: "object" },
                        },
                        collection_id: { type: "number", description: "New collection ID" },
                        archived: {
                            type: "boolean",
                            description: "Set to true to archive the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "delete_dashboard",
                description: "Delete a Metabase dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard to delete",
                        },
                        hard_delete: {
                            type: "boolean",
                            description: "Set to true for hard delete, false (default) for archive",
                            default: false,
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "get_dashboard_cards",
                description: "Get all cards in a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            // {
            //   name: "add_card_to_dashboard",
            //   description: "Add a card to a dashboard with positioning",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       card_id: {
            //         type: "number",
            //         description: "ID of the card to add",
            //       },
            //       row: {
            //         type: "number",
            //         description: "Row position (0-based)",
            //         default: 0,
            //       },
            //       col: {
            //         type: "number",
            //         description: "Column position (0-based)",
            //         default: 0,
            //       },
            //       size_x: {
            //         type: "number",
            //         description: "Width in grid units",
            //         default: 4,
            //       },
            //       size_y: {
            //         type: "number",
            //         description: "Height in grid units",
            //         default: 4,
            //       },
            //       parameter_mappings: {
            //         type: "array",
            //         description: "Parameter mappings between dashboard and card",
            //         items: { type: "object" },
            //       },
            //       visualization_settings: {
            //         type: "object",
            //         description: "Visualization settings for the card on this dashboard",
            //       },
            //     },
            //     required: ["dashboard_id", "card_id"],
            //   },
            // },
            {
                name: "remove_card_from_dashboard",
                description: "Remove a card from a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                        dashcard_id: {
                            type: "number",
                            description: "ID of the dashboard card (not the card itself)",
                        },
                    },
                    required: ["dashboard_id", "dashcard_id"],
                },
            },
            {
                name: "update_dashboard_card",
                description: "Update card position, size, and settings on a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                        dashcard_id: {
                            type: "number",
                            description: "ID of the dashboard card",
                        },
                        row: {
                            type: "number",
                            description: "New row position",
                        },
                        col: {
                            type: "number",
                            description: "New column position",
                        },
                        size_x: {
                            type: "number",
                            description: "New width in grid units",
                        },
                        size_y: {
                            type: "number",
                            description: "New height in grid units",
                        },
                        parameter_mappings: {
                            type: "array",
                            description: "Updated parameter mappings",
                            items: { type: "object" },
                        },
                        visualization_settings: {
                            type: "object",
                            description: "Updated visualization settings",
                        },
                    },
                    required: ["dashboard_id", "dashcard_id"],
                },
            },
            // {
            //   name: "get_dashboard_embeddable",
            //   description: "Get embeddable dashboards",
            //   inputSchema: {
            //     type: "object",
            //     properties: {},
            //   },
            // },
            // {
            //   name: "get_dashboard_params_valid_filter_fields",
            //   description: "Get valid filter fields for dashboard parameters",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       filtered: {
            //         type: "array",
            //         description: "Array of field IDs that are being filtered",
            //         items: { type: "number" },
            //       },
            //       filtering: {
            //         type: "array",
            //         description: "Array of field IDs that are doing the filtering",
            //         items: { type: "number" },
            //       },
            //     },
            //     required: ["filtered"],
            //   },
            // },
            // {
            //   name: "post_dashboard_pivot_query",
            //   description: "Execute a pivot query for a dashboard card",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       dashcard_id: {
            //         type: "number",
            //         description: "ID of the dashboard card",
            //       },
            //       card_id: {
            //         type: "number",
            //         description: "ID of the card",
            //       },
            //       query: {
            //         type: "object",
            //         description: "Query parameters for the pivot",
            //       },
            //     },
            //     required: ["dashboard_id", "dashcard_id", "card_id"],
            //   },
            // },
            {
                name: "get_dashboard_public",
                description: "Get public dashboards",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            // {
            //   name: "post_dashboard_save",
            //   description: "Save a dashboard",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       name: { type: "string", description: "Name of the dashboard" },
            //       description: {
            //         type: "string",
            //         description: "Description of the dashboard",
            //       },
            //       parameters: {
            //         type: "array",
            //         description: "Dashboard parameters",
            //         items: { type: "object" },
            //       },
            //       cards: {
            //         type: "array",
            //         description: "Dashboard cards",
            //         items: { type: "object" },
            //       },
            //     },
            //     required: ["name"],
            //   },
            // },
            // {
            //   name: "post_dashboard_save_to_collection",
            //   description: "Save a dashboard to a specific collection",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       parent_collection_id: {
            //         type: "number",
            //         description: "ID of the parent collection",
            //       },
            //       name: { type: "string", description: "Name of the dashboard" },
            //       description: {
            //         type: "string",
            //         description: "Description of the dashboard",
            //       },
            //       parameters: {
            //         type: "array",
            //         description: "Dashboard parameters",
            //         items: { type: "object" },
            //       },
            //       cards: {
            //         type: "array",
            //         description: "Dashboard cards",
            //         items: { type: "object" },
            //       },
            //     },
            //     required: ["parent_collection_id", "name"],
            //   },
            // },
            {
                name: "post_dashboard_query",
                description: "Execute a query for a dashboard card",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                        dashcard_id: {
                            type: "number",
                            description: "ID of the dashboard card",
                        },
                        card_id: {
                            type: "number",
                            description: "ID of the card",
                        },
                        dashboard_load_id: {
                            type: "string",
                            description: "Dashboard load identifier",
                        },
                        parameters: {
                            type: "array",
                            description: "Query parameters",
                            items: { type: "object" },
                        },
                    },
                    required: ["dashboard_id", "dashcard_id", "card_id"],
                },
            },
            // {
            //   name: "post_dashboard_query_export",
            //   description: "Export dashboard card query results in specified format",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       dashcard_id: {
            //         type: "number",
            //         description: "ID of the dashboard card",
            //       },
            //       card_id: {
            //         type: "number",
            //         description: "ID of the card",
            //       },
            //       export_format: {
            //         type: "string",
            //         description: "Export format (csv, xlsx, json)",
            //         enum: ["csv", "xlsx", "json"],
            //       },
            //       parameters: {
            //         type: "object",
            //         description: "Query parameters",
            //       },
            //     },
            //     required: ["dashboard_id", "dashcard_id", "card_id", "export_format"],
            //   },
            // },
            // {
            //   name: "get_dashboard_execute",
            //   description: "Get execution status for a dashboard card",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       dashcard_id: {
            //         type: "number",
            //         description: "ID of the dashboard card",
            //       },
            //     },
            //     required: ["dashboard_id", "dashcard_id"],
            //   },
            // },
            // {
            //   name: "post_dashboard_execute",
            //   description: "Execute a dashboard card",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       dashcard_id: {
            //         type: "number",
            //         description: "ID of the dashboard card",
            //       },
            //       parameters: {
            //         type: "object",
            //         description: "Execution parameters",
            //       },
            //     },
            //     required: ["dashboard_id", "dashcard_id"],
            //   },
            // },
            {
                name: "post_dashboard_public_link",
                description: "Create a public link for a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "delete_dashboard_public_link",
                description: "Delete a public link for a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "post_dashboard_copy",
                description: "Copy a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        from_dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard to copy from",
                        },
                        name: {
                            type: "string",
                            description: "Name for the new dashboard",
                        },
                        description: {
                            type: "string",
                            description: "Description for the new dashboard",
                        },
                        collection_id: {
                            type: "number",
                            description: "ID of the collection to save the copy in",
                        },
                    },
                    required: ["from_dashboard_id"],
                },
            },
            {
                name: "get_dashboard",
                description: "Get a specific dashboard by ID",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "put_dashboard_cards",
                description: "Update all cards in a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                        cards: {
                            type: "array",
                            description: "Array of dashboard cards",
                            items: { type: "object" },
                        },
                    },
                    required: ["dashboard_id", "cards"],
                },
            },
            {
                name: "get_dashboard_items",
                description: "Get all items in a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            // {
            //   name: "get_dashboard_param_remapping",
            //   description: "Get parameter remapping for a dashboard",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       param_key: {
            //         type: "string",
            //         description: "Parameter key",
            //       },
            //     },
            //     required: ["dashboard_id", "param_key"],
            //   },
            // },
            {
                name: "get_dashboard_param_search",
                description: "Search dashboard parameter values",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                        param_key: {
                            type: "string",
                            description: "Parameter key",
                        },
                        query: {
                            type: "string",
                            description: "Search query",
                        },
                    },
                    required: ["dashboard_id", "param_key", "query"],
                },
            },
            // {
            //   name: "get_dashboard_param_values",
            //   description: "Get values for a dashboard parameter",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       dashboard_id: {
            //         type: "number",
            //         description: "ID of the dashboard",
            //       },
            //       param_key: {
            //         type: "string",
            //         description: "Parameter key",
            //       },
            //     },
            //     required: ["dashboard_id", "param_key"],
            //   },
            // },
            {
                name: "get_dashboard_query_metadata",
                description: "Get query metadata for a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
            {
                name: "get_dashboard_related",
                description: "Get related items for a dashboard",
                inputSchema: {
                    type: "object",
                    properties: {
                        dashboard_id: {
                            type: "number",
                            description: "ID of the dashboard",
                        },
                    },
                    required: ["dashboard_id"],
                },
            },
        ];
    }
    async handleTool(name, args) {
        switch (name) {
            case "list_dashboards":
                return await this.listDashboards();
            case "create_dashboard":
                return await this.createDashboard(args);
            case "update_dashboard":
                return await this.updateDashboard(args);
            case "delete_dashboard":
                return await this.deleteDashboard(args);
            case "get_dashboard_cards":
                return await this.getDashboardCards(args);
            case "add_card_to_dashboard":
                return await this.addCardToDashboard(args);
            case "remove_card_from_dashboard":
                return await this.removeCardFromDashboard(args);
            case "update_dashboard_card":
                return await this.updateDashboardCard(args);
            case "get_dashboard_embeddable":
                return await this.getDashboardEmbeddable();
            case "get_dashboard_params_valid_filter_fields":
                return await this.getDashboardParamsValidFilterFields(args);
            case "post_dashboard_pivot_query":
                return await this.postDashboardPivotQuery(args);
            case "get_dashboard_public":
                return await this.getDashboardPublic();
            case "post_dashboard_save":
                return await this.postDashboardSave(args);
            case "post_dashboard_save_to_collection":
                return await this.postDashboardSaveToCollection(args);
            case "post_dashboard_query":
                return await this.postDashboardQuery(args);
            case "post_dashboard_query_export":
                return await this.postDashboardQueryExport(args);
            case "get_dashboard_execute":
                return await this.getDashboardExecute(args);
            case "post_dashboard_execute":
                return await this.postDashboardExecute(args);
            case "post_dashboard_public_link":
                return await this.postDashboardPublicLink(args);
            case "delete_dashboard_public_link":
                return await this.deleteDashboardPublicLink(args);
            case "post_dashboard_copy":
                return await this.postDashboardCopy(args);
            case "get_dashboard":
                return await this.getDashboard(args);
            case "put_dashboard_cards":
                return await this.putDashboardCards(args);
            case "get_dashboard_items":
                return await this.getDashboardItems(args);
            case "get_dashboard_param_remapping":
                return await this.getDashboardParamRemapping(args);
            case "get_dashboard_param_search":
                return await this.getDashboardParamSearch(args);
            case "get_dashboard_param_values":
                return await this.getDashboardParamValues(args);
            case "get_dashboard_query_metadata":
                return await this.getDashboardQueryMetadata(args);
            case "get_dashboard_related":
                return await this.getDashboardRelated(args);
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown dashboard tool: ${name}`);
        }
    }
    async listDashboards() {
        const dashboards = await this.client.getDashboards();
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(dashboards, null, 2),
                },
            ],
        };
    }
    async createDashboard(args) {
        const { name, description, parameters, collection_id } = args;
        if (!name) {
            throw new McpError(ErrorCode.InvalidParams, "Missing required field: name");
        }
        const dashboardData = { name };
        if (description !== undefined)
            dashboardData.description = description;
        if (parameters !== undefined)
            dashboardData.parameters = parameters;
        if (collection_id !== undefined)
            dashboardData.collection_id = collection_id;
        const dashboard = await this.client.createDashboard(dashboardData);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(dashboard, null, 2),
                },
            ],
        };
    }
    async updateDashboard(args) {
        const { dashboard_id, ...updateFields } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
        }
        if (Object.keys(updateFields).length === 0) {
            throw new McpError(ErrorCode.InvalidParams, "No fields provided for update");
        }
        const dashboard = await this.client.updateDashboard(dashboard_id, updateFields);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(dashboard, null, 2),
                },
            ],
        };
    }
    async deleteDashboard(args) {
        const { dashboard_id, hard_delete = false } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
        }
        await this.client.deleteDashboard(dashboard_id, hard_delete);
        return {
            content: [
                {
                    type: "text",
                    text: hard_delete
                        ? `Dashboard ${dashboard_id} permanently deleted.`
                        : `Dashboard ${dashboard_id} archived.`,
                },
            ],
        };
    }
    async getDashboardCards(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID is required");
        }
        const dashboard = await this.client.getDashboard(dashboard_id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(dashboard.cards || [], null, 2),
                },
            ],
        };
    }
    async addCardToDashboard(args) {
        const { dashboard_id, card_id, row = 0, col = 0, size_x = 4, size_y = 4, parameter_mappings = [], visualization_settings = {}, } = args;
        if (!dashboard_id || !card_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Card ID are required");
        }
        // Try different API approaches based on Metabase version
        let result;
        try {
            // Approach 1: Direct POST to dashboard cards (works in some versions)
            const dashcardData = {
                cardId: card_id,
                row,
                col,
                sizeX: size_x,
                sizeY: size_y,
                parameter_mappings,
                visualization_settings,
            };
            result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/cards`, dashcardData);
        }
        catch (error) {
            // Approach 2: Use PUT to update entire dashboard cards array
            try {
                const dashboard = await this.client.getDashboard(dashboard_id);
                // Create new card object for the dashboard
                const newCard = {
                    id: -1, // Temporary ID for new cards
                    card_id,
                    row,
                    col,
                    size_x,
                    size_y,
                    parameter_mappings,
                    visualization_settings,
                };
                // Add the new card to existing cards
                const updatedCards = [...(dashboard.cards || []), newCard];
                result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards`, { cards: updatedCards });
            }
            catch (putError) {
                // Approach 3: Try alternative endpoint structure
                const alternativeData = {
                    card_id,
                    row,
                    col,
                    size_x,
                    size_y,
                    parameter_mappings,
                    visualization_settings,
                };
                result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/dashcard`, alternativeData);
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async removeCardFromDashboard(args) {
        const { dashboard_id, dashcard_id } = args;
        if (!dashboard_id || !dashcard_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Dashcard ID are required");
        }
        try {
            // Approach 1: Direct DELETE (standard approach)
            await this.client.apiCall("DELETE", `/api/dashboard/${dashboard_id}/cards/${dashcard_id}`);
        }
        catch (error) {
            // Approach 2: Try alternative endpoint
            try {
                await this.client.apiCall("DELETE", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}`);
            }
            catch (altError) {
                // Approach 3: Update dashboard without the card
                const dashboard = await this.client.getDashboard(dashboard_id);
                const updatedCards = (dashboard.cards || []).filter((card) => card.id !== dashcard_id);
                await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards`, { cards: updatedCards });
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: `Card with dashcard ID ${dashcard_id} removed from dashboard ${dashboard_id}`,
                },
            ],
        };
    }
    async updateDashboardCard(args) {
        const { dashboard_id, dashcard_id, ...updateFields } = args;
        if (!dashboard_id || !dashcard_id) {
            throw new McpError(ErrorCode.InvalidParams, "Dashboard ID and Dashcard ID are required");
        }
        if (Object.keys(updateFields).length === 0) {
            throw new McpError(ErrorCode.InvalidParams, "No fields provided for update");
        }
        let result;
        try {
            // Approach 1: Direct PUT to specific card
            result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards/${dashcard_id}`, updateFields);
        }
        catch (error) {
            // Approach 2: Try alternative endpoint
            try {
                result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}`, updateFields);
            }
            catch (altError) {
                // Approach 3: Update entire dashboard cards array
                const dashboard = await this.client.getDashboard(dashboard_id);
                const updatedCards = (dashboard.cards || []).map((card) => {
                    if (card.id === dashcard_id) {
                        return { ...card, ...updateFields };
                    }
                    return card;
                });
                result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards`, { cards: updatedCards });
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardEmbeddable() {
        const result = await this.client.apiCall("GET", "/api/dashboard/embeddable");
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardParamsValidFilterFields(args) {
        const { filtered, filtering } = args;
        if (!filtered || !Array.isArray(filtered)) {
            throw new McpError(ErrorCode.InvalidParams, "filtered parameter is required and must be an array");
        }
        const queryParams = new URLSearchParams();
        filtered.forEach(dashboard_id => queryParams.append('filtered', dashboard_id.toString()));
        if (filtering && Array.isArray(filtering)) {
            filtering.forEach(dashboard_id => queryParams.append('filtering', dashboard_id.toString()));
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/params/valid-filter-fields?${queryParams.toString()}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardPivotQuery(args) {
        const { dashboard_id, dashcard_id, card_id, query } = args;
        if (!dashboard_id || !dashcard_id || !card_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, and card_id are required");
        }
        const requestBody = {};
        if (query !== undefined)
            requestBody.query = query;
        const result = await this.client.apiCall("POST", `/api/dashboard/pivot/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardPublic() {
        const result = await this.client.apiCall("GET", "/api/dashboard/public");
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardSave(args) {
        const { name, description, parameters, cards } = args;
        if (!name) {
            throw new McpError(ErrorCode.InvalidParams, "name is required");
        }
        const requestBody = { name };
        if (description !== undefined)
            requestBody.description = description;
        if (parameters !== undefined)
            requestBody.parameters = parameters;
        if (cards !== undefined)
            requestBody.cards = cards;
        const result = await this.client.apiCall("POST", "/api/dashboard/save", requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardSaveToCollection(args) {
        const { parent_collection_id, name, description, parameters, cards } = args;
        if (!parent_collection_id || !name) {
            throw new McpError(ErrorCode.InvalidParams, "parent_collection_id and name are required");
        }
        const requestBody = { name };
        if (description !== undefined)
            requestBody.description = description;
        if (parameters !== undefined)
            requestBody.parameters = parameters;
        if (cards !== undefined)
            requestBody.cards = cards;
        const result = await this.client.apiCall("POST", `/api/dashboard/save/collection/${parent_collection_id}`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardQuery(args) {
        const { dashboard_id, dashcard_id, card_id, dashboard_load_id, parameters } = args;
        if (!dashboard_id || !dashcard_id || !card_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, and card_id are required");
        }
        const requestBody = {};
        if (dashboard_load_id !== undefined)
            requestBody.dashboard_load_id = dashboard_load_id;
        if (parameters !== undefined)
            requestBody.parameters = parameters;
        const result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardQueryExport(args) {
        const { dashboard_id, dashcard_id, card_id, export_format, parameters } = args;
        if (!dashboard_id || !dashcard_id || !card_id || !export_format) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id, dashcard_id, card_id, and export_format are required");
        }
        const requestBody = {};
        if (parameters !== undefined)
            requestBody.parameters = parameters;
        const result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/card/${card_id}/query/${export_format}`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardExecute(args) {
        const { dashboard_id, dashcard_id } = args;
        if (!dashboard_id || !dashcard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id and dashcard_id are required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/execute`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardExecute(args) {
        const { dashboard_id, dashcard_id, parameters } = args;
        if (!dashboard_id || !dashcard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id and dashcard_id are required");
        }
        const requestBody = {};
        if (parameters !== undefined)
            requestBody.parameters = parameters;
        const result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/dashcard/${dashcard_id}/execute`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardPublicLink(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("POST", `/api/dashboard/${dashboard_id}/public_link`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async deleteDashboardPublicLink(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("DELETE", `/api/dashboard/${dashboard_id}/public_link`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async postDashboardCopy(args) {
        const { from_dashboard_id, name, description, collection_id } = args;
        if (!from_dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "from_dashboard_id is required");
        }
        const requestBody = {};
        if (name !== undefined)
            requestBody.name = name;
        if (description !== undefined)
            requestBody.description = description;
        if (collection_id !== undefined)
            requestBody.collection_id = collection_id;
        const result = await this.client.apiCall("POST", `/api/dashboard/${from_dashboard_id}/copy`, requestBody);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboard(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async putDashboardCards(args) {
        const { dashboard_id, cards } = args;
        if (!dashboard_id || !cards) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id and cards are required");
        }
        const result = await this.client.apiCall("PUT", `/api/dashboard/${dashboard_id}/cards`, { cards });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardItems(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/items`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardParamRemapping(args) {
        const { dashboard_id, param_key } = args;
        if (!dashboard_id || !param_key) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id and param_key are required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/remapping`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardParamSearch(args) {
        const { dashboard_id, param_key, query } = args;
        if (!dashboard_id || !param_key || !query) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id, param_key, and query are required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/search/${query}`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardParamValues(args) {
        const { dashboard_id, param_key } = args;
        if (!dashboard_id || !param_key) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id and param_key are required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/params/${param_key}/values`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardQueryMetadata(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/query_metadata`);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getDashboardRelated(args) {
        const { dashboard_id } = args;
        if (!dashboard_id) {
            throw new McpError(ErrorCode.InvalidParams, "dashboard_id is required");
        }
        const result = await this.client.apiCall("GET", `/api/dashboard/${dashboard_id}/related`);
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
