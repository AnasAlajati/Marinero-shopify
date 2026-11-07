# MOVE ON rail image preparation

Created with the built-in image generation tool from the user's front/back photographs. The side is inferred, not a photographed view. Generated details may differ from the garment; inspect the artwork before using these as sales imagery.

Final files are transparent RGBA PNGs, each 1200 × 1600. Deterministic crop/resize/padding aligns all alpha silhouettes to the same vertical span (top 319, height 961 px) while preserving their aspect ratios. Originals remain unchanged.

## Front prompt

Use case: background-extraction. Asset for Shopify interactive clothing rail. Produce ONE isolated photoreal garment cutout, genuine transparent background, portrait 1024x1536 canvas. No hanger, no model, no floor, no shadow outside garment. Full garment centered, collar top at y=200 and lowest hem at y=1310, consistent scale, horizontal center x=512. Preserve black fabric, orange piping, exact printed artwork and lettering, ribbed collar/cuffs/hem, original silhouette and soft studio lighting. Do not redesign prints. Edit target is the supplied FRONT photo. Remove white background, normalize framing only; preserve the front half zipper, small MOVE ON chest print and gray lower-right character graphic exactly. Straight-on front view.

## Back prompt

Use case: background-extraction. Asset for Shopify interactive clothing rail. Produce ONE isolated photoreal garment cutout, genuine transparent background, portrait 1024x1536 canvas. No hanger, no model, no floor, no shadow outside garment. Full garment centered, collar top at y=200 and lowest hem at y=1310, consistent scale, horizontal center x=512. Preserve black fabric, orange piping, exact printed artwork and lettering, ribbed collar/cuffs/hem, original silhouette and soft studio lighting. Do not redesign prints. Edit target is supplied BACK photo. Remove white background and normalize framing only. Preserve large upper-back MOVE ON lettering, orange chest piping, orange character on lower left and gray character lower right and TRUST YOUR DIRECTION lettering exactly. Straight-on back view.

## Side prompt

Use case: product-mockup. Input 1 front reference; input 2 back reference of the SAME black kids quarter-zip sweatshirt. Generate ONE realistic strict 90-degree SIDE PROFILE of this garment hanging unsupported, no person or mannequin visible, no hanger, transparent background. For a draggable clothing rail. Portrait 1024x1536 canvas, collar top y=200, hem bottom y=1310, center x=512, same physical garment height as reference front/back cutouts. Narrow, believable hanging side silhouette, not a squashed front photo. Front of garment faces left, rear faces right. Sleeve hangs naturally alongside body, slight depth and soft folds. Black thick knit sweatshirt fabric, ribbed stand collar, ribbed cuff and hem, orange sleeve piping faithfully inferred from photos. Preserve construction. At true side angle front/back text and character graphics should mostly be occluded, no invented prints or giant side logo. Soft even studio lighting, no cast shadow, no background, no rail, no extra objects.
