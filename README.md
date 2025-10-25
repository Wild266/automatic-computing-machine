# Frutiger Aero Playground (One-Pager)

A glossy, bubbly, interactive homepage with **dolphins**, **bubbles**, and a tiny **music player**.
Only the essentials are shown: profile photo, a short blurb with emojis, and buttons for Resume + LinkedIn.

## Quick start
1. Open `index.html` and change **Your Name**, your blurb, and links.
2. Replace `assets/images/profile-placeholder.png` with your photo (keep same name or update in HTML).
3. Add songs:
   - Edit `data/songs.json` (preferred), **or**
   - Click **Favorite songs → ➕ Add** and paste a YouTube or audio URL (saved to localStorage).
4. For *Island Song — Ashley Eriksson*, set the correct `youtubeId` in `data/songs.json`
   (find the **official** upload on YouTube and copy the `v=XXXX` id). The default is a placeholder.
5. Preview:
   ```bash
   python -m http.server 4000
   # open http://localhost:4000
   ```
6. Deploy via GitHub Pages / Netlify / Vercel.

## Notes
- Bubbles and dolphins are **clickable** (pops, rings, sparkles, jumps, splashes).
- If you prefer no motion, enable your OS/browser “Reduce Motion”; the site respects it.
- Music player uses YouTube IFrame API (for YouTube IDs) and `<audio>` for direct URLs.
- Please ensure you have the rights to any audio you embed.

MIT License — customize freely.
