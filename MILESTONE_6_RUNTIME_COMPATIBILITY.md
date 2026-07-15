# Milestone 6: Runtime Compatibility

## Checkpoint: 15 July 2026

### Confirmed working

- Chisimba installs and runs on the PHP 7.4 development runtime.
- Prelogin administration and Module Catalogue are functional.
- Course creation and student-outcome entry are functional.
- Story titles and content render correctly.
- File Manager opens and works from the MyProfile block.
- File Manager opens from the course image workflow, although it currently opens as the full manager rather than as an image-selection dialogue.

### Behaviour-preserving core modernisation

The legacy `parse4smileys` implementation generated a very large regular expression that failed under modern PCRE with `PREG_INTERNAL_ERROR`.

It was replaced with a cached `strtr()` implementation that:

- preserves the public parser API;
- preserves the existing smiley token table;
- continues to use the existing Chisimba icon renderer;
- removes regex compilation and callback overhead;
- is suitable for PHP 7.4 and later PHP versions.

This is the first confirmed example of replacing an obsolete implementation while preserving observable Chisimba behaviour.

### Core compatibility fixes in this checkpoint

- Guarded the bundled `imagecreatefrombmp()` implementation to prevent redeclaration when GD already provides the function.
- Replaced ambiguous nested ternary expressions in File Manager and Group Administration.
- Replaced remaining `ereg`/`eregi` usage in the touched File Manager and Group Administration paths.
- Added `XML_Serializer 0.21.0` to the curated PEAR compatibility pack.
- Added and verified:
  - `XML/Serializer.php`
  - `XML/Unserializer.php`
- Corrected the PEAR Calendar package assembly layout.
- Improved the safe runtime rebuild so it can proceed when the web container is already stopped.
- Removed a raw-text `&new` verification that incorrectly treated PHPDoc examples as executable code.

### Curated PEAR status

The curated PEAR build now includes the XML Serializer dependency required by `xmlserial_class_inc.php`. The dependency is assembled into the framework source and propagated into each fresh PHP 7.4 runtime rebuild.

### Deferred functional issue

When File Manager is launched from a course image field, it opens as the normal full File Manager and does not provide the expected image-selection workflow. Because standalone File Manager works, this is currently classified as a caller/integration issue involving launch mode, callback, or return parameters.

### Next priorities

1. Continue browser testing of core administration and learning workflows.
2. Fix genuine core runtime failures as they are encountered.
3. Complete the focused PHP 7.4/PHP 8 compatibility inventory for framework-owned code.
4. Commit and test each compatibility family separately.
5. Begin module compatibility work only after the core is functionally dependable.
