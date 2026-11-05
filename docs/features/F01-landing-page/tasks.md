# F01 — Tasks

- [x] F01-T01 Save the design and product images; record the brand tokens in `docs/design/`
- [x] F01-T02 Set up the theme: colours, fonts (Lora + DM Sans), page metadata
- [x] F01-T03 Header with nav, icons and mobile menu
- [x] F01-T04 Hero section
- [x] F01-T05 Trust strip
- [x] F01-T06 Our Collection grid with static product data
- [x] F01-T07 Hero carousel using the three banner photos (owner request)
- [x] F01-T08 Extra sections: Art of Bidri, How it's made, Gifting, Newsletter, Footer (owner request)
- [x] F01-T09 Pixel-match against the design at 1536px
- [x] F01-T10 Check mobile at 375px; build, lint and typecheck pass
- [x] F01-T11 Make the hero fill the first screen, with larger desktop text (owner request, D-013)

## Progress log
- **2026-11-03:** Design received, images saved, and the first build of the page done.
- **2026-11-03:** Owner asked for a pixel-perfect match. Calibrated against the design numerically: text ink positions are within about 1–2px, and the hero photo crop was matched by image search (1664px wide, offset −128/−135).
- **2026-11-03:** Owner asked for a hero carousel. Added it with the three banner photos.
- **2026-11-03:** Owner asked for more sections so the page feels full. Added five sections in the same style. Build, lint and typecheck pass, and the page renders fully static.

- **2026-11-03:** Owner asked for the hero to fill the first screen and for bigger desktop text. The hero is now viewport height minus the header, with the heading at 72px. Checked at 1870×945, 1536×1024, 1280×720 and 375×812.

## Follow-ups
- [ ] Square product photos for Fan and Star earrings (the cards crop the wide banners for now)
- [ ] Owner to confirm the copy we wrote for the added sections, especially the gifting promise ("arrives gift-ready, with a card"), which is a business commitment
- [ ] Owner to confirm the heading font, or share the font used in the design (see design/README.md)
- [ ] Design for the added sections and the footer, if the owner wants them changed
- [x] Newsletter signup saves to the database (F13); sending newsletters needs Q-9
