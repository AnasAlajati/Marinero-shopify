# Marinero clothing rail

The six-garment rail is installed on the unpublished **Marinero-Rail-Preview** theme (190019469616).

Homepage preview: https://jtm0xg-yi.myshopify.com/?preview_theme_id=190019469616
Standalone preview: https://jtm0xg-yi.myshopify.com/?preview_theme_id=190019469616&view=rail-preview
Arabic homepage: https://jtm0xg-yi.myshopify.com/ar?preview_theme_id=190019469616

## Homepage order

Hero → Boys & Girls categories → benefits strip → clothing rail → Winter, revealed → original product scroller → reviews → size guide.

Both product browsing sections are retained, separated by Winter, revealed. The rail contains MOVE ON (4–8), CUTIE (4–8), BLOOM (10–14), SOCIAL (16–18), 96 (16–18), and AWESOME (16–18). Homepage blocks identify these products as complete sets, and a Shop all winter link follows the rail.

## Interaction

- Swipe or drag horizontally; the centered garment stays selected.
- Front / Back (أمام / خلف) controls have 44px touch targets and an active underline.
- Clicking a garment opens its selected variant and matching real product photo.
- Verified media IDs are configured per block; an absent back photo falls back to the front. BLOOM has no gallery back photo.
- Keyboard Left/Right, Home and End browse garments. Links support normal browser navigation.
- Scrollbars and large arrow/action buttons are hidden or removed.
- Touch layouts avoid invisible 3D layers that can leak onto side images in Safari.

## Product photo arrival

Links use #rail-media=ID. The inline marinero-rail-arrival snippet selects and positions the correct gallery photo during HTML parsing, before gallery modules initialize. Invalid IDs retain normal gallery behavior. A gallery-only prepaint guard prevents the default photo from flashing during streamed rendering. The selected photo loads eagerly. Native view transitions run for 240ms where supported and respect reduced-motion preferences. No animation library or fixed navigation delay is added.

## Assets and configuration

Add Marinero clothing rail through the theme editor and configure Garment blocks. Prepared image sets are bundled in assets; image-picker overrides are supported. Only explicitly configured garments appear. Generated side views are inferred, not actual product photographs. See the individual image documentation for prompts and original-photo preservation details.

## Validation

Verified section ordering, six products, mobile/desktop page width, touch front/back layer visibility, exact product media navigation, and missing-back fallback. Verified early gallery selection with gallery modules blocked in English and Arabic. A physical iPhone should also be used for final visual approval.
