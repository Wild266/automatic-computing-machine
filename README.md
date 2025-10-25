# Frutiger Aero — CC0 Art Edition

This version **uses real, existing Frutiger Aero–style art & animations** (CC0/public‑domain) and ships them **locally in your repo**.

## Quick start
1. Run the fetch script (downloads CC0 files into `assets/external/`):
   ```bash
   python scripts/fetch_assets.py
   ```
2. Open `index.html` (or serve locally: `python -m http.server 4000`).
3. Replace your name, blurb, links, and portrait (`assets/images/profile-placeholder.png`).

## What gets downloaded
- **Frutiger Aero wallpaper** (CC0, Wikimedia) → `assets/external/frutiger_aero_wallpaper.png`
- **Dolphin vector** (CC0, Wikimedia) → `assets/external/dolphin.svg`
- **Animated soap bubble** (CC0, Wikimedia) → `assets/external/animated_svg_soap_bubble.svg`
- **Speech bubble icon** (CC0, Wikimedia) → `assets/external/icon_bubble.png`

> Optional: CC0 **bubble backgrounds pack** by KnightAnNi on itch.io (linked in `CREDITS.md`) — download manually and place PNGs into `assets/external/` to auto‑pick them up as rotating wallpapers.

## Notes
- The site auto‑detects these assets and swaps them in (no CDN links).
- Animations respect **Reduce Motion**.
- Music player supports YouTube or direct audio links (please ensure you have rights).

See `CREDITS.md` for sources & licenses.
