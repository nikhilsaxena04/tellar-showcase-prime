import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "list_projects",
  title: "List portfolio projects",
  description: "List the projects shown in Nikhil Saxena's portfolio, with tech stack and links.",
  inputSchema: {
    featured_only: z.boolean().optional().describe("Only return featured projects."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ featured_only }) => {
    let query = supabaseAnon()
      .from("projects")
      .select("id,title,description,tech_stack,live_url,github_url,featured")
      .order("display_order", { ascending: true });
    if (featured_only) query = query.eq("featured", true);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const projects = (data ?? []).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      tech_stack: p.tech_stack ?? [],
      live_url: p.live_url,
      github_url: p.github_url,
      featured: p.featured,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(projects, null, 2) }],
      structuredContent: { projects },
    };
  },
});
