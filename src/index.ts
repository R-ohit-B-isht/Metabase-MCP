#!/usr/bin/env node

// AbortController polyfill for older Node.js versions
import AbortController from "abort-controller";
global.AbortController = global.AbortController || AbortController;

/**
 * Metabase MCP Server
 *
 * A comprehensive Model Context Protocol server for Metabase integration.
 * Developed by EaseCloud Technologies (https://easecloud.io)
 *
 * This server implements interaction with Metabase API, providing comprehensive functionality for:
 * - Dashboard management and operations
 * - Question/Card management and execution
 * - Database operations and queries
 * - User and permission management
 * - Collections and content organization
 * - Analytics and monitoring
 *
 * @author EaseCloud Technologies <info@easecloud.io>
 * @license MIT
 * @version 0.1.0
 */

import { MetabaseServer } from "./server.js";

// Add global error handlers
process.on("uncaughtException", (error: Error) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "fatal",
      message: "Uncaught Exception",
      error: error.message,
      stack: error.stack,
    })
  );
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  const errorMessage =
    reason instanceof Error ? reason.message : String(reason);
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "fatal",
      message: "Unhandled Rejection",
      error: errorMessage,
    })
  );
});

// Create and run the server
const server = new MetabaseServer();
server.run().catch(console.error);
