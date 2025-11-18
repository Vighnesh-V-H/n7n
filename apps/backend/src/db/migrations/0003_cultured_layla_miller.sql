DROP TABLE "workflow_limits" CASCADE;--> statement-breakpoint
ALTER TABLE "subscription" ADD COLUMN "remaining_workflows" integer NOT NULL;