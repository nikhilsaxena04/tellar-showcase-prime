import { defineMcp } from "@lovable.dev/mcp-js";
import listProjects from "./tools/list-projects";
import sendContactMessage from "./tools/send-contact-message";

export default defineMcp({
  name: "portfolio-spotlight",
  title: "Portfolio Spotlight",
  version: "0.1.0",
  instructions:
    "Tools for Nikhil Saxena's developer portfolio. Use `list_projects` to browse projects and `send_contact_message` to get in touch.",
  tools: [listProjects, sendContactMessage],
});
