# Notice: the flags' sources and licences

The code of this package is under the MIT licence (see [LICENSE](LICENSE)). The flags are not this package's own
work: each is a drawing on [Wikimedia Commons](https://commons.wikimedia.org/), under the licence Commons states
on that file's page, which travels with it. Each flag's manifest entry (`@johnmorrisdotca/hata/manifest`, and
`manifest.json`) records its Commons file, its page, its author as Commons gives it, its licence, the licence
templates on its page, the day its current version was uploaded and the day it was fetched.
[docs/provenance.md](docs/provenance.md) lists them all.

| What | Made from | Terms |
| --- | --- | --- |
| Which Commons file is each place's flag | Wikidata, the flag image (P41) of each country (P297) and subdivision (P300), the snapshot `data-sources/wikidata-2026-10-09.json` | CC0 |
| The flags themselves | Wikimedia Commons, one file a flag, kept in `data-sources/commons/` and recorded with their metadata in `data-sources/commons-2026-11-17.json` | Each file's own: public domain, CC0 or CC BY, below |
| The dates of the earlier flags of present-day countries (`scripts/historic-flags.ts`) | Facts read on 2026-11-17 from the page each variant names as its `source` (a government, parliament, archive or law text, a vexillological reference, or Wikipedia, as its `sourceKind` says); nothing is copied from them | Facts; each page is under its own terms |
| The Commons files of the former states with no Wikidata item (`scripts/former-flags.ts`: the Ottoman Empire, Prussia, the Kingdom of Hawaii and the rest), and the dates of their flags | Named by hand and added to the Commons snapshot on 2026-11-24 (each file's own licence, as above); the dates read on 2026-11-24 from the page each variant names as its `source`; nothing is copied from them | Facts; each page is under its own terms |
| The places' names, in the docs and the demo only | Kuni (`@johnmorrisdotca/kuni` 1.0.0, a development dependency), from Unicode CLDR and Wikidata | MIT, Unicode-3.0 and CC0 |
| The pipeline, the frames, the lookups and the demo | Written for this package | MIT |

## Which licences are shipped

Only flags whose file Commons states to be in the **public domain**, under **CC0**, or under **CC BY** (which
asks only that the author be credited) are in the package. A flag whose file is under CC BY-SA, the GFDL, or a
licence Commons does not state in a form the build reads, is left out and listed with its reason in
[docs/left-out.md](docs/left-out.md); bringing one in is the maintainer's decision, recorded in
`scripts/data-config.ts`.

Public domain on Commons is most often a government's own work (PD-USGov, PD-Japan-organization and their
like), a design too simple to be copyrighted (PD-ineligible, PD-shape, PD-textlogo), or a national law that
exempts its symbols (PD-Japan-exempt and others). The drawing of a public-domain flag may be somebody's work, and
Commons names them; nothing obliges a credit, and the manifest keeps it anyway.

## Not copyright: the insignia note

Commons marks most flags with **Insignia**: *"This image shows a flag, a coat of arms, a seal or some other
official insignia. The use of such symbols is restricted in many countries. These restrictions are independent
of the copyright status."* The licence of a file says what may be done with the drawing; the law of a country
may still restrict how its flag, its arms or a seal may be used (on goods, in advertising, in a way that
suggests official approval, or with disrespect). The manifest's `restrictions` field carries Commons' notes
(`insignia`, `trademarked`, `communist` and others) for each flag. This package cannot grant any right a
country's law withholds; check before using a flag commercially.

## Credit, where a licence asks for it

The flags whose licence asks that the author be credited, and the credit:

<!-- attributions:start -->
- `OM` Oman: "Flag of Oman.svg", author as Commons gives it: See File history below for details.; OGL-om 1.0 (accepted: held back on 2026-10-09 because Article 6 of the licence excludes official government emblems and the file was vectorised from qanoon.om, a site the licence does not name, so it could not be confirmed to cover a flag; John, 2026-11-17: Oman should be allowed, it is world data, keep (docs/decisions.md)) (https://www.oman.om/en/home-footer-level/faq/open-government-licence-oman); https://commons.wikimedia.org/wiki/File:Flag_of_Oman.svg
- `US-MS` Mississippi: "Flag of Mississippi.svg", author as Commons gives it: Rocky Vaughn, Sue Anna Joe, Dominique Pugh, Clay Moss, Kara Giles, Micah Whitson and the Mississippi Department of Archives and History; Copyrighted free use (accepted: the holder allows any use for any purpose with no condition, freer than CC BY; John, 2026-10-09: include Mississippi); https://commons.wikimedia.org/wiki/File:Flag_of_Mississippi.svg
- `BL--local` St. Barthélemy, Saint-Barthélemy's local flag: "Flag of Saint Barthélemy (local).svg", author as Commons gives it: The arms are from User:Manassas's Image:Blason St Barthélémy TOM entire.svg.; CC BY 2.5 (https://creativecommons.org/licenses/by/2.5); https://commons.wikimedia.org/wiki/File:Flag_of_Saint_Barth%C3%A9lemy_(local).svg
<!-- attributions:end -->

## The flag sets a drawing was taken from

Where a flag set's drawing is the same flag as Commons' at the same proportions and smaller, or free where
Commons' is not, it is shipped instead (`pnpm data:choose` decides, and each flag's manifest entry says why). The
sets are under the MIT licence, which asks that their copyright and permission notice go with every copy:

<!-- sets:start -->
### flag-icons 7.5.0

https://github.com/lipis/flag-icons, on npm as `flag-icons`. The drawings made for a frame: `ad.4x3`, `ad.1x1`, `ae.4x3`, `ae.1x1`, `af.4x3`, `af.1x1`, `ag.4x3`, `ag.1x1`, `ai.4x3`, `ai.1x1`, `al.4x3`, `al.1x1`, `am.4x3`, `am.1x1`, `ao.4x3`, `ao.1x1`, `ar.4x3`, `ar.1x1`, `as.4x3`, `as.1x1`, `at.4x3`, `at.1x1`, `au.4x3`, `au.1x1`, `aw.4x3`, `aw.1x1`, `ax.4x3`, `ax.1x1`, `az.4x3`, `az.1x1`, `ba.4x3`, `ba.1x1`, `bb.4x3`, `bb.1x1`, `bd.4x3`, `bd.1x1`, `be.4x3`, `be.1x1`, `bf.4x3`, `bf.1x1`, `bg.4x3`, `bg.1x1`, `bh.4x3`, `bh.1x1`, `bi.4x3`, `bj.4x3`, `bj.1x1`, `bm.4x3`, `bm.1x1`, `bn.4x3`, `bn.1x1`, `bo.4x3`, `bo.1x1`, `br.4x3`, `br.1x1`, `bt.4x3`, `bt.1x1`, `bw.4x3`, `bw.1x1`, `by.4x3`, `by.1x1`, `ca.4x3`, `ca.1x1`, `cd.1x1`, `cf.4x3`, `cf.1x1`, `cg.4x3`, `cg.1x1`, `ch.4x3`, `ci.4x3`, `ci.1x1`, `ck.4x3`, `ck.1x1`, `cl.4x3`, `cl.1x1`, `cm.4x3`, `cm.1x1`, `cn.4x3`, `cn.1x1`, `co.4x3`, `co.1x1`, `cr.4x3`, `cr.1x1`, `cu.4x3`, `cu.1x1`, `cv.4x3`, `cv.1x1`, `cw.4x3`, `cw.1x1`, `cy.4x3`, `cy.1x1`, `cz.4x3`, `cz.1x1`, `de.4x3`, `de.1x1`, `dk.1x1`, `dm.4x3`, `dm.1x1`, `do.4x3`, `do.1x1`, `dz.4x3`, `dz.1x1`, `ec.4x3`, `ec.1x1`, `ee.4x3`, `ee.1x1`, `eg.4x3`, `eg.1x1`, `es.4x3`, `es.1x1`, `fi.4x3`, `fi.1x1`, `fj.4x3`, `fj.1x1`, `fk.4x3`, `fk.1x1`, `fm.4x3`, `fm.1x1`, `fo.4x3`, `fo.1x1`, `fr.4x3`, `fr.1x1`, `ga.1x1`, `gb.4x3`, `gb.1x1`, `gd.4x3`, `gd.1x1`, `ge.4x3`, `ge.1x1`, `gg.4x3`, `gg.1x1`, `gh.4x3`, `gh.1x1`, `gi.4x3`, `gi.1x1`, `gl.4x3`, `gl.1x1`, `gm.4x3`, `gm.1x1`, `gn.4x3`, `gn.1x1`, `gq.4x3`, `gq.1x1`, `gr.4x3`, `gr.1x1`, `gs.4x3`, `gs.1x1`, `gt.4x3`, `gt.1x1`, `gu.4x3`, `gu.1x1`, `gw.4x3`, `gw.1x1`, `hk.4x3`, `hk.1x1`, `hn.4x3`, `hn.1x1`, `hr.4x3`, `hr.1x1`, `hu.4x3`, `hu.1x1`, `id.4x3`, `id.1x1`, `ie.4x3`, `ie.1x1`, `il.4x3`, `il.1x1`, `im.4x3`, `im.1x1`, `in.4x3`, `in.1x1`, `io.4x3`, `io.1x1`, `iq.4x3`, `iq.1x1`, `ir.4x3`, `ir.1x1`, `is.4x3`, `is.1x1`, `it.4x3`, `it.1x1`, `je.4x3`, `je.1x1`, `jo.4x3`, `jo.1x1`, `jp.4x3`, `jp.1x1`, `ke.4x3`, `ke.1x1`, `kg.4x3`, `kg.1x1`, `kh.4x3`, `kh.1x1`, `km.4x3`, `km.1x1`, `kn.4x3`, `kn.1x1`, `kp.4x3`, `kp.1x1`, `kr.4x3`, `kr.1x1`, `kw.4x3`, `kw.1x1`, `ky.4x3`, `ky.1x1`, `kz.4x3`, `kz.1x1`, `la.4x3`, `la.1x1`, `lb.4x3`, `lb.1x1`, `lc.4x3`, `lc.1x1`, `li.4x3`, `li.1x1`, `lr.4x3`, `lr.1x1`, `ls.4x3`, `ls.1x1`, `lt.4x3`, `lt.1x1`, `lu.4x3`, `lu.1x1`, `lv.4x3`, `lv.1x1`, `ly.4x3`, `ly.1x1`, `ma.4x3`, `ma.1x1`, `mc.4x3`, `mc.1x1`, `md.4x3`, `md.1x1`, `me.4x3`, `me.1x1`, `mg.4x3`, `mg.1x1`, `mh.4x3`, `mh.1x1`, `mk.4x3`, `mk.1x1`, `ml.4x3`, `ml.1x1`, `mm.4x3`, `mm.1x1`, `mn.4x3`, `mn.1x1`, `mo.4x3`, `mo.1x1`, `mq.4x3`, `mq.1x1`, `mr.4x3`, `mr.1x1`, `ms.4x3`, `ms.1x1`, `mt.4x3`, `mt.1x1`, `mv.4x3`, `mv.1x1`, `mw.4x3`, `mw.1x1`, `mx.4x3`, `mx.1x1`, `my.4x3`, `my.1x1`, `na.4x3`, `na.1x1`, `nc.4x3`, `nc.1x1`, `ne.4x3`, `ne.1x1`, `nf.4x3`, `nf.1x1`, `ng.4x3`, `ng.1x1`, `ni.4x3`, `ni.1x1`, `nl.4x3`, `nl.1x1`, `no.4x3`, `no.1x1`, `np.4x3`, `np.1x1`, `nr.4x3`, `nr.1x1`, `nu.4x3`, `nu.1x1`, `nz.4x3`, `nz.1x1`, `om.4x3`, `om.1x1`, `pa.4x3`, `pa.1x1`, `pe.4x3`, `pe.1x1`, `pf.4x3`, `pf.1x1`, `pg.1x1`, `ph.4x3`, `ph.1x1`, `pl.4x3`, `pl.1x1`, `pn.4x3`, `pn.1x1`, `pr.4x3`, `pr.1x1`, `ps.4x3`, `ps.1x1`, `pt.4x3`, `pt.1x1`, `pw.4x3`, `pw.1x1`, `py.4x3`, `py.1x1`, `qa.4x3`, `qa.1x1`, `ro.4x3`, `ro.1x1`, `rs.4x3`, `rs.1x1`, `ru.4x3`, `ru.1x1`, `rw.4x3`, `rw.1x1`, `sa.4x3`, `sa.1x1`, `sc.4x3`, `sc.1x1`, `sd.4x3`, `sd.1x1`, `se.4x3`, `se.1x1`, `sg.4x3`, `sg.1x1`, `si.4x3`, `si.1x1`, `sk.4x3`, `sk.1x1`, `sl.4x3`, `sl.1x1`, `sm.1x1`, `sn.4x3`, `sn.1x1`, `so.4x3`, `so.1x1`, `sr.4x3`, `sr.1x1`, `ss.4x3`, `st.4x3`, `st.1x1`, `sv.4x3`, `sv.1x1`, `sx.4x3`, `sx.1x1`, `sy.4x3`, `sy.1x1`, `sz.4x3`, `sz.1x1`, `tc.4x3`, `tc.1x1`, `td.4x3`, `td.1x1`, `tf.4x3`, `tf.1x1`, `tg.4x3`, `tg.1x1`, `th.4x3`, `th.1x1`, `tj.4x3`, `tj.1x1`, `tk.4x3`, `tk.1x1`, `tm.4x3`, `tm.1x1`, `tn.4x3`, `tn.1x1`, `to.4x3`, `to.1x1`, `tr.4x3`, `tr.1x1`, `tt.4x3`, `tt.1x1`, `tv.4x3`, `tv.1x1`, `tw.4x3`, `tw.1x1`, `tz.4x3`, `tz.1x1`, `ua.4x3`, `ua.1x1`, `ug.4x3`, `ug.1x1`, `us.4x3`, `us.1x1`, `uy.4x3`, `uy.1x1`, `uz.4x3`, `uz.1x1`, `va.4x3`, `vc.4x3`, `vc.1x1`, `ve.4x3`, `ve.1x1`, `vg.4x3`, `vg.1x1`, `vi.4x3`, `vi.1x1`, `vn.4x3`, `vn.1x1`, `vu.4x3`, `vu.1x1`, `ws.4x3`, `ws.1x1`, `xk.4x3`, `xk.1x1`, `ye.4x3`, `ye.1x1`, `za.4x3`, `za.1x1`, `zm.4x3`, `zm.1x1`, `zw.4x3`, `zw.1x1`, `gb-eng.4x3`, `gb-eng.1x1`, `gb-sct.4x3`, `gb-sct.1x1`, `gb-wls.4x3`, `gb-wls.1x1`.

```text
The MIT License (MIT)

Copyright (c) 2013 Panayiotis Lipiridis

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
<!-- sets:end -->

## What was changed

Every flag is the Commons file optimised with SVGO 4 (whitespace, comments, metadata and editor data taken out,
numbers rounded to about a four-thousandth of the flag's width, paths and shapes written more briefly), with its
width and height replaced by a viewBox where it had none, and with every id and class name prefixed with the
flag's code, so two flags in one page cannot collide. Nothing is redrawn: the picture is Commons'. The
optimised flags are compared with the originals, pixel by pixel, before a version is released (`pnpm data:compare`).

## Flags of international organisations

The flags of international organisations are a separate entry point (`@johnmorrisdotca/hata/organisations`, ids
`org:<slug>`), and none of them is a Commons file: each is drawn for this package, under the MIT licence, from the
body's published description of its flag, and nothing is copied. A body's flag is in only where the terms for its
flag or emblem let a package under the MIT licence carry it. What the terms say, read on 2026-11-13:

| Id | Body | What the terms say | Page |
| --- | --- | --- | --- |
| `org:eu` | European Union | Anyone may use the EU emblem or its elements without permission, if the use suggests no connection with or support from the EU institutions or the Council of Europe, is not tied to anything against their aims, and is lawful; registering it or an imitation as a trademark is not acceptable. | https://european-union.europa.eu/legal-notice_en |

Taken from Wikimedia Commons (added 2026-11-24, MODULES-1813, John: a body whose own terms or law restrict its flag or emblem stays out, and a body with no terms found for its flag or emblem may come in, with a
note saying so and the day read). Each is a public-domain or CC0 file, read through the licence check and optimised as a country's flag is (`data-sources/organisations-commons-2026-11-24.json`, made by `pnpm data:organisations`;
`pnpm draw:organisations` makes the data). No terms were found for any of them, which is not a licence: use of a flag can still be limited by the law of a country or a body's own rules, as for any flag.

<!-- organisations-files:start -->
| Id | Body | What its page said on 2026-11-24 | Page read | Commons file | Licence | Author as Commons gives it | File page |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `org:caricom` | Caribbean Community (CARICOM) | No terms for the flag or emblem were found on the page: its footer reads "© Copyright 2026, All Rights Reserved / Caribbean Community Secretariat", a notice for the site, and its privacy and data-protection pages say nothing of the flag. | https://caricom.org/ | Flag of CARICOM.svg | Public domain | CARICOM | https://commons.wikimedia.org/wiki/File:Flag_of_CARICOM.svg |
| `org:arab-league` | League of Arab States | No terms for the flag or emblem were found on the page (the portal's page carries an all-rights-reserved notice for the site and says nothing of the flag; on 2026-11-24 the page itself did not load, so the earlier reading of 2026-11-13 stands). | http://www.lasportal.org/en/Pages/default.aspx | Flag of the Arab League.svg | Public domain | Flad | https://commons.wikimedia.org/wiki/File:Flag_of_the_Arab_League.svg |
| `org:cis` | Commonwealth of Independent States | No terms for the flag or emblem were found on the page; it offers the emblem as an SVG download and states no terms of use. | https://eccis.org/en/about-cis | Flag of the CIS.svg | Public domain | The original uploader was Denelson83 at Wikimedia Commons. Redrawn from scratch by MapGrid in 2021. | https://commons.wikimedia.org/wiki/File:Flag_of_the_CIS.svg |
| `org:commonwealth` | Commonwealth of Nations | No terms for the flag or emblem were found on the page: it covers the Secretariat's logo ("used exactly as supplied and not reproduced or altered in any way") and says nothing of the flag. | https://thecommonwealth.org/commonwealth-secretariat-logo-kit-and-guidelines | Infobox Commonwealth of Nations flag.svg | Public domain | Sangjinhwa | https://commons.wikimedia.org/wiki/File:Infobox_Commonwealth_of_Nations_flag.svg |
| `org:andean-community` | Andean Community | No terms for the flag or emblem were found on the page: its footer reads "© 2026 Secretaría General de la Comunidad Andina / ® Derechos Reservados", and a disclaimer link whose text was not shown; the logo is shown with no usage rules. | https://www.comunidadandina.org/ | Flag of the Andean Community of Nations.svg | Public domain | Guilherme Paula | https://commons.wikimedia.org/wiki/File:Flag_of_the_Andean_Community_of_Nations.svg |
| `org:oic` | Organisation of Islamic Cooperation (the flag of 1981 to 2011) | No terms for the flag or emblem were found on the page: its footer reads "© 2026 Organisation of Islamic Cooperation. All rights reserved.", a notice for the site, with no terms link and nothing on the flag. | https://www.oic-oci.org/ | Flag of the Organization of Islamic Cooperation (1981–2011).svg | CC0 | Germenfer | https://commons.wikimedia.org/wiki/File:Flag_of_the_Organization_of_Islamic_Cooperation_(1981%E2%80%932011).svg |
<!-- organisations-files:end -->

Left out, read on 2026-11-13 and read again on 2026-11-24 (MODULES-1813). The rule (John, 2026-11-24): a body whose own terms or law explicitly restrict its flag or emblem stays out; a body with
no terms found for its flag or emblem may come in (the table above). What each page said on 2026-11-24 is in the last column, and where a page could not be read the earlier reading stands:

| Body | Why | Page | Read again on 2026-11-24 |
| --- | --- | --- | --- |
| United Nations | The flag's use is governed by the UN Flag Code (ST/SGB/2020/4), which as read allows authorised use and not commercial use, and the emblem's use is restricted under General Assembly resolution 92(I); no sentence lets a package pass it on. | https://research.un.org/en/maps/flags | The page still says the flag's use is regulated by the UN Flag Code and Regulations (ST/SGB/2020/4, 20 November 2020) and that the emblem's use is restricted (resolution 92(I) and ST/AI/189/Add.21); it states no permitted use, and says nothing of descriptions or drawings. No change. |
| NATO | Third parties need NATO's advance authorisation to use its logo, name or emblems; the page does not say the flag is exempt. | https://nato.int/en/about-us/official-texts-and-resources/use-of-nato-content-and-brand | The page still says third parties "must seek and receive authorization in advance from NATO" for the logo, name or emblems, and that NATO may ask for removal; it does not mention the flag. No change. |
| Red Cross, Red Crescent, Red Crystal | Article 53 of the First Geneva Convention bars anyone not entitled from using the emblems or imitations, whatever the object, and Additional Protocol III extends it to the red crystal. | https://ihl-databases.icrc.org/en/ihl-treaties/gci-1949/article-53/commentary/2016 | The page returned no text to the reader on 2026-11-24 (it is drawn by script), so the earlier reading stands. No change. |
| African Union | The AU's legal notice says its emblem is trademarked or copyrighted and may not be changed or used without approval. | https://au.int/en/legal_notice | The page still says the emblem is "trademarked and / copyrighted" and not to be used "for any communication or other purposes without approval", with "All rights reserved"; it addresses the emblem, not the flag. No change. |
| ASEAN | The guidelines on the emblem say it is ASEAN's reserved copyright and that use is asked for in writing. | https://asean.org/asean-emblem/use-of-the-asean-emblem/ | The site answered with a redirect to a browser check (a bot wall) on 2026-11-24, which this package does not work around; the earlier reading stands. No change. |
| Nordic Council | Its symbol guidelines, as found, give use to the Nordic bodies and ask others for permission, mainly for non-profit work (the norden.org page itself refused the request). | https://www.norden.org/en/information/nordic-council-logo-and-symbol | The page answered 403 Forbidden to the reader on 2026-11-24, which this package does not work around; the earlier reading stands. No change. |
| Pacific Islands Forum | No terms for the flag or emblem were found on the body's own page, and no public-domain or CC0 drawing was found on Commons. | https://forumsec.org/ | The page gives a copyright notice ("Copyright © 2024 - Pacific Island Forum") and links a terms page whose text was not shown; nothing on the flag. Left out for want of a drawing, not for its terms. |
| Organization of American States | Its legal notice could not be read: the page answered 403 Forbidden to the reader, which this package does not work around. | https://www.oas.org/en/legal.asp | The page answered 403 Forbidden on 2026-11-24. Left out until its terms can be read. |
| Mercosur | Its page could not be read: it answered 403 Forbidden to the reader, which this package does not work around. | https://www.mercosur.int/en/ | The page answered 403 Forbidden on 2026-11-24. Left out until its terms can be read. |
| International Olympic Committee (the Olympic rings) | The Olympic Charter reserves the Olympic symbol, flag and emblems to the IOC and bars their use without its authorisation. | https://olympics.com/ioc/olympic-charter | Not re-read on 2026-11-24: the restriction is in the Charter itself. Left out. |

## Ship signal flags

The flags of the International Code of Signals are a separate entry point (`@johnmorrisdotca/hata/signals`, ids `ics:<slug>`), and none of them is a Commons
file: each is drawn for this package, under the MIT licence, as geometry written out in `scripts/draw-signals.ts`, from the Code's own plate and
text. The Code is a work of the United States Government, with no copyright claimed under Title 17 of the United States Code. Read on 2026-11-24:

| Ids | What | Source | What it says |
| --- | --- | --- | --- |
| `ics:a` to `ics:z`, `ics:0` to `ics:9`, `ics:sub-1` to `ics:sub-3`, `ics:answer` | The 26 alphabet flags, the 10 numeral pennants, the 3 substitutes and the answering pennant | International Code of Signals, United States Edition, 1969 (Revised 2003), Pub. 102, National Imagery and Mapping Agency (the copy read is the Internet Archive's, https://archive.org/details/pub-102) | The plate "International Flags and Pennants" shows each flag and pennant, and the Code names the five colours and gives each single-letter signal its meaning. It gives no construction sheet: the proportions are measured from the plate and the values of the colours are this package's. |
The United States Navy's special pennants (ids `usn:<slug>`, in the same entry) are the other kind: Wikimedia Commons files taken as the country flags are. Each file's
licence is read from Commons and only public domain and CC0 are shipped, the file is optimised (`scripts/optimise.ts`), and its page, licence and author are kept
(`data-sources/tactical-commons-2026-11-26.json`, made by `pnpm data:tactical`). Every file is by Carl Lindberg, "per the U.S. Navy specification", and its page calls
it ineligible for copyright (plain geometry). Their meanings follow, in general terms, the Navy's Signalman training manual, NAVEDTRA 14244 (https://navyaviation.tpub.com/14244/: "Basic Maneuvering Flags",
"Substitutes" and "Correcting a Signal"), and the Royal Canadian Navy's visual signalling page, https://jproc.ca/rrp/rrp2/visual_flags.html (the uses of the Preparative,
Designation, Interrogative, Emergency and Subdivision pennants); Joseph McMillan's "Signal Flags" page on Sea Flags, https://www.seaflags.us/signals/sigflags.html, and
Wikipedia's "Naval flag signalling" were read for the names only. The Navy's own signal books are the authority at sea. The Navy's numeral pennants are the International Code's, so they are `ics:0` to `ics:9`. Read on 2026-11-26.

<!-- tactical-files:start -->
| Id | Commons file | Licence | Author as Commons gives it | Page |
| --- | --- | --- | --- | --- |
| `usn:code-answer` | SpecialSignalPennant-CodeAnswer-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-CodeAnswer-USNSpec.svg |
| `usn:corpen` | SpecialSignalPennant-Corpen-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Corpen-USNSpec.svg |
| `usn:designation` | SpecialSignalPennant-Designation-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Designation-USNSpec.svg |
| `usn:emergency` | SpecialSignalPennant-Emergency-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Emergency-USNSpec.svg |
| `usn:formation` | SpecialSignalPennant-Formation-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Formation-USNSpec.svg |
| `usn:interrogative` | SpecialSignalPennant-Interrogative-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Interrogative-USNSpec.svg |
| `usn:negative` | SpecialSignalPennant-Negative-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Negative-USNSpec.svg |
| `usn:preparative` | SpecialSignalPennant-Preparative-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Preparative-USNSpec.svg |
| `usn:screen` | SpecialSignalPennant-Screen-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Screen-USNSpec.svg |
| `usn:speed` | SpecialSignalPennant-Speed-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Speed-USNSpec.svg |
| `usn:starboard` | SpecialSignalPennant-Starboard-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Starboard-USNSpec.svg |
| `usn:station` | SpecialSignalPennant-Station-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Station-USNSpec.svg |
| `usn:subdivision` | SpecialSignalPennant-Subdivision-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Subdivision-USNSpec.svg |
| `usn:substitute-1` | SpecialSignalPennant-Substitute1-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Substitute1-USNSpec.svg |
| `usn:substitute-2` | SpecialSignalPennant-Substitute2-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Substitute2-USNSpec.svg |
| `usn:substitute-3` | SpecialSignalPennant-Substitute3-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Substitute3-USNSpec.svg |
| `usn:substitute-4` | SpecialSignalPennant-Substitute4-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Substitute4-USNSpec.svg |
| `usn:turn` | SpecialSignalPennant-Turn-USNSpec.svg | Public domain | Carl Lindberg | https://commons.wikimedia.org/wiki/File:SpecialSignalPennant-Turn-USNSpec.svg |
<!-- tactical-files:end -->

## Samurai battle banners

The battle banners of Sengoku daimyo are a separate entry point (`@johnmorrisdotca/hata/samurai`, ids `samurai:<slug>`), and none of them is a Commons file:
each is drawn for this package, under the MIT licence, as geometry written out in `scripts/draw-samurai.ts`, from the words of a published source, and
nothing is copied from a picture. The nine below are drawn from words: no cloth survives for any of them, so each is a reconstruction, and its record says which
part follows the source and which is this package's. Read on 2026-11-24:

| Ids | What | Source | What it says |
| --- | --- | --- | --- |
| `samurai:uesugi-tenshi`, `samurai:uesugi-ogi`, `samurai:hojo-gosyoku`, `samurai:date-daishihan`, `samurai:toyotomi-gunbai`, `samurai:tokugawa-kinsen`, `samurai:oda-karakasa`, `samurai:ii-igeta` | Banners and signs of named commanders | 馬印 (Uma-jirushi), Japanese Wikipedia, https://ja.wikipedia.org/wiki/馬印 | Lists the banners and signs of named Sengoku commanders with their designs and grounds in words; it names no surviving cloth or museum for them. |
| `samurai:sanada-rokumonsen` | The Sanada nobori | 真田氏 (Sanada clan), Japanese Wikipedia, https://ja.wikipedia.org/wiki/真田氏 | Says the six-coin crest was mainly a battle banner, describes an all-red nobori with the crest of unclear use, and names the screen of the Summer Campaign of Osaka (Osaka Castle collection) as the source for the Sanada unit's all-red flag with a gold line. |

Twelve more are drawn from a picture of about the period, read on 2026-11-26: the picture book 御馬印 (*Go-umajirushi*), volume 1 of six, which the National Diet
Library dates to around the Kan'ei years (1624 to 1644, its estimate; call number WA8-7, https://dl.ndl.go.jp/pid/1286895) and marks as public domain (保護期間満了,
its term has expired). Each is
geometry written out in `scripts/draw-samurai.ts`, its proportions and the place and size of its parts measured from the frame named below, under the MIT licence;
nothing of the photograph is in the package. Each is `documented`.

| Id | What the frame shows | Frame |
| --- | --- | --- |
| `samurai:taitokuin-go` | 台徳院様 (Tokugawa Hidetada): a black banner with 五 in white | https://dl.ndl.go.jp/pid/1286895/1/8 |
| `samurai:mito-kinmaru` | 水戸中納言様: a black banner with a gold disc | https://dl.ndl.go.jp/pid/1286895/1/11 |
| `samurai:echizen-hinomaru` | 越前宰相殿: a white banner with a vermilion disc, labelled 大馬しるし | https://dl.ndl.go.jp/pid/1286895/1/14 |
| `samurai:hoshina-higo-kuroboshi` | 保科肥後殿: a pale blue nobori with three blocks of nine black dots | https://dl.ndl.go.jp/pid/1286895/1/14 |
| `samurai:sakai-kunai-mitsumaru` | 酒井宮内: a white nobori with three vermilion discs | https://dl.ndl.go.jp/pid/1286895/1/19 |
| `samurai:sakai-kunai-hinomaru` | 酒井宮内: a square white banner with a vermilion disc | https://dl.ndl.go.jp/pid/1286895/1/19 |
| `samurai:sakai-kunai-kinmaru` | 酒井宮内: a pale blue banner with a gold disc | https://dl.ndl.go.jp/pid/1286895/1/20 |
| `samurai:uesugi-danjo-kinmaru` | 上杉弾正: a black banner with a gold disc, labelled 大馬しるし | https://dl.ndl.go.jp/pid/1286895/1/20 |
| `samurai:uesugi-danjo-bi` | 上杉弾正: a white banner with 毘 in black, labelled 小馬しるし | https://dl.ndl.go.jp/pid/1286895/1/20 |
| `samurai:todo-izumi-mitsumaru` | 藤堂和泉守: a black nobori with three white discs | https://dl.ndl.go.jp/pid/1286895/1/22 |
| `samurai:honda-mino-hon` | 本多美濃守: a white nobori with a black band and 本 in black | https://dl.ndl.go.jp/pid/1286895/1/24 |
| `samurai:honda-mino-kin-obi` | 本多美濃守: a black banner with a gold band | https://dl.ndl.go.jp/pid/1286895/1/24 |

**The lettering.** The characters 五, 毘 and 本 are lettered in **Yuji Syuku**, a brush font by Kinuta Font Factory, Copyright 2021 The Yuji Project Authors
(https://github.com/Kinutafontfactory/Yuji), licensed under the **SIL Open Font License, Version 1.1**. `pnpm data:glyphs` (`scripts/fetch-glyphs.ts`) takes the
outlines of those characters only from the font at google/fonts commit f6a4e8a8 and keeps them in `data-sources/glyphs/yuji-syuku.json`, with the licence in
`data-sources/glyphs/OFL.txt`; the font itself is not in the repository or the package. The drawings use the outlines as artwork made with the font, which the licence does not restrict.

## Medieval banners

The medieval banners are a separate entry point (`@johnmorrisdotca/hata/medieval`, ids `med:<slug>`). Six are drawn for this package, under the MIT licence, as geometry
written out in `scripts/draw-medieval.ts`, from the page that dates each, and nothing is copied from a picture. The others are Wikimedia Commons files, taken as the
country flags are: each file's licence is read from Commons and only public domain and CC0 are shipped (never CC BY-SA), the file is optimised and its page, licence and author
are kept (`data-sources/medieval-commons-2026-11-24.json`, made by `pnpm data:medieval`). No banner of the time survives, so every drawing is a reconstruction. Read on 2026-11-24.

The six drawn here:

| Id | What | Source | What it says |
| --- | --- | --- | --- |
| `med:templar-baucent` | The Templars' banner | Beauseant, Wikipedia, https://en.wikipedia.org/wiki/Beauseant | 13th-century sources describe a white gonfanon with a black chief; Jacques de Vitry (1220s), Matthew Paris (c. 1250 to 1259) and the San Bevignate fresco (c. 1290). |
| `med:red-cross` | The red cross on white | Saint George's Cross, Wikipedia, https://en.wikipedia.org/wiki/Saint_George%27s_Cross | The Genoese annals show a plain red-cross flag from at least 1218; the red cross on white a crusaders' symbol from about 1190; the 1190 grant of Richard I is a tradition. |
| `med:gelre-denmark` | Denmark's banner in the Gelre Armorial | Gelre Armorial, Wikipedia, https://en.wikipedia.org/wiki/Gelre_Armorial | Compiled before 1396; folio 55v shows a banner with a white cross on red for "die coninc van denmarke", the earliest known coloured image of the Dannebrog. |
| `med:aragon-pallets` | The arms of Aragon | Flag of Aragon, Wikipedia, https://en.wikipedia.org/wiki/Flag_of_Aragon | The earliest undisputed material evidence is the seal of Alfonso II of 1159; the blazon is Or, four bars Gules. |
| `med:scotland-saltire` | The saltire of Scotland | Flag of Scotland, Wikipedia, https://en.wikipedia.org/wiki/Flag_of_Scotland | The white saltire on blue is recorded as a naval flag for 1507 (the carrack Great Michael) and shown in Lindsay's armorial in 1542. |
| `med:hospitaller-cross` | The Hospitallers' white cross on red | Knights Hospitaller, Wikipedia, https://en.wikipedia.org/wiki/Knights_Hospitaller | A plain silver cross in a field of red given to the order by Pope Innocent II (1130); a red surcoat with a white cross approved in 1248. |

The Commons files:

<!-- medieval-files:start -->
| Id | Commons file | Licence | Author as Commons gives it | Page |
| --- | --- | --- | --- | --- |
| `med:fr-blue-banner` | Banner of France (10th century-12th century).svg | Public domain | Dekodrak | https://commons.wikimedia.org/wiki/File:Banner_of_France_(10th_century-12th_century).svg |
| `med:fr-valois-lis` | Flag of medieval France.svg | Public domain | No machine-readable author provided. ZooFari assumed (based on copyright claims). | https://commons.wikimedia.org/wiki/File:Flag_of_medieval_France.svg |
| `med:fr-navarre-1284` | Flag of France and Navarre (1284 -1328).svg | CC0 | Johannes der junge | https://commons.wikimedia.org/wiki/File:Flag_of_France_and_Navarre_(1284_-1328).svg |
| `med:gb-royal-banner` | Royal Banner of England.svg | Public domain | Flag of the Duchy of Lancaster.svg: Yaddah / derivative work: Brunanburh | https://commons.wikimedia.org/wiki/File:Royal_Banner_of_England.svg |
| `med:hre-red-cross` | Flag of the Holy Roman Empire (1200-1350).svg | Public domain | User:Madden | https://commons.wikimedia.org/wiki/File:Flag_of_the_Holy_Roman_Empire_(1200-1350).svg |
| `med:hre-war-flag` | War flag of the Holy Roman Empire (1200-1350).svg | Public domain | Sir Iain | https://commons.wikimedia.org/wiki/File:War_flag_of_the_Holy_Roman_Empire_(1200-1350).svg |
| `med:genoa-cross` | Flag of Genoa.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Flag_of_Genoa.svg |
| `med:teutonic-banner` | Flag of the Teutonic Order.svg | Public domain | SVG by the uploader | https://commons.wikimedia.org/wiki/File:Flag_of_the_Teutonic_Order.svg |
| `med:teutonic-state` | Flag of the State of the Teutonic Order.svg | Public domain | Samhanin | https://commons.wikimedia.org/wiki/File:Flag_of_the_State_of_the_Teutonic_Order.svg |
| `med:leon` | Flag of Leon.svg | CC0 | Cartagena1741 | https://commons.wikimedia.org/wiki/File:Flag_of_Leon.svg |
| `med:navarre-chains` | Flag of Navarre (1212–1589).svg | CC0 | That Northern Irish Historian | https://commons.wikimedia.org/wiki/File:Flag_of_Navarre_(1212%E2%80%931589).svg |
| `med:portugal-first` | First banner of Portugal.svg | CC0 | UVA Cads | https://commons.wikimedia.org/wiki/File:First_banner_of_Portugal.svg |
| `med:hungary-arpad` | Flag of Hungary (11th-12th century).svg | Public domain | Thommy | https://commons.wikimedia.org/wiki/File:Flag_of_Hungary_(11th-12th_century).svg |
| `med:hungary-1170` | Flag of Hungary (late 12th century).svg | Public domain | Thommy | https://commons.wikimedia.org/wiki/File:Flag_of_Hungary_(late_12th_century).svg |
| `med:hungary-1467` | Flag of Hungary (15th century).svg | Public domain | Sir Iain | https://commons.wikimedia.org/wiki/File:Flag_of_Hungary_(15th_century).svg |
| `med:poland-eagle` | Flag of the Kingdom of Poland.svg | Public domain | Alex Tora or Alex K in Ukranian and Japanese wiki | https://commons.wikimedia.org/wiki/File:Flag_of_the_Kingdom_of_Poland.svg |
| `med:burgundy-saltire` | Flag of Cross of Burgundy.svg | Public domain | Ningyou. | https://commons.wikimedia.org/wiki/File:Flag_of_Cross_of_Burgundy.svg |
| `med:palaiologos-1250` | Palaiologos Flag 1250.svg | Public domain | originaly uploaded by Dragases (talk), transfered to commons by Μυρμηγκάκι | https://commons.wikimedia.org/wiki/File:Palaiologos_Flag_1250.svg |
| `med:byzantium-1375` | Byzantine imperial flag, 14th century, square.svg | Public domain | Dragases at English Wikipedia | https://commons.wikimedia.org/wiki/File:Byzantine_imperial_flag,_14th_century,_square.svg |
| `med:papal-states` | Flag of the Papal States (pre 1808).svg | Public domain | User:Dinozzo2005 | https://commons.wikimedia.org/wiki/File:Flag_of_the_Papal_States_(pre_1808).svg |
| `med:jerusalem-1162` | Flag of Kingdom of Jerusalem.svg | Public domain | Orange Tuesday at English Wikipedia | https://commons.wikimedia.org/wiki/File:Flag_of_Kingdom_of_Jerusalem.svg |
| `med:florence-ghibelline` | Flag of Florence (until 1250).svg | CC0 | HapHaxion | https://commons.wikimedia.org/wiki/File:Flag_of_Florence_(until_1250).svg |
| `med:pisa` | Flag of the Republic of Pisa.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Flag_of_the_Republic_of_Pisa.svg |
| `med:milan-1450` | Flag of the Duchy of Milan (1450, 2-3 ratio).svg | Public domain | F l a n k e r | https://commons.wikimedia.org/wiki/File:Flag_of_the_Duchy_of_Milan_(1450,_2-3_ratio).svg |
| `med:corsica-14c` | Flag of Corsica (14th century).svg | CC0 | Samhanin | https://commons.wikimedia.org/wiki/File:Flag_of_Corsica_(14th_century).svg |
| `med:serbia-1339` | Flag of Serbia (1339).svg | CC0 | Samhanin | https://commons.wikimedia.org/wiki/File:Flag_of_Serbia_(1339).svg |
| `med:serbian-church` | Serbian Church later Patriarchate flag 13th century.svg | CC0 | AnaliticStar | https://commons.wikimedia.org/wiki/File:Serbian_Church_later_Patriarchate_flag_13th_century.svg |
| `med:almoravid` | Flag of Almoravid dynasty 1073 1147.svg | Public domain | Flad | https://commons.wikimedia.org/wiki/File:Flag_of_Almoravid_dynasty_1073_1147.svg |
| `med:ayyubid` | Flag of Ayyubid Dynasty.svg | Public domain | Ch1902 | https://commons.wikimedia.org/wiki/File:Flag_of_Ayyubid_Dynasty.svg |
| `med:saladin` | Flag of Saladin.svg | CC0 | Salah ad-Din Yusuf ibn Ayyub | https://commons.wikimedia.org/wiki/File:Flag_of_Saladin.svg |
| `med:morocco-medieval` | Flag of Morocco (11th-13th Century) (Schwenkel).svg | CC0 | BlinxTheKitty | https://commons.wikimedia.org/wiki/File:Flag_of_Morocco_(11th-13th_Century)_(Schwenkel).svg |
| `med:wales-dragon` | Golden Dragon War Flag of Wales (created 1400).svg | CC0 | Llywelyn2000 | https://commons.wikimedia.org/wiki/File:Golden_Dragon_War_Flag_of_Wales_(created_1400).svg |
| `med:rostock-14c` | Flag of Rostock (Hanging flag, 14th century).svg | Public domain | Unknown | https://commons.wikimedia.org/wiki/File:Flag_of_Rostock_(Hanging_flag,_14th_century).svg |
| `med:swiss-cross` | Early Swiss cross.svg | Public domain | Dbachmann | https://commons.wikimedia.org/wiki/File:Early_Swiss_cross.svg |
| `med:unterwalden-1309` | Old flag of Unterwalden.svg | Public domain | Original: Unknown author Vector: Dbachmann | https://commons.wikimedia.org/wiki/File:Old_flag_of_Unterwalden.svg |
| `med:ragusa-secondary` | Secondary flag of Republic of Ragusa.svg | Public domain | Facquis | https://commons.wikimedia.org/wiki/File:Secondary_flag_of_Republic_of_Ragusa.svg |

Commons files left out of the medieval banners for their size or because they are not a plain vector (the size ceiling is 140 KB optimised):

| Id | Commons file | Why |
| --- | --- | --- |
| `med:venice-lion` | Lion of St Mark.svg | 301 KB optimised, over the 140 KB ceiling |
<!-- medieval-files:end -->
## Military flags

The military flags are a separate entry point (`@johnmorrisdotca/hata/military`, ids `mil:<slug>`). Five are drawn for this package, under the MIT licence, as
geometry written out in `scripts/draw-military.ts`, from the sources named, and nothing is copied from a picture. The others are Wikimedia Commons files, taken as
the country flags are: each file's licence is read from Commons and only public domain and CC0 are shipped, the file is optimised (`scripts/optimise.ts`) and its
page, licence and author are kept (`data-sources/military-commons-2026-11-24.json`, made by `pnpm data:military`). The Rising Sun Flag of Japan is in this set only,
as the ensign of the Japan Maritime Self-Defense Force and as the war ensign of the Imperial Japanese Navy, and is in no country's record. The two Confederate battle
flags are shipped for history and education only and never given by default (docs/decisions.md, "Restricted flags"). Read on 2026-11-24.

The five drawn here:

| Ids | What | Source | What it says |
| --- | --- | --- | --- |
| `mil:jp-jmsdf-ensign`, `mil:jp-ijn-ensign` | Japan: the Maritime Self-Defense Force's ensign and the Imperial Japanese Navy's | 自衛艦旗, Japanese Wikipedia, https://ja.wikipedia.org/wiki/自衛艦旗 | The ratio 2 to 3, the sun's diameter half the hoist, its centre a sixth of the length from the middle toward the hoist, rays of 11.25 degrees, set by Cabinet Order No. 179 of 1954; the navy's ensign fixed by the navy's flag regulations of 7 October 1889. |
| `mil:jp-jmsdf-ensign`, `mil:jp-ijn-ensign` | The dates and the red | Rising Sun Flag, Wikipedia, https://en.wikipedia.org/wiki/Rising_Sun_Flag | The Self-Defense Force ensign readopted on 30 June 1954 (red #bd0029); the navy's ensign adopted on 7 October 1889. |
| `mil:gb-white-ensign` | United Kingdom: the White Ensign | White Ensign, Wikipedia, https://en.wikipedia.org/wiki/White_Ensign | The Admiralty reserved it to the Royal Navy in 1864; the ratio is 1 to 2; the Union Flag is in the canton since 1801. |
| `mil:gb-naval-jack` | United Kingdom: the Union Jack as naval jack | Union Jack, Wikipedia, https://en.wikipedia.org/wiki/Union_Jack | The Union Flag flown at the bow as the jack is the Royal Navy's naval jack. |
| `mil:us-navy-jack` | United States: the Navy jack | Executive Order 10834 (1959), Wikisource, https://en.wikisource.org/wiki/Executive_Order_10834 | Fixes the union of the 50-star flag (0.76 by 0.5385 of the hoist) and its stars; the jack is that union, current from 4 July 1960. |

The Commons files:

<!-- military-files:start -->
| Id | Commons file | Licence | Author as Commons gives it | Page |
| --- | --- | --- | --- | --- |
| `mil:de-naval-ensign` | Naval Ensign of Germany.svg | Public domain | Deutsche Bundesregierung | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Germany.svg |
| `mil:de-war-ensign-1871` | War Ensign of Germany (1867–1892).svg | Public domain | Fornax, overhaul by Ericmetro. | https://commons.wikimedia.org/wiki/File:War_Ensign_of_Germany_(1867%E2%80%931892).svg |
| `mil:de-war-ensign-1919` | War Ensign of Germany (1919–1921).svg | Public domain | War_Ensign_of_Germany_1903-1918.svg: Original uploader was R-41 at en.wikipedia Flag_of_Weimar_Republic_(defence_minister_1919).svg: Jwnabd from German-Wikipedia Wappen_Deutsches_Reich_(Weimarer_Republik).svg: David Liuzzo derivative work: Mboro (talk) | https://commons.wikimedia.org/wiki/File:War_Ensign_of_Germany_(1919%E2%80%931921).svg |
| `mil:de-war-ensign-1921` | War Ensign of Germany (1921–1933).svg | Public domain | diese Datei: Jwnabd | https://commons.wikimedia.org/wiki/File:War_Ensign_of_Germany_(1921%E2%80%931933).svg |
| `mil:fr-naval-ensign` | Ensign of France.svg | Public domain | Original: Unknown Vector: David Newton | https://commons.wikimedia.org/wiki/File:Ensign_of_France.svg |
| `mil:it-naval-ensign-1947` | Naval Ensign of Italy (1947-2013).svg | Public domain | Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Italy_(1947-2013).svg |
| `mil:it-naval-jack` | Naval Jack of Italy.svg | Public domain | Design by Michele d'Andrea Asþont Older version by Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Italy.svg |
| `mil:it-war-flag` | War flag of Italy.svg | Public domain | Original: PavelD Derivative work: Carnby | https://commons.wikimedia.org/wiki/File:War_flag_of_Italy.svg |
| `mil:be-naval-ensign` | Naval Ensign of Belgium.svg | Public domain | user:Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Belgium.svg |
| `mil:be-naval-jack` | Naval Jack of Belgium.svg | Public domain | Dbenbenn and others | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Belgium.svg |
| `mil:dk-naval-ensign` | Naval Ensign of Denmark.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Denmark.svg |
| `mil:fi-naval-ensign` | Naval Ensign of Finland.svg | Public domain | Axel Gallén-Kallela, svg format by User:Denelson83 | https://commons.wikimedia.org/wiki/File:Military_flag_of_Finland.svg |
| `mil:fi-naval-jack` | Naval Jack of Finland.svg | Public domain | Axel Gallén-Kallela, svg format by User:Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Finland.svg |
| `mil:pl-naval-ensign` | Naval Ensign of Poland.svg | Public domain | Denelson83, Mareklug, Wanted | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Poland.svg |
| `mil:pl-naval-ensign-1919` | Naval Ensign of Poland (1919-1928).svg | Public domain | Naval_Ensign_of_Poland.svg: Denelson83, Mareklug, Wanted Herb Polski z lat 1919-1927 vector.svg: Ziegenpl derivative work: Mboro (talk) | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Poland_(1919-1928).svg |
| `mil:pl-naval-jack` | Naval Jack of Poland.svg | Public domain | Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Poland.svg |
| `mil:gr-naval-ensign` | Naval Ensign of Greece.svg | Public domain | Kwasura | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Greece.svg |
| `mil:ru-naval-ensign` | Naval Ensign of Russia.svg | Public domain | Zscout370, SeNeKa | https://commons.wikimedia.org/wiki/File:Naval_ensign_of_Russia.svg |
| `mil:ru-naval-jack` | Naval Jack of Russia.svg | Public domain | Zscout370 | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Russia.svg |
| `mil:su-naval-ensign` | Naval Ensign of the Soviet Union.svg | Public domain | User:Zscout370 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_the_Soviet_Union_(1950%E2%80%931991).svg |
| `mil:su-naval-jack` | Naval Jack of the Soviet Union.svg | Public domain | Zscout370 | https://commons.wikimedia.org/wiki/File:Naval_jack_of_the_Soviet_Union.svg |
| `mil:in-naval-ensign` | Naval Ensign of India.svg | Public domain | Indian Navy | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_India.svg |
| `mil:pk-naval-ensign` | Naval Ensign of Pakistan.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Pakistan.svg |
| `mil:pk-naval-jack` | Naval Jack of Pakistan.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Pakistan.svg |
| `mil:cn-naval-ensign` | Naval Ensign of the People's Republic of China.svg | Public domain | Created by PhiLiP / using CorelDRAW X3 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_China.svg |
| `mil:tw-naval-jack` | Naval Jack of the Republic of China.svg | Public domain | Lu Haodong | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_the_Republic_of_China.svg |
| `mil:au-naval-ensign` | Naval Ensign of Australia.svg | Public domain | David Newton (original) | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Australia.svg |
| `mil:au-naval-jack` | Naval Jack of Australia.svg | Public domain | Unknown (Vector graphics image by Ian Fieggen) (only minor code changes by uploader.) | https://commons.wikimedia.org/wiki/File:Flag_of_Australia_(converted).svg |
| `mil:ca-naval-ensign` | Naval Ensign of Canada.svg | Public domain | Her Majesty the Queen in Right of Canada, as represented by the Minister of National Defence (vectorised by Sodacan) | https://commons.wikimedia.org/wiki/File:Naval_ensign_of_Canada.svg |
| `mil:ca-naval-jack` | Naval Jack of Canada.svg | Public domain | Created by George F. G. Stanley / E Pluribus Anthony / User:Mzajac | https://commons.wikimedia.org/wiki/File:Flag_of_Canada.svg |
| `mil:nz-naval-ensign` | Naval Ensign of New Zealand.svg | Public domain | Denelson83 and Others | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_New_Zealand.svg |
| `mil:th-naval-jack` | Naval Jack of Thailand.svg | Public domain | Tangmo | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Thailand.svg |
| `mil:sg-naval-ensign` | Naval Ensign of Singapore.svg | Public domain | Republic of Singapore Navy. Vectorised by User:Denelson83. | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Singapore.svg |
| `mil:za-naval-ensign` | Naval Ensign of South Africa.svg | Public domain | Author of first-uploaded SVG file version is User:Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_South_Africa.svg |
| `mil:eg-naval-ensign` | Naval Ensign of Egypt.svg | Public domain | Denelson83 from original Flag of Egypt.svg | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Egypt.svg |
| `mil:il-naval-ensign` | Naval Ensign of Israel.svg | Public domain | Drawn by Makaristos, based on a previous version by Denelson83, Flag of Israel.svg and an image at the World Flag Database. | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Israel.svg |
| `mil:ua-naval-ensign` | Naval Ensign of Ukraine.svg | Public domain | UP9 | https://commons.wikimedia.org/wiki/File:Naval_Ensign_of_Ukraine.svg |
| `mil:id-naval-jack` | Naval Jack of Indonesia.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Indonesia.svg |
| `mil:ar-naval-jack` | Naval Jack of Argentina.svg | Public domain | Armada Argentina (Vector graphics image by Denelson83) | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Argentina.svg |
| `mil:cl-naval-jack` | Naval Jack of Chile.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Chile.svg |
| `mil:mx-naval-jack` | Naval Jack of Mexico.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Mexico.svg |
| `mil:no-naval-jack` | Naval Jack of Norway.svg | Public domain | Kingdom of Norway | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Norway.svg |
| `mil:pt-naval-jack` | Naval Jack of Portugal.svg | Public domain | Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Portugal.svg |
| `mil:es-naval-jack` | Naval Jack of Spain.svg | Public domain | Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_jack_of_Spain.svg |
| `mil:kr-naval-jack` | Naval Jack of South Korea.svg | Public domain | Republic of Korea Navy | https://commons.wikimedia.org/wiki/File:Naval_jack_of_South_Korea.svg |
| `mil:ph-naval-jack` | Naval Jack of the Philippines.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_the_Philippines.svg |
| `mil:ph-war-flag` | War Flag of the Philippines.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:War_Flag_of_the_Philippines.svg |
| `mil:ie-naval-jack` | Naval Jack of Ireland.svg | Public domain | Setanta Saki | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Ireland.svg |
| `mil:pe-naval-jack` | Naval Jack of Peru.svg | Public domain | Denelson83 | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Peru.svg |
| `mil:pe-war-flag` | War flag of Peru.svg | Public domain | Republic of Peru - Republica del Perú | https://commons.wikimedia.org/wiki/File:War_flag_of_Peru.svg |
| `mil:us-flag-1861` | Flag of the United States (1861–1863).svg | Public domain | Jacobolus (SVG) | https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1861%E2%80%931863).svg |
| `mil:us-flag-1863` | Flag of the United States (1863–1865).svg | Public domain | Jacobolus (SVG) | https://commons.wikimedia.org/wiki/File:Flag_of_the_United_States_(1863%E2%80%931865).svg |
| `mil:cs-battle-flag` | Battle flag of the Confederate States of America (1-1).svg | Public domain | William Porcher Miles (1822-1899) Vectorization: Zscout370 Stephanie~commonswiki Pumbaa80 TRAJAN 117 Current version: DeathHotDog | https://commons.wikimedia.org/wiki/File:Battle_flag_of_the_Confederate_States_of_America_(1-1).svg |
| `mil:cs-naval-jack` | Naval jack of the Confederate States (1863–1865).svg | Public domain | William Porcher Miles (1822-1899) | https://commons.wikimedia.org/wiki/File:Naval_jack_of_the_Confederate_States_(1863%E2%80%931865).svg |
| `mil:ro-naval-jack` | Naval Jack of Romania.svg | Public domain | an author the file's page does not name | https://commons.wikimedia.org/wiki/File:Naval_Jack_of_Romania.svg |

Commons files left out of the military flags for their size or because they are not a plain vector (the size ceiling is 140 KB optimised):

| Id | Commons file | Why |
| --- | --- | --- |
| `mil:de-war-ensign-1892` | War Ensign of Germany (1892–1903).svg | 211 KB optimised, over the 140 KB ceiling |
| `mil:de-war-ensign-1903` | War Ensign of Germany (1903–1919).svg | 227 KB optimised, over the 140 KB ceiling |
| `mil:it-naval-ensign` | Naval ensign of Italy.svg | 164 KB optimised, over the 140 KB ceiling |
| `mil:th-naval-ensign` | Naval Ensign of Thailand.svg | 250 KB optimised, over the 140 KB ceiling |
| `mil:co-naval-ensign` | Naval Ensign of Colombia.svg | 276 KB optimised, over the 140 KB ceiling |
| `mil:id-naval-ensign` | Naval ensign of Indonesia.svg | not a plain vector (an embedded raster picture or a style element) |
<!-- military-files:end -->

## Not carried

Nothing from other flag sets (flag-icons, country-flag-icons, circle-flags): they were measured for comparison
only. No flag under a share-alike licence, and no file from anywhere but Wikimedia Commons (the organisations' flags above are drawn for this package, not files).
