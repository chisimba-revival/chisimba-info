# Project Notebook

This is the structured engineering investigation log for Chisimba Revival.

## Investigation template

### Investigation NNNN — Title

**Date:** YYYY-MM-DD  
**Status:** Open / Confirmed / Rejected / Superseded

**Question**

What exactly are we trying to determine?

**Known state**

What has already been verified?

**Hypothesis**

What single explanation are we testing?

**Experiment**

What one command or change will test the hypothesis?

**Result**

What happened?

**Conclusion**

What can now be stated with confidence?

**Next step**

What is the next single question?

---

## Investigation 0001 — Why did `dbtable` receive a null database object?

**Date:** 2026-07-10 to 2026-07-11  
**Status:** Confirmed

**Question**

Why did calls in `dbtable_class_inc.php` fail with a null database object?

**Known state**

MDB2 was configured as the database abstraction layer. `dbtable::init()` requested the connection using `Engine::getDbObj()`.

**Hypothesis**

`Engine::getDbObj()` created the connection on the first call but failed to return the cached object on later calls.

**Experiment**

Inspect the complete `getDbObj()` method, add database diagnostics, and ensure that the method returns `$this->_objDb` after the lazy-initialisation block.

**Result**

The log confirmed a successful connection:

`MDB2 connected, class=MDB2_Driver_mysql`

After the return path was corrected, the earlier `queryAll() on null` failure no longer blocked installation.

**Conclusion**

The cached database object must be returned on every call to `getDbObj()`, not only during first-time construction.

**Next step**

Re-run the installer from a completely clean database and runtime installation state.

---

## Investigation 0002 — Were missing tables independent module defects?

**Date:** 2026-07-11  
**Status:** Rejected

**Question**

Did missing tables such as `tbl_prelogin_blocks` indicate broken module SQL definitions?

**Known state**

The prior installation had not completed.

**Hypothesis**

The missing table might indicate a defect in the prelogin module installer.

**Experiment**

Inspect the module SQL definition and list existing database tables.

**Result**

Only a partial schema existed because the installer had stopped before completion.

**Conclusion**

The missing tables were downstream consequences of an incomplete installation, not evidence of independent module defects.

**Next step**

Reset the database and rerun the installer from the beginning.

---

## Investigation 0003 — Can the background installer complete?

**Date:** 2026-07-11  
**Status:** Confirmed

**Question**

Can Chisimba complete installation in the legacy Docker environment using the background installer?

**Known state**

The database connection was working. The database and installer completion markers had been reset.

**Hypothesis**

The background installer would provide a more reliable path than the AJAX installer.

**Experiment**

Run the background installation from a clean database and stop at the first genuine failure.

**Result**

The system log reported:

`First time registration complete`

The installer created `installdone.txt`, the login screen appeared, language and canvas rendering worked, and login succeeded as `admin / a`.

**Conclusion**

The background installer provides a working installation path in the current legacy environment.

**Next step**

Preserve the baseline, document outstanding warnings, and commit the reproducible environment changes.
