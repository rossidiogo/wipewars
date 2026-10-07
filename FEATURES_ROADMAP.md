# Wipe Wars - FEATURES ROADMAP (master backlog of everything Diogo approved or suggested)
Owner granted FULL AUTONOMY (2026-10-07): build all of this without asking. New features go in NEW js files; hook minimal lines in existing files; test in the browser; commit + push; log in art_gen/JOURNAL.md.

## Tower (DESIGN FIXED BY DIOGO)
- Standard auto-battler tower (same battle system, floors in sequence, rewards per floor, ranking of highest floor).
- STORY: Julia (the tutorial character) gets CORRUPTED and becomes a VILLAIN: she is the TOWER BOSS, like Diogo (Big Head) is the boss of every chapter. She fights at BREAKPOINT floors (e.g. every 10 floors), changing appearance each breakpoint (corrupted look; art later).
- UNLOCK: when the Julia tutorial has taught most systems (around the chapter where most features are unlocked; tutorial must be completed first).
- Tower monsters: related to Julia (theme TBD later by Diogo; placeholders for now).
## PvP (async arena)
- Fight other players' saved teams (friends first), ranking, daily attempts, rewards. Needs Net layer for real opponents; ghost/AI opponents offline.
## Online (friends, guild, ranking, cloud save)
- Pluggable `Net` adapter (js/net.js): local mock now, Supabase/Firebase later (needs Diogo to create the free project once). Friends list + daily gifts, guild (create/join, weekly boss, 3 attacks/day, ranking), cloud save, leaderboards.
## Other approved ideas
- Mascots/pets, collection codex, fishing (Lucao theme), seasonal events, boss rush, skins, guild emblems/avatar frames/stickers, more heroes/chapters, music and sound pack, balance pass (cap1 ~2h, whole game 3-4 weeks).
## Systems already decided
- Heroes have main attribute STR/DEX/INT; attribute decides the item SET (3 rare sets Bulwark/Fury/Mercy); uniques/legendaries with hybrid attributes later.
