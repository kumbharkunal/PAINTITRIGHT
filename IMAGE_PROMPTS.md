# Image prompts: PAINT IT RIGHT homepage

## How to use this file

**Generating**
- Generate each image in a **fresh ChatGPT chat**: paste the prompt from its code block as-is.
- **Exceptions:**
  - #2 works best if you also upload #1, so the car matches.
  - #4 needs #3 uploaded as its starting point.

**Saving**
- Save each result as **PNG** at the exact path shown. The site already has a placeholder there, so the new file simply replaces it.
- **Wrong size?** If ChatGPT returns a different size or ratio, run `npm run images:fit` after saving. It centre-crops and resizes every slot to its exact size. Or crop by hand to the listed ratio around the focal point, then resize to the listed pixels.

**Publishing:** commit and push (Vercel rebuilds), or run `npm run build` locally.

**Hero sharpness (optional):** ChatGPT outputs top out at 1536 px. For a crisper desktop hero, upscale #1 two times first (Upscayl is free), then run `npm run images:fit`.

**Rules baked into every prompt**
- **No text, logos, car-brand badges, number plates or watermarks.** Generic premium cars only.
- Palette: black, graphite, white light, signal red.
- They avoid any paint-booth setting, because the studio paints in an open yard and the site never claims a booth.

---

## 1. Hero, desktop

- **Save as:** `public/images/hero/hero-desktop.png`
- **Ratio / size:** 3:2 landscape, **1536 × 1024 px**, PNG
- **Appears:** the hero, full-bleed, on screens 768 px and wider
- **Focal point:** the car in the right two-thirds. Keep the left ~45% and the bottom third dark for the headline.
- **Why red:** the page opens on a grey "primer" copy of this image and a diagonal pass reveals the colour. A deep red car makes that pass read.

```
Create a photorealistic photograph. A generic modern premium sports coupe with a deep, wet-looking glossy signal-red paint finish (close to #EC0609), parked at a front three-quarter angle inside a dark, minimal car detailing studio at night. Long parallel warm-white linear LED light slats run across the ceiling; they reflect as crisp, unbroken lines along the car's bonnet, shoulder line and doors. The floor is dark and glossy and shows a soft mirror reflection of the car and the light slats. Everything else falls off into near-black shadow: no clutter, no equipment, no visible walls. Camera: full-frame, 35mm lens, low camera height around knee level, slight upward angle, the car pin-sharp with a gentle falloff behind it. Lighting: the overhead slats are the only light source; deep blacks, controlled highlights, no haze or fog. Colour palette: black, graphite, white light and the car's red only. Mood: quiet, precise and premium, like a paint booth at night. Composition: 3:2 landscape. Place the car in the right two-thirds of the frame with its nose pointing toward the left edge; keep the left 45% of the frame and the bottom third dark, empty and uncluttered for a large text overlay. Exclusions: no text, no logos, no car-brand badges or emblems, no number plates, no watermarks, no people, and not a recognisable real car model; the car must be a generic premium design. Output: one PNG image, exactly 1536 x 1024 pixels, 3:2 landscape.
```

## 2. Hero, mobile

- **Save as:** `public/images/hero/hero-mobile.png`
- **Ratio / size:** 2:3 portrait, **1024 × 1536 px**, PNG
- **Appears:** the hero on phones (below 768 px wide)
- **Focal point:** the car in the upper-middle. Keep the bottom 40% as dark glossy floor for the headline and buttons.
- **Tip:** upload image #1 in the same chat so the car matches.

```
Create a photorealistic photograph in portrait format. A generic modern premium sports coupe with a deep, wet-looking glossy signal-red paint finish (close to #EC0609), seen from a front three-quarter angle, slightly closer than a full-car shot, inside a dark, minimal car detailing studio at night. Long parallel warm-white linear LED light slats run across the ceiling in the top part of the frame and reflect as crisp lines along the bonnet and shoulder line. The floor is dark, glossy and reflective. Everything else falls off into near-black shadow, with no clutter and no visible walls. Camera: full-frame, 35mm lens, low camera height, slight upward angle, the car pin-sharp. Lighting: the overhead slats are the only light; deep blacks, controlled highlights, no haze. Colour palette: black, graphite, white light and the car's red only. Mood: quiet, precise and premium. Composition: 2:3 portrait. Place the car in the upper-middle of the frame; keep the bottom 40% as dark, empty glossy floor for a large text overlay and buttons. Exclusions: no text, no logos, no car-brand badges or emblems, no number plates, no watermarks, no people, and not a recognisable real car model. Output: one PNG image, exactly 1024 x 1536 pixels, 2:3 portrait.
```

## 3. Before/after: AFTER

- **Save as:** `public/images/results/after.png`
- **Ratio / size:** 1:1 square, **1024 × 1024 px**, PNG
- **Appears:** the before/after slider ("Same panel. Before and after.")
- **Focal point:** centred. The reflections should run across the whole frame.

```
Create a photorealistic macro photograph of a section of a car's bonnet with flawless deep gloss black paint, filling the entire frame. Two or three long, straight, warm-white reflections of overhead linear studio lights run across the panel, perfectly crisp and undistorted, showing a mirror-like finish with real depth. The surface is spotless: no swirls, no scratches, no dust, no water spots. Camera: 100mm macro lens, slightly oblique angle to the panel, everything in focus. Lighting: dark studio, only the overhead light slats. Colour palette: black paint with white reflections and a faint hint of deep red reflected near one edge. Mood: precise, premium, quiet. Composition: 1:1 square, the panel fills the frame edge to edge, reflections running across it. Exclusions: no text, no logos, no badges, no number plates, no watermarks, no people. Output: one PNG image, exactly 1024 x 1024 pixels, 1:1 square.
```

## 4. Before/after: BEFORE (an edit of #3)

- **Save as:** `public/images/results/before.png`
- **Ratio / size:** 1:1 square, **1024 × 1024 px**, PNG
- **How:**
  - Open a chat, **upload `after.png`**, then paste the prompt below.
  - The framing must match #3 exactly, or the slider will show a jump.
  - If it doesn't match, try again, or ask the client for a real pair (best).

```
Edit the image I uploaded. Keep exactly the same framing, camera position, panel, lighting and reflections, pixel for pixel in position. Change only the condition of the paint so it looks neglected: fine circular swirl marks and holograms visible in the light, a few light scratches, dull hazy oxidised patches that soften the reflections, dried water spots and a light film of dust. The reflections should look blurred and broken compared with the original. Do not move, crop, rotate or reframe anything. Exclusions: no text, no logos, no badges, no number plates, no watermarks. Output: one PNG image, exactly 1024 x 1024 pixels, 1:1 square, same composition as the uploaded image.
```

## 5. Why section: craft close-up

- **Save as:** `public/images/why/craft.png`
- **Ratio / size:** 3:2 landscape, **1536 × 1024 px**, PNG
- **Appears:** the "One studio. The whole job." section, behind the paint-code plate
- **Focal point:** the spray gun in the right third. The plate covers the left half on desktop.

```
Create a photorealistic close-up photograph. A painter's hand in a black nitrile glove holds a professional HVLP spray gun mid-pass over a car door panel that is in flat grey primer. The gun is laying down a deep glossy red coat (close to #EC0609): the freshly sprayed strip of the panel is wet red gloss while the rest is still matte grey primer, with a clean diagonal edge between them. A fine mist of paint hangs in the air and catches a single hard light from the upper left. The background falls to pure black, with no walls, booth or equipment visible. Camera: 85mm lens, shallow depth of field, focus on the gun nozzle and the wet edge of the paint. Colour palette: black, grey primer, white light and the red paint only. Mood: craft, precision, quiet focus. Composition: 3:2 landscape, the gun and hand in the right third of the frame, the panel running across, the left half darker and calmer. Exclusions: no text, no logos, no brand names on the spray gun, no badges, no number plates, no watermarks, no faces. Output: one PNG image, exactly 1536 x 1024 pixels, 3:2 landscape.
```

---

## Services: nine images

These all share one spec:
- **Ratio / size:** 2:3 portrait, **1024 × 1536 px**, PNG
- **Shown at 4:5**, so about 8% of the top and the bottom is cropped. Keep the subject in the central 80%.
- **Appear in** the Services section: a sticky media frame on desktop, and inside each expanding panel on phones.

### 6. Car painting & full-body resprays
**Save as:** `public/images/services/paint-respray.png`

```
Create a photorealistic photograph in portrait format. A professional spray gun, held by a gloved hand at the edge of the frame, sweeps across the curved rear quarter panel of a generic premium car, laying down a coat of glossy signal-red paint over grey primer; the freshly painted area is wet and reflective, a fine paint mist drifts through a single hard side light. Dark, empty background with no walls or equipment visible. Camera: 50mm lens, shallow depth of field. Colour palette: black, grey, white light and red only. Mood: precise, focused craft. Composition: 2:3 portrait, subject in the central 80% of the height, darker at the top and bottom. Exclusions: no text, no logos, no car-brand badges, no number plates, no watermarks, no faces. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 7. Scratch repair & paint correction
**Save as:** `public/images/services/scratch-correction.png`

```
Create a photorealistic photograph in portrait format. A dual-action machine polisher with a foam pad rests on the bonnet of a generic black premium car. The left half of the panel is already corrected to a mirror finish that reflects an overhead linear light as one clean straight line; the right half is still covered in fine circular swirl marks clearly visible in the same light. A clean diagonal border separates the two halves. Dark studio, no walls or clutter visible. Camera: 50mm lens, slight top-down angle. Colour palette: black, graphite, white light, with a thin red accent on the polisher. Mood: precise, technical. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no brand names on the polisher, no car-brand badges, no number plates, no watermarks. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 8. Paint restoration
**Save as:** `public/images/services/paint-restoration.png`

```
Create a photorealistic photograph in portrait format. The front quarter of a generic premium car mid-restoration: the wing and bumper are in flat grey primer, edges and lights neatly masked with crisp tape and masking paper, a few areas sanded smooth. One overhead light picks out the shape; the rest falls to black. Camera: 35mm lens, low angle, three-quarter view of the front corner. Colour palette: black, grey primer, white light, with a single red strip of masking tape as the only accent. Mood: careful, patient workmanship. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no car-brand badges, no number plates, no watermarks, no people. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 9. Paint protection film (PPF)
**Save as:** `public/images/services/ppf.png`

```
Create a photorealistic close-up photograph in portrait format. Gloved hands guide a felt-edged squeegee across clear paint protection film being applied to the glossy red bonnet of a generic premium car. The film's leading edge catches a thin bright line of light, and tiny droplets of slip solution sit on the surface. Dark studio background, no clutter. Camera: 85mm lens, shallow depth of field, focus on the squeegee edge and the film line. Colour palette: red paint, black, white light only. Mood: precise, careful. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no brand names, no car-brand badges, no number plates, no watermarks, no faces. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 10. Ceramic coating
**Save as:** `public/images/services/ceramic-coating.png`

```
Create a photorealistic close-up photograph in portrait format. A small foam applicator block wrapped in a suede cloth wipes ceramic coating onto deep gloss black car paint. The freshly coated stripe looks darker and reflects an overhead linear light more sharply than the uncoated paint beside it, showing the difference in depth. Dark studio, no clutter. Camera: 85mm lens, oblique angle, shallow depth of field. Colour palette: black paint, white light, a faint red reflection at one edge. Mood: premium, precise. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no bottles with labels, no car-brand badges, no number plates, no watermarks. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 11. Glass coating
**Save as:** `public/images/services/glass-coating.png`

```
Create a photorealistic photograph in portrait format, taken from inside a car looking out through the windscreen at night in heavy rain. On the coated windscreen the rain gathers into small round beads and runs off in clean streams; the wipers are off. City lights outside are blurred into soft bokeh, mostly warm white with a few red tail lights. The dashboard edge is a dark silhouette at the bottom. Camera: 35mm lens, focus on the water beads on the glass. Colour palette: black, white light, red lights only. Mood: calm, clear, safe. Composition: 2:3 portrait, the beaded glass filling the central 80% of the height. Exclusions: no text, no logos, no car-brand badges, no number plates, no readable signs, no watermarks. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 12. Complete detailing & polishing
**Save as:** `public/images/services/detailing-polishing.png`

```
Create a photorealistic close-up photograph in portrait format. A gloved hand folds a soft grey microfibre cloth across freshly polished deep black car paint on a door panel; the paint mirrors one crisp line of overhead light without a single swirl. Dark studio, no clutter. Camera: 85mm lens, shallow depth of field, focus on the cloth and the reflection. Colour palette: black, graphite, white light, a thin red accent on the glove cuff. Mood: calm, meticulous. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no car-brand badges, no number plates, no watermarks, no faces. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 13. Interior detailing
**Save as:** `public/images/services/interior-detailing.png`

```
Create a photorealistic close-up photograph in portrait format. A soft detailing brush works along the stitched seam of a black leather car seat with thin red contrast stitching; a low side light rakes across the leather grain, showing it clean and supple. Dark car interior, out of focus around the edges. Camera: 100mm macro lens, shallow depth of field. Colour palette: black leather, white light, red stitching only. Mood: careful, premium. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no car-brand badges or emblems on the seat, no watermarks, no faces. Output: one PNG image, exactly 1024 x 1536 pixels.
```

### 14. Interior plastic coating
**Save as:** `public/images/services/interior-plastic-coating.png`

```
Create a photorealistic close-up photograph in portrait format. A car dashboard trim panel split diagonally: one half restored to a deep, even satin black by a foam applicator resting on it, the other half faded and chalky grey from sun damage. Soft side light from a windscreen shows the texture difference. Dark interior around the edges. Camera: 50mm lens, slight angle, shallow depth of field. Colour palette: black, grey, white light, a small red accent on the applicator. Mood: restorative, precise. Composition: 2:3 portrait, subject in the central 80% of the height. Exclusions: no text, no logos, no screens with readable content, no car-brand badges, no watermarks. Output: one PNG image, exactly 1024 × 1536 pixels.
```

---

## Real photos: get from the client or their Instagram

The Work section shows six real jobs and links each one to its reel. For each, use a clean still of the finished car: a frame from the reel or an original photo, **not** the composite cover graphic.
- **Size:** at least **1280 × 1600 px**, 4:5 portrait.
- **Format:** JPG.
- **Wrong size:** run `npm run images:fit` after dropping it in.

| Job | Save as | Reel |
|---|---|---|
| BMW X7, bumper restored | `public/images/work/bmw-x7-bumper.jpg` | instagram.com/reel/DeY2FqdjMGf |
| Porsche Macan, piano black cladding | `public/images/work/porsche-macan-piano-black.jpg` | instagram.com/reel/DeS6JKIAQ-n |
| BMW Z4, repaint & restoration | `public/images/work/bmw-z4-restoration.jpg` | instagram.com/reel/DfB_eteih-I |
| Mercedes S-Class, repaint + PPF | `public/images/work/mercedes-s-class-repaint-ppf.jpg` | instagram.com/reel/DceUAMwTnCT |
| Mercedes GLC 300, PPF | `public/images/work/mercedes-glc-ppf.jpg` | instagram.com/reel/DfJ4iTFAtJT |
| BMW X3, detailing + ceramic | `public/images/work/bmw-x3-ceramic.jpg` | instagram.com/reel/De1UfTSkUh_ |

**Also worth asking the client for**
- **A real before/after pair** in the same framing (the Macan cladding or the X7 bumper are ideal). It replaces #3 and #4: save as `public/images/results/before.png` and `after.png`, then delete `tag` under `results` in `src/content/site.ts` so the "Illustration" label disappears.
- **A higher-resolution logo file** (AI, SVG or PDF), if one exists.
- **Optional:** two or three studio photos (the LED-slat ceiling, the lit R sign).

**YouTube thumbnails** for the Videos and Proof sections are already downloaded from their channel (`npm run thumbs`).
