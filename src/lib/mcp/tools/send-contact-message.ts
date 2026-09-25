import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon } from "../supabase";

export default defineTool({
  name: "send_contact_message",
  title: "Send contact message",
  description: "Send a message to Nikhil Saxena through the portfolio contact form.",
  inputSchema: {
    name: z.string().trim().min(2).max(100).describe("Sender name."),
    email: z.string().trim().email().max(255).describe("Sender email for replies."),
    message: z.string().trim().min(10).max(2000).describe("Message body."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, email, message }) => {
    const { error } = await supabaseAnon().from("contact_messages").insert({ name, email, message });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: "Message sent." }] };
  },
});
