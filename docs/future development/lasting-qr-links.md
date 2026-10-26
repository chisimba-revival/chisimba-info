# Lasting QR links for printed material

Recorded: 22 September 2026  
Status: Future idea; paused at Derek's request. No implementation scheduled.  
Working module name: Publishing Links (final name to be decided).

## Purpose

Give publishers a dependable way to connect printed books and other materials to online audio, video, downloads and supplementary lessons. A printed QR code contains a web address. That address should remain stable even when the content, website software or storage location changes.

Kenga Publishing is the initial use case: books already contain QR codes pointing to bird-call pages on the former WordPress site. The Chisimba conversion preserved those page addresses and recording links. This existing compatibility is the starting point, rather than an already implemented general-purpose link-management module.

## Proposed experience

A publisher creates a book and edition, adds a resource, and receives a permanent public address and a print-quality QR code. Readers scan the code to open a simple, accessible page with the relevant player, download or supplementary content. Editors can update the resource behind that address without requiring changes to the printed book.

The module should support:

- Books, editions and labelled resources, with optional chapter and printed-page references.
- Stable public addresses and import of existing WordPress paths and other published links, preserving query parameters where required.
- Audio and video players, downloads, supporting text, credits and accessible alternatives such as transcripts. Audio must not autoplay.
- Export of print-quality QR codes, including vector artwork, with a readable address and clear resource label for print production.
- Authorised editing, draft previews, publication controls and an audit history of changes to destinations and content.
- Checks for missing files, broken destinations and redirect loops, with an actionable report for the responsible editor.
- A useful explanation when a resource is temporarily unavailable or intentionally retired, rather than an unexplained broken page.

## Design considerations

Published addresses must not be silently reassigned to unrelated content. Retiring a book or edition should preserve its printed links. Existing printed codes must continue to work without being regenerated.

Prefer stable landing pages whose contents can change. Permanent redirects suit genuinely permanent moves; an editable destination needs a redirect and caching policy that does not trap readers at an old destination.

Reuse Chisimba's existing content blocks, media handling, permissions and audit facilities where appropriate. Restrict destination editing to authorised people and validate URLs so the service cannot become an unrestricted redirect mechanism.

Link longevity depends on retaining the domain, renewing HTTPS certificates and backing up both the link registry and its media. Export and restore should preserve addresses, book/edition relationships and change history. If scheduled checks need a worker, document its installation and operation alongside the other Chisimba workers.

## Possible service offering

Offer publishers managed companion content for printed publications: stable addresses, QR artwork, hosted resources and maintenance of existing links. Pricing, ownership, domain arrangements, continuity commitments and any usage reporting remain open questions. Any analytics should be optional and designed with reader privacy in mind.

## Suggested first scope when resumed

Start with Kenga Publishing's existing bird-call pages: record their exact printed destinations, map them to resources, provide an editor interface and QR export, and test both existing printed codes and newly generated codes. Add broader publisher and media features after that workflow is proven.

This note records the idea only. It does not change the live sites, start a worker, introduce charges or commission further development.
