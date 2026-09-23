import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight, Blocks, Braces, CheckCircle2, Code2, Coffee, Database,
  ExternalLink, GitBranch, Github, Globe2, Linkedin, Mail, Menu, Moon,
  Send, Server, Sparkles, Sun, Terminal, ToolCase, X,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { DecryptText } from "@/components/fx/decrypt-text";
import { HorizontalGallery } from "@/components/fx/horizontal-gallery";
import { ImageTrail } from "@/components/fx/image-trail";
import { PhysicsTags } from "@/components/fx/physics-tags";
import { XRayLayer } from "@/components/fx/xray-layer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Nikhil Saxena — Full Stack Developer" },
    { name: "description", content: "Portfolio of Nikhil Saxena, a full stack developer crafting reliable, thoughtful digital products." },
    { property: "og:title", content: "Nikhil Saxena — Full Stack Developer" },
    { property: "og:description", content: "Thoughtful digital products, scalable systems, and open-source work." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

type Project = { id: string; title: string; description: string; tech_stack: string[]; image_url: string | null; live_url: string | null; github_url: string | null; featured: boolean };

const navItems = ["Home", "Skills", "Open Source", "Projects", "About", "Contact"];
const skillGroups = [
  { title: "Frontend", icon: Braces, skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Motion"] },
  { title: "Backend", icon: Server, skills: ["Node.js", "PostgreSQL", "REST APIs", "Lovable Cloud", "Redis"] },
  { title: "Tools", icon: ToolCase, skills: ["Git", "Docker", "Vercel", "Figma", "CI/CD"] },
];
const allSkills = skillGroups.flatMap((group) => group.skills);
const heroLines = ["I build software", "that feels inevitable."];
const heroXrayLines = ["I break things", "until they hold."];
const contributions = [
  { repo: "shadcn-ui/ui", title: "Improve keyboard navigation in command menu", status: "Merged", number: "#4821" },
  { repo: "tanstack/router", title: "Clarify route context examples", status: "Merged", number: "#3398" },
  { repo: "motiondivision/motion", title: "Add reduced-motion recipe to documentation", status: "Open", number: "#2740" },
];
const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email.").max(255),
  message: z.string().trim().min(10, "Please share a little more detail.").max(2000),
});

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6 } };

function Index() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.documentElement.classList.add("dark");
    const saved = localStorage.getItem("portfolio-theme");
    const isDark = saved !== "light";
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  useEffect(() => {
    let active = true;
    supabase.from("projects").select("id,title,description,tech_stack,image_url,live_url,github_url,featured").order("display_order").then(({ data, error }) => {
      if (!active) return;
      if (error) toast.error("Projects could not be loaded right now.");
      else setProjects(data ?? []);
      setLoadingProjects(false);
    });
    return () => { active = false; };
  }, []);

  const toggleTheme = (checked: boolean) => {
    setDark(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("portfolio-theme", checked ? "dark" : "light");
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const parsed = contactSchema.safeParse({ name: form.get("name"), email: form.get("email"), message: form.get("message") });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { const key = String(issue.path[0]); if (!next[key]) next[key] = issue.message; });
      setErrors(next);
      return;
    }
    setErrors({}); setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setSubmitting(false);
    if (error) { toast.error("Your message wasn’t sent. Please try again."); return; }
    formElement.reset();
    toast.success("Message sent — I’ll get back to you soon.", { icon: <CheckCircle2 className="size-4" /> });
  };

  return <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
        <a href="#home" className="font-mono text-sm font-bold text-foreground">NS<span className="text-primary">.</span></a>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>)}
        </div>
        <div className="flex items-center gap-3">
          <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
          <Switch checked={dark} onCheckedChange={toggleTheme} aria-label="Use dark theme" />
          <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</Button>
        </div>
      </nav>
      {menuOpen && <div className="glass-panel border-x-0 border-t px-5 py-4 md:hidden">{navItems.map((item) => <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground">{item}</a>)}</div>}
    </header>

    <main>
      <section id="home" className="relative flex min-h-[92vh] items-center overflow-hidden pt-20">
        <div className="grid-texture pointer-events-none absolute inset-0 opacity-55" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-24 lg:px-8">
          <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.1 } } }} className="relative z-10 max-w-5xl">
            <motion.div variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }} className="mb-7 flex items-center gap-3 font-mono text-xs uppercase text-code"><span className="h-px w-8 bg-code" />Available for select projects</motion.div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] sm:text-7xl lg:text-8xl">
              {heroLines.map((line) => <motion.span key={line} variants={{ initial: { opacity: 0, y: 34 }, animate: { opacity: 1, y: 0 } }} className="block">{line}</motion.span>)}
            </h1>
            <motion.p variants={{ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } }} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">Full stack developer crafting thoughtful interfaces, resilient systems, and digital products built to last.</motion.p>
            <motion.div variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }} className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild variant="glow" size="lg"><a href="#projects">View projects <ArrowUpRight /></a></Button>
              <Button asChild variant="glass" size="lg"><a href="#contact">Contact me <Mail /></a></Button>
              <span className="mx-2 hidden h-6 w-px bg-border sm:block" />
              <Button asChild variant="ghost" size="icon"><a href="https://github.com/yourusername" target="_blank" rel="noreferrer" aria-label="GitHub"><Github /></a></Button>
              <Button asChild variant="ghost" size="icon"><a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a></Button>
            </motion.div>
            <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">move your cursor — there is something under the surface</p>
          </motion.div>

          <XRayLayer radius={210}>
            <div className="absolute inset-0 bg-foreground/[0.06]" />
            <div className="absolute inset-0 px-5 py-24 lg:px-8">
              <div className="max-w-5xl">
                <div className="mb-7 flex items-center gap-3 font-mono text-xs uppercase text-primary"><span className="h-px w-8 bg-primary" />Decrypted layer · 0x01</div>
                <h2 className="xray-type max-w-4xl text-5xl font-semibold leading-[1.03] sm:text-7xl lg:text-8xl">
                  {heroXrayLines.map((line) => <span key={line} className="block">{line}</span>)}
                </h2>
                <p className="xray-type mt-7 max-w-2xl text-lg leading-relaxed sm:text-xl">Ten years of curiosity compressed into shipping habits. Hidden message: hire the person who reads the source.</p>
              </div>
            </div>
          </XRayLayer>
        </div>
      </section>

      <section id="skills" className="border-y border-border bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading number="01" eyebrow="Capabilities" title="MY TOOLKIT" />
          <div className="mt-6 flex flex-wrap gap-5 font-mono text-xs uppercase text-muted-foreground">
            {skillGroups.map((group) => <span key={group.title} className="flex items-center gap-2"><group.icon className="size-4 text-primary" />{group.title}</span>)}
          </div>
          <div className="mt-8"><PhysicsTags tags={allSkills} /></div>
          <div className="mt-10 overflow-hidden border-y border-border py-4" aria-hidden="true"><div className="animate-marquee flex w-max gap-10 font-mono text-xs uppercase text-muted-foreground">{[...allSkills, ...allSkills].map((skill, i) => <span key={`${skill}-${i}`} className="flex items-center gap-3"><Sparkles className="size-3 text-primary" />{skill}</span>)}</div></div>
        </div>
      </section>

      <section id="open-source" className="py-24 sm:py-32"><div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading number="02" eyebrow="Open source" title="BUILT IN PUBLIC" />
        <motion.div {...reveal} className="mt-12 grid overflow-hidden rounded-lg border border-border bg-foreground text-background sm:grid-cols-3">
          {[ ["48+", "Contributions"], ["12", "Repositories"], ["8", "Merged PRs"] ].map(([value,label]) => <div key={label} className="border-b border-background/15 p-7 last:border-0 sm:border-b-0 sm:border-r"><div className="font-mono text-3xl font-bold text-primary">{value}</div><div className="mt-1 text-sm text-background/65">{label}</div></div>)}
        </motion.div>
        <div className="mt-8 divide-y divide-border border-y border-border">{contributions.map((item, index) => <motion.a {...reveal} transition={{ duration: .45, delay: index*.06 }} key={item.number} href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="group grid gap-3 py-6 sm:grid-cols-[1fr_2fr_auto] sm:items-center">
          <span className="flex items-center gap-2 font-mono text-xs text-code"><GitBranch className="size-4" />{item.repo}</span><span className="font-medium group-hover:text-primary">{item.title} <span className="text-muted-foreground">{item.number}</span></span><span className="flex items-center gap-2 text-xs text-muted-foreground"><span className={`size-2 rounded-full ${item.status === "Merged" ? "bg-code" : "bg-primary"}`} />{item.status}<ArrowUpRight className="size-4" /></span>
        </motion.a>)}</div>
      </div></section>

      <section id="projects" className="border-y border-border bg-muted/30 py-24 sm:py-32">
        <ImageTrail labels={projects.map((p) => p.title)} className="overflow-hidden">
          {loadingProjects ? <div className="mx-auto grid max-w-7xl gap-5 px-5 md:grid-cols-2 lg:px-8">{[1,2,3].map(i => <div key={i} className="h-[410px] animate-pulse rounded-lg bg-muted" />)}</div> : <HorizontalGallery
            header={<SectionHeading number="03" eyebrow="Selected work" title="MY PROJECTS" />}
            slides={projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
          />}
        </ImageTrail>
      </section>


      <section id="about" className="relative overflow-hidden py-24 sm:py-32"><div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:px-8">
        <motion.div {...reveal} animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-border bg-surface-strong">
          <div className="grid-texture absolute inset-0 opacity-70" /><div className="absolute inset-6 flex items-center justify-center rounded-md border border-border bg-background/50 backdrop-blur-sm"><div className="text-center"><Code2 className="mx-auto size-12 text-primary" /><p className="mt-4 font-mono text-xs text-muted-foreground">YOUR PHOTO HERE</p></div></div>
        </motion.div>
        <motion.div {...reveal}><SectionHeading number="04" eyebrow="About me" title="CURIOUS BY NATURE" />
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground"><p>I’m Nikhil, a software developer focused on building useful, dependable experiences across the stack. I enjoy the space where strong engineering meets thoughtful design.</p><p>When I’m not shipping products, you’ll find me exploring open-source projects, sharpening systems knowledge, or turning coffee into side projects.</p></div>
          <div className="mt-9 flex flex-wrap gap-5 font-mono text-xs text-muted-foreground"><span className="flex items-center gap-2"><Globe2 className="size-4 text-primary" />India · Open to remote</span><span className="flex items-center gap-2"><Coffee className="size-4 text-primary" />Powered by curiosity</span></div>
        </motion.div>
      </div>
        <XRayLayer radius={170}>
          <div className="absolute inset-0 bg-foreground/[0.07]" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <p className="xray-type max-w-3xl text-center font-mono text-2xl font-semibold uppercase leading-snug sm:text-4xl">
              Hidden layer: I’d rather ship one honest thing than ten clever ones.
            </p>
          </div>
        </XRayLayer>
      </section>

      <section id="contact" className="border-t border-border bg-muted/30 py-24 sm:py-32"><div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <motion.div {...reveal}><SectionHeading number="05" eyebrow="Contact" title="Have a problem worth solving? Let’s talk." /><p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">I’m always interested in thoughtful products, ambitious teams, and useful open-source work.</p><a href="mailto:hello@example.com" className="mt-8 inline-flex items-center gap-3 font-mono text-sm text-foreground hover:text-primary"><Mail className="size-4" />hello@example.com</a></motion.div>
        <motion.form {...reveal} onSubmit={submitContact} className="glass-panel space-y-5 rounded-lg p-6 sm:p-8" noValidate>
          <Field label="Name" error={errors["name"]}><Input name="name" maxLength={100} placeholder="Your name" aria-invalid={Boolean(errors["name"])} /></Field>
          <Field label="Email" error={errors["email"]}><Input name="email" type="email" maxLength={255} placeholder="you@company.com" aria-invalid={Boolean(errors["email"])} /></Field>
          <Field label="Message" error={errors["message"]}><Textarea name="message" maxLength={2000} rows={6} placeholder="Tell me about the project, problem, or opportunity..." aria-invalid={Boolean(errors["message"])} /></Field>
          <Button type="submit" variant="glow" size="lg" className="w-full sm:w-auto" disabled={submitting}>{submitting ? "Sending…" : "Send message"}<Send /></Button>
        </motion.form>
      </div></section>
    </main>

    <footer className="border-t border-border py-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© 2026 Nikhil Saxena. Built with care.</p><div className="flex gap-5"><a href="https://github.com/yourusername" className="hover:text-foreground">GitHub</a><a href="https://linkedin.com/in/yourusername" className="hover:text-foreground">LinkedIn</a><a href="#home" className="hover:text-foreground">Back to top ↑</a></div></div></footer>
  </div>;
}

function SectionHeading({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }}>
    <div className="flex items-center gap-3 font-mono text-xs uppercase text-code"><span>{number}</span><span className="h-px w-7 bg-code" />{eyebrow}</div>
    <DecryptText as="h2" text={title} className="mt-4 block max-w-3xl font-mono text-2xl font-semibold uppercase leading-tight tracking-tight sm:text-4xl" />
  </motion.div>;
}
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = [Database, Blocks, Terminal][index % 3] ?? Code2;
  const trackRipple = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--trail-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty("--trail-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };
  return <motion.article {...reveal} transition={{ duration: .55, delay: index*.08 }} className="group glass-panel h-full overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div onPointerMove={trackRipple} className="liquid-surface relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b border-border bg-surface-strong"><div className="grid-texture absolute inset-0 opacity-70" /><Icon className="relative z-[2] size-14 text-primary transition-transform duration-500 group-hover:scale-110" />{project.featured && <span className="absolute left-4 top-4 z-[2] rounded-md border border-border bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase backdrop-blur">Featured</span>}</div>
    <div className="p-6"><h3 className="text-xl font-semibold">{project.title}</h3><p className="mt-3 min-h-20 text-sm leading-relaxed text-muted-foreground">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tech_stack.map(t => <span key={t} className="font-mono text-[11px] text-code">#{t.replaceAll(" ", "-").toLowerCase()}</span>)}</div><div className="mt-6 flex gap-2">{project.live_url && <Button asChild variant="secondary" size="sm"><a href={project.live_url} target="_blank" rel="noreferrer">Live <ExternalLink /></a></Button>}{project.github_url && <Button asChild variant="ghost" size="sm"><a href={project.github_url} target="_blank" rel="noreferrer"><Github />Code</a></Button>}</div></div>
  </motion.article>;
}
function Field({ label, error, children }: { label: string; error: string | undefined; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium">{label}</span>{children}{error && <span className="mt-1.5 block text-xs text-destructive">{error}</span>}</label>; }
