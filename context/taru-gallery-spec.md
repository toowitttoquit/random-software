# Taru - Portfolio Gallery Writeup

## One-Liner

An AI research assistant that helps you internalize the podcasts, articles, and newsletters you already consume — turning passive listening into a searchable, connected record of your own thinking.

## The Name

Taru (足) — Japanese for "sufficient," from the tsukubai inscription at Kyoto's Ryoan-ji Temple: 吾唯足知 ("I learn only to be contented"). The product philosophy mirrors this: depth over breadth, sufficiency over accumulation.

---

## The Problem

You subscribe to the right podcasts. You read the sharpest newsletters. You follow thinkers who genuinely change how you see the world. But when someone asks you about an idea you heard three weeks ago, you get the gist — maybe — and lose the details entirely.

Bookmarks collect dust. Highlights sit in apps you never reopen. Note-taking systems demand more time than the content itself. The gap between what you consume and what you retain is enormous — and it widens every week.

Podcasts are the worst offender: hours of rich conversation, locked behind audio, with no way to search, annotate, or retrieve the ideas inside.

---

## What Taru Does

### The Core Loop: Capture > Reflect > Remember

**1. Capture**
Share a podcast, article, or newsletter from your phone (iOS Shortcut, Telegram bot) or browser. Taru handles full transcription (via Deepgram), deep AI analysis, and key insight extraction — all in minutes.

**2. Reflect**
When processing completes, Taru opens a short Socratic conversation. Not a summary — a dialogue. It asks what resonated, surfaces connections to things you've captured before, and helps you articulate your own take. This happens inline in Telegram or in the web app.

**3. Remember**
Your reflections get indexed alongside the source material into a growing Knowledge Garden. Every insight is searchable, connected, and compounding — building a record of not just what you've consumed, but what you think.

### What Makes It Different

- **It starts after you've consumed something.** Most AI tools help you consume faster. Taru helps you hold onto what you've already consumed.
- **It asks what you think.** Summaries are easy. Taru's reflection conversations draw out your perspective — what surprised you, what you disagree with, what connects to something you heard last month.
- **It compounds over time.** Your tenth capture is more valuable than your first. Taru surfaces contradictions in your thinking, unexpected connections between sources, and patterns in what resonates with you.

---

## Key Features

### AI-Powered Content Processing
- Full podcast transcription with speaker diarization (Deepgram Nova-3)
- Deep multi-model analysis: Gemini 2.5 Flash for quick analysis, Claude Sonnet 4.5 for deep reasoning
- Article scraping and structured extraction for newsletters and blog posts

### Telegram Bot as Primary Interface
- AI research assistant powered by Claude with tool use (search memories, capture URLs, start reflections)
- Inline Socratic reflection conversations — no context switching
- Onboarding flow that builds a user portrait through natural conversation
- Dynamic personalization: the bot learns communication preferences over time

### Knowledge Garden
- Interactive force-graph visualization of extracted memories (UMAP + HDBSCAN clustering)
- Memory lifecycle stages: sprouting > growing > mature > evergreen
- Typed connections between memories: related, contradicts, builds_on, example_of, refines, applies, complements
- Semantic search over both memories and analyses (OpenAI embeddings + HNSW indexes)
- AI-generated cluster summaries that synthesize related knowledge themes

### Collections & Writing
- Group analyzed items into themed collections
- Generate AI outputs from collections (roundups, reflections, articles)
- Writing Studio with Tiptap editor and AI-powered reference finding
- Chat conversations linked to drafts for research assistance

### Multi-Channel Capture
- Telegram bot (primary)
- Web app capture page
- iOS Shortcuts via long-lived capture tokens
- Feed browser for RSS discovery

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Backend | Python 3.11 / FastAPI / Google Cloud Run |
| Frontend | TypeScript / Next.js 14 (App Router) / Tailwind / shadcn/ui |
| Database | Supabase PostgreSQL (RLS, Google OAuth) |
| AI - Quick Analysis | Gemini 2.5 Flash |
| AI - Transcription | Deepgram Nova-3 |
| AI - Deep Analysis & Chat | Claude Sonnet 4.5 |
| AI - Embeddings | OpenAI text-embedding-3-small |
| Background Jobs | Google Cloud Tasks |
| Deployment | GCP Cloud Run (API) + Vercel (frontend) |

### Architecture Highlights

**Multi-Model AI Strategy**
Four AI providers, each chosen for what they do best. Gemini for fast/cheap content processing (~$0.02/item). Deepgram for dedicated speech-to-text with speaker diarization. Claude for nuanced reasoning and tool-use conversations. OpenAI for embeddings. Total deep analysis cost: ~$0.10-0.20/item.

**Serverless-First on GCP**
Cloud Run with min-instances=1 (always warm, no cold starts). Cloud Tasks for async background processing with OIDC auth and automatic retries. Secret Manager for all credentials. Running cost: ~$5-10/month.

**Layered Backend Architecture**
Routers (HTTP) > Services (business logic) > Infrastructure (DB, AI clients). DDD patterns for the memory system (domain models, application use cases, repository ports). Unified capture pipeline that all intake channels flow through.

**Personalization Engine**
- User briefing: rich portrait generated during onboarding, refreshed every 10 analyses
- Scratchpad: AI-maintained running context updated after each deep analysis
- AI preferences: explicit behavioral directives the user sets through natural conversation
- All three feed into every AI interaction (analysis prompts, chat system prompts, reflection conversations)

**Memory System (DDD)**
Domain-driven design for the knowledge garden. Memories have lifecycle stages, typed connections with confidence scores, cluster membership, and provenance tracking back to source analyses. Graph layout computed via UMAP dimensionality reduction + HDBSCAN clustering, cached per-user with lazy invalidation.

---

## Design Philosophy

### Visual Identity: Zen Minimalism
Inspired by the Japanese aesthetic of *ma* (meaningful space). Muted natural tones — moss green, warm sand, weathered stone. Generous whitespace as a design element. Calm transitions (300ms ease, no bounce). The UI feels like a personal library, not a dashboard.

### Brand Keywords
Contemplative, unhurried, warm, literate, rooted, cultivated, intentional, quiet confidence

### Anti-Patterns
No gamification or streak counters. No "47 unread items" anxiety. No bright notification dots. No infinite scroll. No "powered by AI" badges. The intelligence is felt, not advertised.

---

## Architectural Decisions Worth Noting

1. **Multi-model over single-model** — 10-20x cost savings on routine tasks while preserving quality for deep reasoning
2. **Cloud Tasks over Celery/Redis** — eliminated infrastructure complexity, pay-per-task, built-in retry
3. **Telegram as primary interface** — meets users where they already are; no app install friction; rich enough for Socratic dialogue
4. **Reflection before indexing** — memories contain both what the content said AND what the user thought about it, making the knowledge garden genuinely personal
5. **Push-based capture over pull-based RSS** — user intent signals quality; no inbox triage needed
6. **Deepgram over Gemini for transcription** — dedicated STT model gives 5.26% WER, reliable diarization, no hallucination on long episodes

---

## Status

Solo-built project. Currently in personal use / early access. The system processes podcasts, newsletters, and articles daily through the Telegram bot, with ~200+ memories in the knowledge garden and growing.
