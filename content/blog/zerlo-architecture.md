---
title: "Behind Zerlo: Orchestrating Models, DSLs, and 3D Pipelines"
slug: "zerlo-architecture"
date: "2025-08-25"
excerpt: "How Zerlo composes specialized services—like Base 44—and custom languages to generate full 3D games."
tags: ["architecture", "ai", "dsl", "pipelines"]
author: "Zerlo Engineering"
coverImage: "/assets/images/bg.jpg"
---

Zerlo’s pipeline **turns intent into a runnable 3D game**:

1. **Intent Parser** — transforms natural language into a structured spec.
2. **Design DSLs** — domain-specific languages for levels, mechanics, and AI.
3. **Generators** — code and asset synthesis orchestrated against engines and toolchains.
4. **Validation** — compile, lint, playtest bots, and perf checks.
5. **Delivery** — a playable project you can run, edit, or export.

**Base 44** is our internal service layer for deterministic builds, asset caching, and sandboxed compilation.

We combine frontier models (e.g., GPT/Gemini) with Zerlo-specific training data and validators.  
The result is **fast iteration** with **production-quality scaffolds**.
