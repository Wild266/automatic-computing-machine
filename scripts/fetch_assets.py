#!/usr/bin/env python3
"""Download CC0 Frutiger Aero art assets locally into assets/external/.

Run:
    python scripts/fetch_assets.py
"""
import os, urllib.request

ROOT = os.path.dirname(os.path.dirname(__file__))
OUT = os.path.join(ROOT, 'assets', 'external')
os.makedirs(OUT, exist_ok=True)

ASSETS = [
    ('https://upload.wikimedia.org/wikipedia/commons/1/12/Frutiger_aero-style_wallpaper.png', 'frutiger_aero_wallpaper.png'),
    ('https://upload.wikimedia.org/wikipedia/commons/9/92/Dolphin.svg', 'dolphin.svg'),
    ('https://upload.wikimedia.org/wikipedia/commons/a/a5/Animated_SVG_soap_bubble.svg', 'animated_svg_soap_bubble.svg'),
    ('https://upload.wikimedia.org/wikipedia/commons/2/22/Icon_Bubble.png', 'icon_bubble.png'),
]

def download(url, dest):
    try:
        print(f'Downloading {url} -> {dest}')
        urllib.request.urlretrieve(url, dest)
        print('  ok')
    except Exception as e:
        print('  failed:', e)

def main():
    for url, name in ASSETS:
        path = os.path.join(OUT, name)
        if os.path.exists(path):
            print(f'skip (exists): {name}'); continue
        download(url, path)
    print('\nDone. For KnightAnNi CC0 wallpapers (itch.io), download manually and drop images into assets/external/.')

if __name__ == '__main__':
    main()
