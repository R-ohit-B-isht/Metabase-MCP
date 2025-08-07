/**
 * Table-related tool handlers
 */
import { ErrorCode, McpError } from "../types/errors.js";
export class TableToolHandlers {
    client;
    constructor(client) {
        this.client = client;
    }
    getToolSchemas() {
        return [
            {
                name: "list_tables",
                description: "Get all Tables. Optionally include additional metadata.",
                inputSchema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "number" },
                            description: "Optional list of table IDs to filter by"
                        }
                    }
                }
            },
            {
                name: "update_tables",
                description: "Update all Tables in ids",
                inputSchema: {
                    type: "object",
                    properties: {
                        ids: {
                            type: "array",
                            items: { type: "number" },
                            description: "List of table IDs to update"
                        },
                        updates: {
                            type: "object",
                            description: "Update data for the tables"
                        }
                    },
                    required: ["ids", "updates"]
                }
            },
            {
                name: "get_card_table_fks",
                description: "Return FK info for virtual table for a Card",
                inputSchema: {
                    type: "object",
                    properties: {
                        card_id: {
                            type: "number",
                            description: "ID of the card"
                        }
                    },
                    required: ["card_id"]
                }
            },
            // {
            //   name: "get_card_table_query_metadata",
            //   description: "Return metadata for virtual table for a Card",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       card_id: {
            //         type: "number",
            //         description: "ID of the card"
            //       }
            //     },
            //     required: ["card_id"]
            //   }
            // },
            {
                name: "get_table",
                description: "Get Table with ID",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        },
                        include_sensitive_fields: {
                            type: "boolean",
                            default: false,
                            description: "Include sensitive fields in response"
                        },
                        include_hidden_fields: {
                            type: "boolean",
                            default: false,
                            description: "Include hidden fields in response"
                        },
                        include_editable_data_model: {
                            type: "boolean",
                            default: false,
                            description: "Include editable data model information"
                        }
                    },
                    required: ["id"]
                }
            },
            {
                name: "update_table",
                description: "Update Table with ID",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        },
                        display_name: {
                            type: "string",
                            description: "Display name for the table"
                        },
                        entity_type: {
                            type: "string",
                            description: "Entity type of the table"
                        },
                        visibility_type: {
                            type: "string",
                            enum: ["normal", "hidden", "technical", "cruft"],
                            description: "Visibility type of the table"
                        },
                        description: {
                            type: "string",
                            description: "Description of the table"
                        },
                        caveats: {
                            type: "string",
                            description: "Caveats about the table"
                        },
                        points_of_interest: {
                            type: "string",
                            description: "Points of interest about the table"
                        }
                    },
                    required: ["id"]
                }
            },
            // {
            //   name: "append_csv_to_table",
            //   description: "Insert CSV rows into table",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       id: {
            //         type: "number",
            //         description: "Table ID"
            //       },
            //       csv_file: {
            //         type: "string",
            //         description: "CSV file content or path"
            //       }
            //     },
            //     required: ["id", "csv_file"]
            //   }
            // },
            {
                name: "discard_table_field_values",
                description: "Discard FieldValues for table",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        }
                    },
                    required: ["id"]
                }
            },
            // {
            //   name: "reorder_table_fields",
            //   description: "Reorder fields in a table",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       id: {
            //         type: "number",
            //         description: "Table ID"
            //       },
            //       field_order: {
            //         type: "array",
            //         items: { type: "number" },
            //         description: "Array of field IDs in desired order"
            //       }
            //     },
            //     required: ["id", "field_order"]
            //   }
            // },
            {
                name: "get_table_fks",
                description: "Get foreign keys for table",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        }
                    },
                    required: ["id"]
                }
            },
            // {
            //   name: "get_table_query_metadata",
            //   description: "Get table metadata for queries",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       id: {
            //         type: "number",
            //         description: "Table ID"
            //       },
            //       include_sensitive_fields: {
            //         type: "boolean",
            //         default: false,
            //         description: "Include sensitive fields in metadata"
            //       },
            //       include_hidden_fields: {
            //         type: "boolean",
            //         default: false,
            //         description: "Include hidden fields in metadata"
            //       }
            //     },
            //     required: ["id"]
            //   }
            // },
            {
                name: "get_table_related",
                description: "Return related entities for a table",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        }
                    },
                    required: ["id"]
                }
            },
            // {
            //   name: "replace_table_csv",
            //   description: "Replace table contents with CSV",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       id: {
            //         type: "number",
            //         description: "Table ID"
            //       },
            //       csv_file: {
            //         type: "string",
            //         description: "CSV file content or path"
            //       }
            //     },
            //     required: ["id", "csv_file"]
            //   }
            // },
            {
                name: "rescan_table_field_values",
                description: "Trigger FieldValues update for table",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: {
                            type: "number",
                            description: "Table ID"
                        }
                    },
                    required: ["id"]
                }
            },
            // {
            //   name: "sync_table_schema",
            //   description: "Trigger manual schema update for table",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       id: {
            //         type: "number",
            //         description: "Table ID"
            //       }
            //     },
            //     required: ["id"]
            //   }
            // },
            // {
            //   name: "get_table_data",
            //   description: "Get table data with optional filtering and pagination",
            //   inputSchema: {
            //     type: "object",
            //     properties: {
            //       table_id: {
            //         type: "number",
            //         description: "Table ID"
            //       },
            //       limit: {
            //         type: "number",
            //         description: "Maximum number of rows to return"
            //       },
            //       offset: {
            //         type: "number",
            //         description: "Number of rows to skip"
            //       }
            //     },
            //     required: ["table_id"]
            //   }
            // }
        ];
    }
    async handleTool(name, args) {
        switch (name) {
            case "list_tables":
                return await this.listTables(args);
            case "update_tables":
                return await this.updateTables(args);
            case "get_card_table_fks":
                return await this.getCardTableFks(args);
            case "get_card_table_query_metadata":
                return await this.getCardTableQueryMetadata(args);
            case "get_table":
                return await this.getTable(args);
            case "update_table":
                return await this.updateTable(args);
            case "append_csv_to_table":
                return await this.appendCsvToTable(args);
            case "discard_table_field_values":
                return await this.discardTableFieldValues(args);
            case "reorder_table_fields":
                return await this.reorderTableFields(args);
            case "get_table_fks":
                return await this.getTableFks(args);
            case "get_table_query_metadata":
                return await this.getTableQueryMetadata(args);
            case "get_table_related":
                return await this.getTableRelated(args);
            case "replace_table_csv":
                return await this.replaceTableCsv(args);
            case "rescan_table_field_values":
                return await this.rescanTableFieldValues(args);
            case "sync_table_schema":
                return await this.syncTableSchema(args);
            case "get_table_data":
                return await this.getTableData(args);
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown table tool: ${name}`);
        }
    }
    async listTables(args) {
        const tables = await this.client.getTables(args.ids);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(tables, null, 2),
                },
            ],
        };
    }
    async updateTables(args) {
        const { ids, updates } = args;
        if (!ids || !updates) {
            throw new McpError(ErrorCode.InvalidParams, "Table IDs and updates are required");
        }
        const result = await this.client.updateTables(ids, updates);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getCardTableFks(args) {
        const { card_id } = args;
        if (!card_id) {
            throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
        }
        const fks = await this.client.getCardTableFks(card_id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(fks, null, 2),
                },
            ],
        };
    }
    async getCardTableQueryMetadata(args) {
        const { card_id } = args;
        if (!card_id) {
            throw new McpError(ErrorCode.InvalidParams, "Card ID is required");
        }
        const metadata = await this.client.getCardTableQueryMetadata(card_id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(metadata, null, 2),
                },
            ],
        };
    }
    async getTable(args) {
        const { id, include_sensitive_fields, include_hidden_fields, include_editable_data_model } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const table = await this.client.getTable(id, {
            include_sensitive_fields,
            include_hidden_fields,
            include_editable_data_model
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(table, null, 2),
                },
            ],
        };
    }
    async updateTable(args) {
        const { id, ...updateData } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const result = await this.client.updateTable(id, updateData);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async appendCsvToTable(args) {
        const { id, csv_file } = args;
        if (!id || !csv_file) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID and CSV file are required");
        }
        const result = await this.client.appendCsvToTable(id, csv_file);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async discardTableFieldValues(args) {
        const { id } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const result = await this.client.discardTableFieldValues(id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async reorderTableFields(args) {
        const { id, field_order } = args;
        if (!id || !field_order) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID and field order are required");
        }
        const result = await this.client.reorderTableFields(id, field_order);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getTableFks(args) {
        const { id } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const fks = await this.client.getTableFks(id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(fks, null, 2),
                },
            ],
        };
    }
    async getTableQueryMetadata(args) {
        const { id, include_sensitive_fields, include_hidden_fields } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const metadata = await this.client.getTableQueryMetadata(id, {
            include_sensitive_fields,
            include_hidden_fields
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(metadata, null, 2),
                },
            ],
        };
    }
    async getTableRelated(args) {
        const { id } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const related = await this.client.getTableRelated(id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(related, null, 2),
                },
            ],
        };
    }
    async replaceTableCsv(args) {
        const { id, csv_file } = args;
        if (!id || !csv_file) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID and CSV file are required");
        }
        const result = await this.client.replaceTableCsv(id, csv_file);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async rescanTableFieldValues(args) {
        const { id } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const result = await this.client.rescanTableFieldValues(id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async syncTableSchema(args) {
        const { id } = args;
        if (!id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const result = await this.client.syncTableSchema(id);
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };
    }
    async getTableData(args) {
        const { table_id, limit, offset } = args;
        if (!table_id) {
            throw new McpError(ErrorCode.InvalidParams, "Table ID is required");
        }
        const data = await this.client.getTableData(table_id, { limit, offset });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data, null, 2),
                },
            ],
        };
    }
}
