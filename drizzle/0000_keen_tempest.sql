CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"question" text NOT NULL,
	"status" text NOT NULL,
	"answer" text,
	"created_at" timestamp DEFAULT now()
);
