# Maintenance: what to check, and how often

Flags change: a country adopts a new flag, a territory gets one, Commons replaces a drawing, ISO renames a code. This page lists where to look, so hata stays current. Checking is the whole job. Nothing changes until there is a ticket.

**How often:** every three months (January, April, July, October), and also whenever news says a flag changed.

**What to do with a finding:** file one ticket per change on the `modules` board, titled `hata: …` with `--area hata`. A flag hata draws in its old form is a bug: "hata: <country> flag out of date". Then add a row to the log at the bottom.

## Where to look

| What | Where | What to look for |
|---|---|---|
| Flag news | https://flaglog.com/news | Adopted, changed or proposed national and regional flags |
| Historical flags | https://flaglog.com/historical | Dated flags hata lacks (see the historic variants in `variantsOf`) |
| Flags of the world | https://www.worldometers.info/geography/flags-of-the-world/ | Any country or flag hata lacks |
| Other entities | https://www.worldometers.info/countries/?view=other-entities | Territories and entities with a flag that hata lacks |
| The drawings | Wikimedia Commons, each flag's file (`data-sources/commons-*.json`) | A newer revision, or a changed licence |
| Which file is the flag | Wikidata, flag image (P41) for countries (P297) and subdivisions (P300) | A changed P41: the snapshot in `data-sources/` is dated, so compare it against today |
| Codes | ISO 3166 Online Browsing Platform and the ISO 3166 Maintenance Agency's newsletters | New, changed or withdrawn country and subdivision codes |
| Other flag packages | flag-icons, country-flag-icons, circle-flags, flagpack (their releases and changelogs) | Flags, shapes, formats or features hata should match. hata aims to be a superset |

## Log

| Date | Checked by | Found | Tickets |
|---|---|---|---|
| 2026-11-17 | Mac Studio | First full comparison against worldometers, flaglog and the other packages (MODULES-1406) | See MODULES-1406 |
