# Editable product details

The default product template includes **Marinero product details** below the description. It displays three expandable rows with clothing, ruler and delivery icons. The existing description and size guide remain editable in their original locations.

## Shared defaults

In the Shopify theme editor, open Products > Default product > Product information > Details > Marinero product details. Edit the three headings, icons and formatted descriptions. These settings apply to every product using that template. Selecting a different preview product does not make these settings product-specific.

The starting text is general guidance. Replace it with confirmed fabric information, sizing details and your actual delivery/returns policy when available.

## Different content for each product

Create product metafield definitions in Shopify Settings > Custom data > Products (some admin versions label this Metafields and metaobjects). Add these namespace/key pairs with type **Rich text**:

| Name | Namespace and key |
| --- | --- |
| Fabric & care | `custom.fabric_care` |
| Size & fit | `custom.size_fit` |
| Delivery & returns | `custom.delivery_returns` |

Open a product in Shopify Products, fill these fields, and save. The theme reads them automatically; no dynamic-source connection is required. An empty metafield uses the shared default. Add exact composition and care instructions to Fabric & care; fit notes, model measurements when known, and a size-chart link to Size & fit; confirmed timing and policy links to Delivery & returns.

## Different icons or headings per product

Optionally add **Single line text** product metafields:

| Row | Icon key | Heading key |
| --- | --- | --- |
| Fabric & care | `custom.fabric_care_icon` | `custom.fabric_care_title` |
| Size & fit | `custom.size_fit_icon` | `custom.size_fit_title` |
| Delivery & returns | `custom.delivery_returns_icon` | `custom.delivery_returns_title` |

For icon fields, use Shopify's preset-choice validation with these exact values: `shirt`, `washing`, `ruler`, `silhouette`, `truck`, `return`, `box`, `heart`, `chat_bubble`. This gives editors a controlled choice of icons. Empty or unsupported values use the theme editor's default icon. Heading fields accept your preferred text.

These definitions must be created in Shopify admin; local theme files cannot create admin metafield definitions. This change does not publish the theme or change product records.
