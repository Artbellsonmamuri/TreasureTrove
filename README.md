# TreasureTrove

The completed Treasure Trove Resort website, including its responsive pages, authentic venue photography, gallery, and inquiry form.

## Preview locally

From this repository, run:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173 in your browser.

## Files

- `dist/`: ready-to-serve website and local assets.
- `build.py`: generates the HTML pages. Requires Python and Pillow.
- `check_site.py`: checks internal links, images, headings, and the hosting manifest. Requires Python and Pillow.
- `.openai/hosting.json`: preserves the existing Sites deployment identity.

The inquiry form prepares an email or Messenger message for the visitor to send. Rates and booking availability are confirmed directly by the resort.

Published site: https://treasure-trove-resort-events.right-cow-0993.chatgpt.site

This is a local Git repository. No remote hosting service has been configured.
