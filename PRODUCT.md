# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML, CSS and JavaScript without a framework, a Node build script and a Cloudflare Worker of static assets at
`pedrogomez.dev/proyecto/arranque-dual`, as every other piece in `CODE` (see `../CLAUDE.md`). No dependencies.

## Users

Anyone with a Windows 10/11 PC who wants Ubuntu next to Windows (dual boot) without losing Windows. Confirmed with
Pedro: the guide is generic, not tied to his machine. The first user is Pedro himself, a developer who works daily
with AI agents (Claude Code), Node, Python, Java/Spring and Docker.

The usage scene is specific: the guide is read on a **phone** while the PC is busy (in the firmware setup, booting
from the USB, inside the Ubuntu installer). For part of the process the PC cannot show the guide at all.

## Product Purpose

A step by step guide to install Ubuntu LTS next to Windows safely: what to download (official links only), how to
prepare Windows (backup, BitLocker key, fast startup, shrinking the volume), the installation itself, the first boot
with a developer toolset, choosing the default system and how to undo everything. Success: the reader finishes with
both systems booting and nothing lost, and always knows which step they are on.

## Positioning

A checklist you follow with the PC off: progress is kept on the phone, each step says what you should see on the
screen and what to do if you don't, and it ends with the way back (removing Ubuntu) as a first class step, not a
footnote.

## Operating Context

Phone in one hand, keyboard in the other. Steps happen in Windows, in the UEFI firmware, in the Ubuntu live session
and in the installed Ubuntu. The reader may lose the page (screen lock, tab reload), so progress must survive a
reload. Network may be poor; the page must be light and work once loaded.

## Capabilities and Constraints

- Mark each step as done; progress saved in `localStorage` on the device, with a way to reset it.
- No ISO or binaries hosted: Workers cap files at 25 MiB and the ISO is several GB. Only links to the official pages
  (ubuntu.com, rufus.ie, etcher.balena.io, code.claude.com, nodejs, docker docs, VS Code).
- Commands must be copyable on the phone and typed on the PC, so they stay short and are shown in full.
- Facts with a date (Ubuntu 26.04.1 LTS, Rufus 4.16) checked on 2026-11-23; written so a point release does not
  break the guide.
- Spanish from Spain. No analytics, no cookies.

## Brand Commitments

Part of pedrogomez.dev: links back to the portfolio, credits Pedro Gómez. Voice: plain, direct Spanish, explains the
why of each step, no hype.

## Evidence on Hand

No screenshots of the installer are shipped (none were taken on a real install); the guide describes screens in
words. Do not invent screenshots or claim tested hardware.

## Product Principles

1. Nothing irreversible without a warning before it, and a way back after it.
2. Each step says what you should see; if you don't, what to do.
3. Works with one thumb on a phone, offline once loaded.
4. Official sources only; dated facts are marked as such.

## Accessibility & Inclusion

WCAG 2.2 AA. Checkboxes are real form controls with labels, keyboard operable, visible focus, respects
`prefers-reduced-motion` and the system colour scheme (the phone is often read in a dark room next to the PC).
