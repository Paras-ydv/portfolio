import type { ComponentType } from "react";
import { Network, Search, Radio, Sparkles, MousePointerClick } from "lucide-react";
import {
  SiNextdotjs,
  SiTypescript,
  SiReact,
  SiThreedotjs,
  SiLangchain,
  SiNodedotjs,
  SiTailwindcss,
  SiGithub,
  SiFastapi,
  SiRedis,
  SiPython,
  SiKotlin,
  SiAndroid,
  SiJetpackcompose,
  SiEclipsemosquitto,
  SiSupabase,
  SiDatabricks,
  SiPostgresql,
  SiDocker,
  SiGrafana,
  SiPrometheus,
  SiScikitlearn,
  SiQdrant,
  SiGooglechrome,
  SiGradle,
  SiJunit5,
  SiCplusplus,
  SiApple,
  SiHomebrew,
  SiGnubash,
} from "react-icons/si";

export type TechIcon = ComponentType<{ className?: string }>;
export type TechKey =
  | "next" | "ts" | "react" | "three" | "langchain" | "langgraph" | "rag"
  | "node" | "tailwind" | "github" | "fastapi" | "redis" | "python"
  | "kotlin" | "android" | "compose" | "mqtt" | "supabase" | "databricks"
  | "postgres" | "docker" | "grafana" | "prometheus" | "sklearn" | "qdrant"
  | "chrome" | "gradle" | "junit" | "playwright" | "websockets" | "llm"
  | "cpp" | "macos" | "homebrew" | "shell";

export type TechItem = TechKey | { label: string; tooltip?: string; };

export type ProjectStatus = "live" | "building" | "research" | "archived";

export interface Project {
  slug: string;
  title: string;
  imageTitle: string;
  src: string;
  lightModeSrc?: string;
  description: string;
  tech: TechItem[];
  github: string;
  /** Omit when there is nothing working to link to. */
  live?: string;
  status: ProjectStatus;
  starsText?: string;
  backgroundImage?: string;
  hasPin: boolean;
}

export const iconMap: Record<TechKey, TechIcon> = {
  next: SiNextdotjs, ts: SiTypescript, react: SiReact, three: SiThreedotjs,
  langchain: SiLangchain, langgraph: Network, rag: Search, node: SiNodedotjs,
  tailwind: SiTailwindcss, github: SiGithub, fastapi: SiFastapi, redis: SiRedis,
  python: SiPython, kotlin: SiKotlin, android: SiAndroid, compose: SiJetpackcompose,
  mqtt: SiEclipsemosquitto, supabase: SiSupabase, databricks: SiDatabricks,
  postgres: SiPostgresql, docker: SiDocker, grafana: SiGrafana, prometheus: SiPrometheus,
  sklearn: SiScikitlearn, qdrant: SiQdrant, chrome: SiGooglechrome, gradle: SiGradle,
  junit: SiJunit5, playwright: MousePointerClick, websockets: Radio, llm: Sparkles,
  cpp: SiCplusplus, macos: SiApple, homebrew: SiHomebrew, shell: SiGnubash,
};

export const techNames: Record<TechKey, string> = {
  next: "Next.js", ts: "TypeScript", react: "React", three: "Three.js",
  langchain: "LangChain", langgraph: "LangGraph", rag: "RAG", node: "Node.js",
  tailwind: "Tailwind CSS", github: "GitHub API", fastapi: "FastAPI", redis: "Redis",
  python: "Python", kotlin: "Kotlin", android: "Android", compose: "Jetpack Compose",
  mqtt: "MQTT", supabase: "Supabase", databricks: "Databricks", postgres: "PostgreSQL",
  docker: "Docker", grafana: "Grafana", prometheus: "Prometheus", sklearn: "scikit-learn",
  qdrant: "Qdrant", chrome: "Chrome Extension", gradle: "Gradle", junit: "JUnit",
  playwright: "Playwright", websockets: "WebSockets", llm: "LLM",
  cpp: "C++", macos: "macOS", homebrew: "Homebrew", shell: "Shell",
};

export const projectsData: Project[] = [
  {
    slug: "cp-mac",
    title: "cp-mac",
    imageTitle: "Same code. Now it runs.",
    src: "/project-image/cp-mac.png",
    description: "On macOS, g++ is really Apple Clang, so competitive programming code that passes every judge fails locally. cp-mac makes bits/stdc++.h, pb_ds, rope and __gcd work under Apple Clang - plus a judge-size stack for deep recursion - in one install, with no GCC and no editor reconfiguration.",
    tech: ["cpp", "macos", "homebrew", "shell"],
    github: "https://github.com/Paras-ydv/cp-mac",
    status: "live",
    hasPin: true,
  },
  {
    slug: "testpilot-ai",
    title: "TestPilot AI",
    imageTitle: "Agent Dashboard",
    src: "/project-image/testpilot-ui.png",
    description: "An autonomous agent that explores a running web app, decides what to do next from live runtime behaviour, and reports what broke — with no pre-written test scripts.",
    tech: ["ts", "langgraph", "playwright", "qdrant", "node"],
    github: "https://github.com/Paras-ydv/TestPilot_AI",
    live: "",
    status: "live",
    backgroundImage: "/project-hover-testpilot-ai.webp",
    hasPin: true,
  },
  {
    slug: "campusquest",
    title: "CampusQuest",
    imageTitle: "Campus Engine",
    src: "/project-image/campusquest-ui.png",
    description: "Databricks Hackathon finalist. A campus career engine with a what-if skill simulator, quests and XP, gap-based people matching, and Ask Genie over campus data. The Databricks workspace was decommissioned after the event, so the demo is offline and the code is the record.",
    tech: ["next", "supabase", "databricks", "ts", "postgres"],
    github: "https://github.com/Paras-ydv/CampusQuest",
    status: "archived",
    backgroundImage: "/project-hover-campusquest.webp",
    hasPin: true,
  },
  {
    slug: "ventureiq",
    title: "VentureIQ",
    imageTitle: "Investment Intelligence",
    src: "/project-image/ventureiq-ui.png",
    description: "An agentic-AI and RAG startup investment platform that verifies what founders self-report and gives investors an explainable score before they commit money.",
    tech: ["next", "ts", "python", "rag", "langchain", "fastapi"],
    github: "https://github.com/Paras-ydv/VentureIQ",
    live: "https://venture-iq-mocha.vercel.app",
    status: "building",
    backgroundImage: "/project-hover-ventureiq.webp",
    hasPin: false,
  },
  {
    slug: "wifi-rtt",
    title: "Wi-Fi RTT Ranging",
    imageTitle: "Ranging App",
    src: "/project-image/wifirtt-devices.png",
    description: "The Samsung PRISM research app behind 600+ labelled measurements — Wi-Fi Aware and IEEE 802.11mc ranging, feeding a model that hit MAE 0.443 m and 87% within 1 m.",
    tech: ["kotlin", "compose", "python", "sklearn", "fastapi"],
    github: "https://github.com/Paras-ydv/wifi_rtt_measurement",
    live: "",
    status: "research",
    backgroundImage: "/project-hover-wifi-rtt.webp",
    hasPin: false,
  },
  {
    slug: "unslop",
    title: "Unslop",
    imageTitle: "Feed Scoring",
    src: "/project-image/unslop-card.png",
    description: "A Chrome extension that flags low-value and AI-slop posts in your LinkedIn feed in real time, scored on-device. No post ever leaves the browser.",
    tech: ["ts", "chrome", "node"],
    github: "https://github.com/Paras-ydv/Unslop",
    live: "",
    status: "building",
    backgroundImage: "/project-hover-unslop.webp",
    hasPin: false,
  },
];
