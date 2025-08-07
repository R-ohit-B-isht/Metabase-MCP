/**
 * Metabase API Client
 * Handles all API interactions with Metabase
 */
import axios from "axios";
import { ErrorCode, McpError } from "../types/errors.js";
export class MetabaseClient {
    axiosInstance;
    sessionToken = null;
    config;
    constructor(config) {
        this.config = config;
        this.axiosInstance = axios.create({
            baseURL: config.url,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (config.apiKey) {
            this.logInfo("Using Metabase API Key for authentication.");
            this.axiosInstance.defaults.headers.common["X-API-Key"] = config.apiKey;
            this.sessionToken = "api_key_used";
        }
        else if (config.username && config.password) {
            this.logInfo("Using Metabase username/password for authentication.");
        }
        else {
            this.logError("Metabase authentication credentials not configured properly.", {});
            throw new Error("Metabase authentication credentials not provided or incomplete.");
        }
    }
    logInfo(message, data) {
        const logMessage = {
            timestamp: new Date().toISOString(),
            level: "info",
            message,
            data,
        };
        console.error(JSON.stringify(logMessage));
        console.error(`INFO: ${message}`);
    }
    logError(message, error) {
        const errorObj = error;
        const logMessage = {
            timestamp: new Date().toISOString(),
            level: "error",
            message,
            error: errorObj.message || "Unknown error",
            stack: errorObj.stack,
        };
        console.error(JSON.stringify(logMessage));
        console.error(`ERROR: ${message} - ${errorObj.message || "Unknown error"}`);
    }
    /**
     * Get Metabase session token for username/password authentication
     */
    async getSessionToken() {
        if (this.sessionToken) {
            return this.sessionToken;
        }
        this.logInfo("Authenticating with Metabase using username/password...");
        try {
            const response = await this.axiosInstance.post("/api/session", {
                username: this.config.username,
                password: this.config.password,
            });
            this.sessionToken = response.data.id;
            // Set default request headers
            this.axiosInstance.defaults.headers.common["X-Metabase-Session"] =
                this.sessionToken;
            this.logInfo("Successfully authenticated with Metabase");
            return this.sessionToken;
        }
        catch (error) {
            this.logError("Authentication failed", error);
            throw new McpError(ErrorCode.InternalError, "Failed to authenticate with Metabase");
        }
    }
    /**
     * Ensure authentication is ready
     */
    async ensureAuthenticated() {
        if (!this.config.apiKey) {
            await this.getSessionToken();
        }
    }
    // Dashboard operations
    async getDashboards() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/dashboard");
        return response.data;
    }
    async getDashboard(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/dashboard/${id}`);
        return response.data;
    }
    async createDashboard(dashboard) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/dashboard", dashboard);
        return response.data;
    }
    async updateDashboard(id, updates) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.put(`/api/dashboard/${id}`, updates);
        return response.data;
    }
    async deleteDashboard(id, hardDelete = false) {
        await this.ensureAuthenticated();
        if (hardDelete) {
            await this.axiosInstance.delete(`/api/dashboard/${id}`);
        }
        else {
            await this.axiosInstance.put(`/api/dashboard/${id}`, { archived: true });
        }
    }
    // Card operations
    async getCards() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/card");
        return response.data;
    }
    async getCard(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${id}`);
        return response.data;
    }
    async createCard(card) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/card", card);
        return response.data;
    }
    async updateCard(id, updates, queryParams) {
        await this.ensureAuthenticated();
        let url = `/api/card/${id}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    searchParams.append(key, value.toString());
                }
            });
            url += `?${searchParams.toString()}`;
        }
        const response = await this.axiosInstance.put(url, updates);
        return response.data;
    }
    async deleteCard(id, hardDelete = false) {
        await this.ensureAuthenticated();
        if (hardDelete) {
            await this.axiosInstance.delete(`/api/card/${id}`);
        }
        else {
            await this.axiosInstance.put(`/api/card/${id}`, { archived: true });
        }
    }
    async executeCard(id, options = {}) {
        await this.ensureAuthenticated();
        const requestBody = {
            ignore_cache: options.ignore_cache || false,
        };
        if (options.collection_preview !== undefined) {
            requestBody.collection_preview = options.collection_preview;
        }
        if (options.dashboard_id !== undefined) {
            requestBody.dashboard_id = options.dashboard_id;
        }
        const response = await this.axiosInstance.post(`/api/card/${id}/query`, requestBody);
        return response.data;
    }
    async moveCards(cardIds, collectionId, dashboardId) {
        await this.ensureAuthenticated();
        const data = { card_ids: cardIds };
        if (collectionId) {
            data.collection_id = collectionId;
        }
        if (dashboardId) {
            data.dashboard_id = dashboardId;
        }
        const response = await this.axiosInstance.post("/api/cards/move", data);
        return response.data;
    }
    // Card collection operations
    async moveCardsToCollection(cardIds, collectionId) {
        await this.ensureAuthenticated();
        const requestBody = { card_ids: cardIds };
        if (collectionId !== undefined) {
            requestBody.collection_id = collectionId;
        }
        const response = await this.axiosInstance.post("/api/card/collections", requestBody);
        return response.data;
    }
    // Card embeddable operations
    async getEmbeddableCards() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/card/embeddable");
        return response.data;
    }
    // Card pivot query operations
    async executePivotCardQuery(cardId, parameters = {}) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/card/pivot/${cardId}/query`, parameters);
        return response.data;
    }
    // Card public operations
    async getPublicCards() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/card/public");
        return response.data;
    }
    // Card parameter operations
    async getCardParamValues(cardId, paramKey) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/params/${paramKey}/values`);
        return response.data;
    }
    async searchCardParamValues(cardId, paramKey, query) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/params/${paramKey}/search/${query}`);
        return response.data;
    }
    async getCardParamRemapping(cardId, paramKey) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/params/${paramKey}/remapping`);
        return response.data;
    }
    // Card public link operations
    async createCardPublicLink(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/card/${cardId}/public_link`);
        return response.data;
    }
    async deleteCardPublicLink(cardId) {
        await this.ensureAuthenticated();
        await this.axiosInstance.delete(`/api/card/${cardId}/public_link`);
        return { success: true };
    }
    // Card query operations
    async executeCardQueryWithFormat(cardId, exportFormat, parameters = {}) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/card/${cardId}/query/${exportFormat}`, parameters);
        return response.data;
    }
    // Card copy operations
    async copyCard(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/card/${cardId}/copy`);
        return response.data;
    }
    // Card dashboard operations
    async getCardDashboards(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/dashboards`);
        return response.data;
    }
    // Card metadata operations
    async getCardQueryMetadata(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/query_metadata`);
        return response.data;
    }
    // Card series operations
    async getCardSeries(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/card/${cardId}/series`);
        return response.data;
    }
    // Database operations
    async getDatabases() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/database");
        return response.data;
    }
    async getDatabase(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/database/${id}`);
        return response.data;
    }
    async executeQuery(databaseId, query, parameters = []) {
        await this.ensureAuthenticated();
        const queryData = {
            type: "native",
            native: {
                query: query,
                template_tags: {},
            },
            parameters: parameters,
            database: databaseId,
        };
        const response = await this.axiosInstance.post("/api/dataset", queryData);
        return response.data;
    }
    // Collection operations
    async getCollections(archived = false) {
        await this.ensureAuthenticated();
        const params = archived ? { archived: true } : {};
        const response = await this.axiosInstance.get("/api/collection", {
            params,
        });
        return response.data;
    }
    async getCollection(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/collection/${id}`);
        return response.data;
    }
    async createCollection(collection) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/collection", collection);
        return response.data;
    }
    async updateCollection(id, updates) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.put(`/api/collection/${id}`, updates);
        return response.data;
    }
    async deleteCollection(id) {
        await this.ensureAuthenticated();
        await this.axiosInstance.delete(`/api/collection/${id}`);
    }
    // User operations
    async getUsers(includeDeactivated = false) {
        await this.ensureAuthenticated();
        const params = includeDeactivated ? { include_deactivated: true } : {};
        const response = await this.axiosInstance.get("/api/user", { params });
        return response.data;
    }
    async getUser(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/user/${id}`);
        return response.data;
    }
    async createUser(user) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/user", user);
        return response.data;
    }
    async updateUser(id, updates) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.put(`/api/user/${id}`, updates);
        return response.data;
    }
    async deleteUser(id) {
        await this.ensureAuthenticated();
        await this.axiosInstance.delete(`/api/user/${id}`);
    }
    // Permission operations
    async getPermissionGroups() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/permissions/group");
        return response.data;
    }
    async createPermissionGroup(name) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/permissions/group", {
            name,
        });
        return response.data;
    }
    async updatePermissionGroup(id, name) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.put(`/api/permissions/group/${id}`, { name });
        return response.data;
    }
    async deletePermissionGroup(id) {
        await this.ensureAuthenticated();
        await this.axiosInstance.delete(`/api/permissions/group/${id}`);
    }
    // Activity operations
    async getMostRecentlyViewedDashboard() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/activity/most_recently_viewed_dashboard");
        return response.data;
    }
    async getPopularItems() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/activity/popular_items");
        return response.data;
    }
    async getRecentViews() {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get("/api/activity/recent_views");
        return response.data;
    }
    async getRecents(context, includeMetadata = false) {
        await this.ensureAuthenticated();
        const params = new URLSearchParams();
        context.forEach(ctx => {
            params.append('context', ctx);
        });
        params.append('include_metadata', includeMetadata.toString());
        const response = await this.axiosInstance.get(`/api/activity/recents?${params.toString()}`);
        return response.data;
    }
    async postRecents(data) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post("/api/activity/recents", data);
        return response.data;
    }
    async executeQueryExport(exportFormat, query, formatRows = false, pivotResults = false, visualizationSettings = {}) {
        await this.ensureAuthenticated();
        const data = {
            format_rows: formatRows,
            pivot_results: pivotResults,
            query,
            visualization_settings: visualizationSettings
        };
        const response = await this.axiosInstance.post(`/api/dataset/${exportFormat}`, data);
        return response.data;
    }
    // Table operations
    async getTables(ids) {
        await this.ensureAuthenticated();
        const params = ids ? { ids: ids.join(',') } : {};
        const response = await this.axiosInstance.get("/api/table", { params });
        return response.data;
    }
    async updateTables(ids, updates) {
        await this.ensureAuthenticated();
        const data = { ids, ...updates };
        const response = await this.axiosInstance.put("/api/table", data);
        return response.data;
    }
    async getCardTableFks(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/table/card__${cardId}/fks`);
        return response.data;
    }
    async getCardTableQueryMetadata(cardId) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/table/card__${cardId}/query_metadata`);
        return response.data;
    }
    async getTable(id, options = {}) {
        await this.ensureAuthenticated();
        const params = new URLSearchParams();
        if (options.include_sensitive_fields !== undefined) {
            params.append('include_sensitive_fields', options.include_sensitive_fields.toString());
        }
        if (options.include_hidden_fields !== undefined) {
            params.append('include_hidden_fields', options.include_hidden_fields.toString());
        }
        if (options.include_editable_data_model !== undefined) {
            params.append('include_editable_data_model', options.include_editable_data_model.toString());
        }
        const url = params.toString() ? `/api/table/${id}?${params.toString()}` : `/api/table/${id}`;
        const response = await this.axiosInstance.get(url);
        return response.data;
    }
    async updateTable(id, updateData) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.put(`/api/table/${id}`, updateData);
        return response.data;
    }
    async appendCsvToTable(id, csvFile) {
        await this.ensureAuthenticated();
        const formData = new FormData();
        formData.append('csv_file', csvFile);
        const response = await this.axiosInstance.post(`/api/table/${id}/append-csv`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
    async discardTableFieldValues(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/table/${id}/discard_values`);
        return response.data;
    }
    async reorderTableFields(id, fieldOrder) {
        await this.ensureAuthenticated();
        const data = { field_order: fieldOrder };
        const response = await this.axiosInstance.put(`/api/table/${id}/fields/order`, data);
        return response.data;
    }
    async getTableFks(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/table/${id}/fks`);
        return response.data;
    }
    async getTableQueryMetadata(id, options = {}) {
        await this.ensureAuthenticated();
        const params = new URLSearchParams();
        if (options.include_sensitive_fields !== undefined) {
            params.append('include_sensitive_fields', options.include_sensitive_fields.toString());
        }
        if (options.include_hidden_fields !== undefined) {
            params.append('include_hidden_fields', options.include_hidden_fields.toString());
        }
        const url = params.toString() ? `/api/table/${id}/query_metadata?${params.toString()}` : `/api/table/${id}/query_metadata`;
        const response = await this.axiosInstance.get(url);
        return response.data;
    }
    async getTableRelated(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.get(`/api/table/${id}/related`);
        return response.data;
    }
    async replaceTableCsv(id, csvFile) {
        await this.ensureAuthenticated();
        const formData = new FormData();
        formData.append('csv_file', csvFile);
        const response = await this.axiosInstance.post(`/api/table/${id}/replace-csv`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
    async rescanTableFieldValues(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/table/${id}/rescan_values`);
        return response.data;
    }
    async syncTableSchema(id) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.post(`/api/table/${id}/sync_schema`);
        return response.data;
    }
    async getTableData(tableId, options = {}) {
        await this.ensureAuthenticated();
        const params = new URLSearchParams();
        if (options.limit !== undefined) {
            params.append('limit', options.limit.toString());
        }
        if (options.offset !== undefined) {
            params.append('offset', options.offset.toString());
        }
        const url = params.toString() ? `/api/table/${tableId}/data?${params.toString()}` : `/api/table/${tableId}/data`;
        const response = await this.axiosInstance.get(url);
        return response.data;
    }
    // Generic API method for other operations
    async apiCall(method, endpoint, data) {
        await this.ensureAuthenticated();
        const response = await this.axiosInstance.request({
            method,
            url: endpoint,
            data,
        });
        return response.data;
    }
}
