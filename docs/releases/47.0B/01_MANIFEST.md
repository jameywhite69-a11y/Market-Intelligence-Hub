# Manifest — Version 47.0B

## Replaced

- `app/templates/workstation.html`

## Purpose

- Remove any `<section>` elements accidentally placed inside `{% block scripts %}`.
- Ensure every panel ID appears exactly once.
- Keep scripts grouped and only inside the scripts block.
- Preserve all v45, v46, v46.1, and v47 panel anchors.
