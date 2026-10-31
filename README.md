# Page Fishing

An on-page SVG fishing toy for Chrome and Edge. Fish swim across the website as you browse and scroll. Click a fish: the rod casts, the fish wriggles along the line, then drops into the bucket at the top right. Click the bucket to inspect saved catches.

## Install

1. Open chrome://extensions or edge://extensions.
2. Enable Developer mode.
3. Choose Load unpacked, then select this page-fishing folder.
4. Pin the extension, visit a regular website, and click its icon.

After code changes, reload the extension on that screen and refresh the website. Browser settings and extension stores cannot host the game; a ! badge means you should try a regular website.

## Demo

Open demo.html in a browser. Scroll to encounter fish. The demo saves using localStorage; the installed extension uses chrome.storage.local across websites. Their collections are separate.

## Features

- Twenty-eight species: guppy, angelfish, puffer, ribbonfish, butterflyfish, lanternfish, reef shark, moon koi, veiltail, seahorse, manta ray, leaf dragon, sea turtle, jellyfish, octopus, crab, nautilus, dolphin, whale shark, moon whale, starfish, shrimp, squid, lobster, seal, penguin, axolotl, and ocean sunfish. Catch effort scales with creature size and mass: small/common fish are 1 click; large creatures (manta rays, dolphins, ocean sunfish, seals, turtles) require 2 clicks; apex titans (reef sharks, whale sharks, moon whales, or giant trophy specimens) require 3 clicks with line tugs and effort indicators.
- Eight palettes, three patterns, scale lines, fin rays, gill details, shaded bodies, and rare crowned variants.
- Four rarity tiers: Common, Uncommon, Rare, and Legendary. Species use 10,000 weighted tickets per encounter. Displayed 1-in-N odds come from these weights (rounded values marked approximately). These are independent game encounters, not real-world animal prevalence; cosmetic colors/patterns are not included in species odds.
- A rebuilt cork-handled rod with metallic reel, moving line guides, and shaft flex synchronized to the casting and reeling timeline.
- Open the bucket and choose Release bucket: it arcs to the center, tips out its fish, and returns over 5.2 seconds while the creatures fan out in random directions across the full circle over 3 seconds or more and fade. Up to 28 fish are animated for performance; the entire bucket is released.
- The Fish index is a paginated field-guide book with locked silhouettes, species encounter odds, rarity badges, and catch counts. Release empties only the bucket. Released state is saved across reloads.
- Animated tails and fins, gentle swimming in varied directions and speeds, scroll-triggered spawning without positional drift, curved casting line, crisp hookset splash, dynamic water spray and wake bubbles while reeling, heavy-species struggle vibrations, unhooked parabolic flight, bucket bounce, and landing particles.
- Maximum seven creatures at once. If only one free creature remains visible, a replacement starts immediately at a side edge and swims into view; it no longer appears in the middle. Offscreen or hooked creatures do not count toward the minimum of two. Only creatures and controls intercept clicks.
- Keyboard-accessible fish and controls, pause, audio mute toggle, reduced-motion support, and cleanup on close.
- Collection remembers source website, date, size, appearance, and detected habitat. Older prototype catches are retained.
- Interactive water: clicking open water sends out gentle ripples that nearby fish curiously turn toward; fast cursor sweeps evoke a responsive tail flick.
- Procedural Web Audio: gentle, organic synthesized sound effects (casting swoosh, rhythmic reel clicks, landing bucket plop, shark tug, celestial discovery chimes, release whoosh, and droplet ripples) with persistent mute control (`M` key or audio button).
- Bucket collection features: sort catches by Latest, Largest, or Rarity; personal best trophies (`Record`) highlighted for each species; individual fish release (`Free` button) allowing single catches to leap back into the water without emptying the bucket.
- Pearl Currency System: Earn pearls on every catch scaled by rarity and fish size (+25 pearls bonus for newly discovered species). Freeing single fish or releasing the whole bucket awards ~50% karma pearl cashback.
- Tackle Boutique (Shop tab): Spend earned pearls on customizable gear finishes and dynamic visual effects:
  - Rods: Classic Birch (natural birch with brass ferrule fittings), Bamboo Cane (physical segmented cane node dashes with olive silk wraps), Copper Shore (burnished copper with dynamic metallic gleam reflections and radiant pulse rings), Moonstone Rod (opalescent celestial 3D gyroscopic orbital halo rings, glowing moonstone reel gem, and starlight guide rings), and Abyssal Carbon (matte charcoal graphite weave with dual counter-rotating electric cyan gyroscopic rings and plasma core).
  - Lines: Monofilament (clean supple line with aquatic tension shimmer), Golden Twine (spun gold filament with traveling dashed glints and golden hook), Starlight Silk (multi-layered celestial starlight ribbon aura with ethereal lavender glow and trailing stardust motes during reeling), and Neon Aqua (bioluminescent cyber laser energy beam with streaming core aura and electric cyan plasma discharge sparks).
  - Buckets: Seafoam Tin (vintage teal enamel with classic seafoam splash droplets), Woven Creel (traditional rattan basket with clear river droplets), Cedar Barrel (aromatic cedar staves with iron hoops and golden-amber barrel droplets), and Pearl Basin (breathing iridescent mother-of-pearl luster with 3 orbital relic pearl spheres circling the rim).
  - Dynamic Tactile Feedback and Effects:
    - Rod Tip Gyro-Halos: Rotating 3D orbital rings dynamically tracked to the flexing rod tip during casting and retrieval.
    - Bucket Orbiting Relics: 3 glowing pearls circling the bucket rim with orbital depth.
    - Impact Strike Shockwaves: Expanding radial shockwave rings and sparks bursting on creature clicks.
    - Bouncy Currency Floaters: Springs upward on landing with bold +Pearls feedback and streak badges.
    - Bucket Squish-and-Stretch: Physical spring compression on fish landing with expanding landing shockwaves.
    - Ambient Idle Motes: Ethereal particles drifting off high-tier gear while resting.
  - Specialty Baits: *Glowing Krill* (guarantees next 3 catches are Uncommon or higher) and *Golden Nectar* (guarantees next 3 catches are Rare or Legendary). An active bait badge appears directly below the rod assembly.
- Ambient Weather and Lighting: Cycle through *Daylight*, *Moonlit Night* (with deep blue ocean vignetting and amplified creature bioluminescence), and *Gentle Rain* (with calming ripples across the surface). Use the weather button or press `W`.
- Floating Fish Companion (Virtual Pet): Tap `Companion` on any fish in your bucket to have that creature swim beside you as an orbiting floating companion with a glowing star halo.
- Polaroid Keepsake Snaps: Tap `Photo` on any fish in your bucket to view a vintage polaroid keepsake with specimen artwork, catch measurements, and site stamp, complete with a one-click `Download Snap` SVG export.
- Dynamic Dark Mode & Color Adaptation: Built-in luminance and color detection automatically observes the page's computed text and background colors, system dark mode preferences, and night weather. It dynamically sets high-contrast styling: pure bright white and luminous mint typography with multi-layer protective dark drop-shadows on dark websites and deep forest green with soft halos on light pages, ensuring toasts and hints are legible on any background.
- Catch Streak Combo System: Catching fish in rapid succession (within 20 seconds) triggers multi-catch combos (e.g., `2x Streak!`, `3x Streak!`) awarding extra bonus pearls and celebratory ascending audio chimes.
- Field Guide Filter Chips: The 28-species Fish Index includes filter chips (`All`, `Discovered`, `Missing`, `Legendary`) allowing anglers to quickly review what they have discovered, inspect missing silhouettes and encounter odds, or jump directly to apex legendary creatures.
- Habitat Badges on Catches: Every caught fish entry displays its native atmospheric habitat pill (e.g. `Bytewater`, `Kitchen reef`, `Papyrus shallows`, `Harmonic deeps`) based on where it was discovered.
- Transparent Attached Catch Toast: Floating catch notice attached directly above or below the bucket with no card box background, soft contrast halos, displaying species name, size, tier, streak combo bonus, and earned pearls.
- Consistent Modal Sizing: All four tabs (Bucket, Fish Index, Tackle Shop, and Rewards) maintain identical 520px x 640px modal proportions and aligned headers.
- Keyboard shortcuts: `P` to pause/resume, `B` to open/close bucket, `W` to cycle ambient weather, `M` to toggle sound, `Escape` to close collection, and Arrow keys to adjust focused gear position.

No remote scripts, AI service, or analytics. Limited page text and background tone are read locally to identify over ten atmospheric habitats (including Bytewater, Kitchen reef, Ink lagoon, Papyrus shallows, Harmonic deeps, Marketplace trench, Neon arcade, Gallery tide, Social archipelago, and Starlight abyss). Species and colors are randomized, not generated from page images. Concurrent writes are merged where possible, but simultaneous catches in different tabs can still race.

Rod and bucket can be dragged independently or moved with arrow keys. Positions persist across reloads and extension sites. Cast lines and landing positions track the current gear positions. Use Close inside the collection to dismiss the book even if it covers your bucket.

## Movement and catches

Jellyfish contract to rise and relax between pulses; octopuses use push-and-coast bursts; crabs scuttle along the viewport bottom; dolphins travel in broad arcs; turtles, rays and whales glide slowly; seahorses and nautiluses hover. Each individual also has its own cruising pace and stroke tempo, plus gradual speed surges. Each profile respects pause and reduced motion.

Casting uses a slack cubic line, followed by tension, a damped spring in the rod, mass-dependent retrieval time and sway, and an unhooked gravity-based toss from near the rod into the current bucket location. The hook retracts before the creature lands. The arc is constrained near the viewport top. These are stylized animation dynamics, not a full fishing simulation. Catch lengths are assigned at spawn and scale with species size.

## Checks

JavaScript syntax checks and browser integration checks are included. Run `node tests/browser.cjs` with Playwright installed (or set PLAYWRIGHT_MODULE to its module path). The browser test serves only this project on an ephemeral localhost port and launches headless Edge. It checks casting, persistence, pause, scroll spawning, click-through links, close/reopen, simultaneous click handling, mobile layout, reduced motion, three-click sharks, rarity labels, release/scatter cleanup, and index preservation after release and reload.





The bucket collection opens as a unified 520px x 640px warm paper modal (`#f7f4ec`) shared across all four tabs (Bucket, Fish index, Tackle shop, and Rewards). It features a consistent clean header, quiet navigation tabs with green active indicator, inline SVG close control, and scrolling card layout. Run `node tests/modal-shell.cjs` and `node tests/bucket-layout.cjs` to check overflow with a full collection on desktop, mobile, and short viewports. Bucket sway, water ripples, panel opening, catch bounce, and row hover feedback respect reduced motion.

## Creature Design and Naturalist Animation

Every species features distinct anatomical vector illustrations:
- **Individuated Species Anatomies**: Distinct silhouettes, dorsal fins, caudal tails, and mouth clefts for species 0–11 (Guppy fan delta tail, Angelfish towering triangular fins, Puffer round defensive body and beak, Ribbonfish long sinuous crest, Butterflyfish pointed coral snout and eye camouflage bar, Lanternfish abyssal photophores and angler stalk, Moon Koi whiskers and sweeping paddle tail, Veiltail gossamer silk lobes, Seahorse upright equine armor and curled prehensile tail, Manta Ray diamond disc with cephalic lobes and whip tail, Leaf Dragon camouflage lobes).
- **Zero AI-Slop Visual Styling**: Removed cartoon pink anime cheeks, universal smiles, and pseudo-emoji glyphs. All controls and icons use precise, clean inline line SVGs (`.tool.audio`, `.tool.pause`, `.tool.close`, gear icons, pearl currency).
- **Liquid Splash Droplets**: Landing catches generate physics-based arc water droplets (`.catch-droplet`) with upward trajectory and gravity drop rather than rotating rectangular confetti.
- **Smooth 3D Direction Turns**: Swimming creatures foreshorten edge-on and smoothly transition across swimming directions instead of instantaneous 1-frame flips.
- **Desynchronized Blinking**: Creature eye blinks are individually staggered (`--blink-delay`) across natural irregular intervals rather than blinking in unison.



## Discovery rewards and creature animation

The collection includes a Discovery rewards tab with nine unlockable milestones:
- 3 species: Bubble trails (creatures trail subtle rising bubbles)
- 5 species: Reed bucket finish
- 8 species: Coral book (warm coral binding and peach pages)
- 10 species: Copper rod finish
- 14 species: Pearl bucket finish
- 18 species: Moonlit creatures (ethereal soft glow)
- 20 species: Ocean book (deep blue binding and ocean pages)
- 24 species: Moonstone rod finish
- 28 species: Collector’s golden crest (complete index achievement)

Finishes and effects are optional toggles saved locally. Released catches count permanently toward discoveries. New species discoveries and newly unlocked rewards are announced on catch with celebratory chimes.

The Rewards panel also features:
- **Angler Mastery Titles**: Four progressive career titles (*Shore Caster* at 10 catches, *Reef Scout* at 25 catches, *Grand Angler* at 50 catches, and *Abyssal Master* for landing any Legendary species).
- **The Fisherman's Tip Jar & Supporter Exclusive Golden Gear**: A built-in supporter card allowing players to support the project via [Buy Me a Coffee](https://buymeacoffee.com/saucescode). The exclusive *Golden Thread & Gilded Hook* finish is locked by default and unlocks upon tip verification or entering a supporter passcode (e.g. `COFFEE` or `GOLDEN`), rewarding verified supporters with a permanent gold badge, radiant golden aura beam, traveling gold twine dashes, and gilded strike shockwaves.

Rare and Legendary arrivals reveal through a soft silhouette and bubbles. Alternating limb strokes, trailing appendages, ray wing motion, and eye blinks add species detail. Pause freezes creature parts, and reduced motion removes the entrance and limb animations.
