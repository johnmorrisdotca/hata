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
| The flags themselves | Wikimedia Commons, one file a flag, kept in `data-sources/commons/` and recorded with their metadata in `data-sources/commons-2026-10-09.json` | Each file's own: public domain, CC0 or CC BY, below |
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
- `US-MS` Mississippi: "Flag of Mississippi.svg", author as Commons gives it: Rocky Vaughn, Sue Anna Joe, Dominique Pugh, Clay Moss, Kara Giles, Micah Whitson and the Mississippi Department of Archives and History; Copyrighted free use (accepted: the holder allows any use for any purpose with no condition, freer than CC BY; John, 2026-10-09: include Mississippi); https://commons.wikimedia.org/wiki/File:Flag_of_Mississippi.svg
- `BL--local` St. Barthélemy, Saint-Barthélemy's local flag: "Flag of Saint Barthélemy (local).svg", author as Commons gives it: The arms are from User:Manassas's Image:Blason St Barthélémy TOM entire.svg.; CC BY 2.5 (https://creativecommons.org/licenses/by/2.5); https://commons.wikimedia.org/wiki/File:Flag_of_Saint_Barth%C3%A9lemy_(local).svg
<!-- attributions:end -->

## The flag sets a drawing was taken from

Where a flag set's drawing is the same flag as Commons' at the same proportions and smaller, or free where
Commons' is not, it is shipped instead (`pnpm data:choose` decides, and each flag's manifest entry says why). The
sets are under the MIT licence, which asks that their copyright and permission notice go with every copy:

<!-- sets:start -->
### country-flag-icons 1.6.20

https://gitlab.com/catamphetamine/country-flag-icons, on npm as `country-flag-icons`. The drawings of `YE`.

```text
(The MIT License)

Copyright (c) 2020 @catamphetamine <purecatamphetamine@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### flag-icons 7.5.0

https://github.com/lipis/flag-icons, on npm as `flag-icons`. The drawings made for a frame: `ad.4x3`, `ad.1x1`, `ae.4x3`, `ae.1x1`, `af.4x3`, `af.1x1`, `ag.4x3`, `ag.1x1`, `ai.4x3`, `ai.1x1`, `al.4x3`, `al.1x1`, `am.4x3`, `am.1x1`, `ao.4x3`, `ao.1x1`, `ar.4x3`, `ar.1x1`, `as.4x3`, `as.1x1`, `at.4x3`, `at.1x1`, `au.4x3`, `au.1x1`, `aw.4x3`, `aw.1x1`, `ax.4x3`, `ax.1x1`, `az.4x3`, `az.1x1`, `ba.4x3`, `ba.1x1`, `bb.4x3`, `bb.1x1`, `bd.4x3`, `bd.1x1`, `be.4x3`, `be.1x1`, `bf.4x3`, `bf.1x1`, `bg.4x3`, `bg.1x1`, `bh.4x3`, `bh.1x1`, `bi.4x3`, `bj.4x3`, `bj.1x1`, `bm.4x3`, `bm.1x1`, `bn.4x3`, `bn.1x1`, `bo.4x3`, `bo.1x1`, `br.4x3`, `br.1x1`, `bt.4x3`, `bt.1x1`, `bw.4x3`, `bw.1x1`, `by.4x3`, `by.1x1`, `ca.4x3`, `ca.1x1`, `cd.1x1`, `cf.4x3`, `cf.1x1`, `cg.4x3`, `cg.1x1`, `ch.4x3`, `ci.4x3`, `ci.1x1`, `ck.4x3`, `ck.1x1`, `cl.4x3`, `cl.1x1`, `cm.4x3`, `cm.1x1`, `cn.4x3`, `cn.1x1`, `co.4x3`, `co.1x1`, `cr.4x3`, `cr.1x1`, `cu.4x3`, `cu.1x1`, `cv.4x3`, `cv.1x1`, `cw.4x3`, `cw.1x1`, `cy.4x3`, `cy.1x1`, `cz.4x3`, `cz.1x1`, `de.4x3`, `de.1x1`, `dk.1x1`, `dm.4x3`, `dm.1x1`, `do.4x3`, `do.1x1`, `dz.4x3`, `dz.1x1`, `ec.4x3`, `ec.1x1`, `ee.4x3`, `ee.1x1`, `eg.4x3`, `eg.1x1`, `es.4x3`, `es.1x1`, `fi.4x3`, `fi.1x1`, `fj.4x3`, `fj.1x1`, `fk.4x3`, `fk.1x1`, `fm.4x3`, `fm.1x1`, `fo.4x3`, `fo.1x1`, `fr.4x3`, `fr.1x1`, `ga.1x1`, `gb.4x3`, `gb.1x1`, `gd.4x3`, `gd.1x1`, `ge.4x3`, `ge.1x1`, `gg.4x3`, `gg.1x1`, `gh.4x3`, `gh.1x1`, `gi.4x3`, `gi.1x1`, `gl.4x3`, `gl.1x1`, `gm.4x3`, `gm.1x1`, `gn.4x3`, `gn.1x1`, `gq.4x3`, `gq.1x1`, `gr.4x3`, `gr.1x1`, `gs.4x3`, `gs.1x1`, `gt.4x3`, `gt.1x1`, `gu.4x3`, `gu.1x1`, `gw.4x3`, `gw.1x1`, `hk.4x3`, `hk.1x1`, `hn.4x3`, `hn.1x1`, `hr.4x3`, `hr.1x1`, `hu.4x3`, `hu.1x1`, `id.4x3`, `id.1x1`, `ie.4x3`, `ie.1x1`, `il.4x3`, `il.1x1`, `im.4x3`, `im.1x1`, `in.4x3`, `in.1x1`, `io.4x3`, `io.1x1`, `iq.4x3`, `iq.1x1`, `ir.4x3`, `ir.1x1`, `is.4x3`, `is.1x1`, `it.4x3`, `it.1x1`, `je.4x3`, `je.1x1`, `jo.4x3`, `jo.1x1`, `jp.4x3`, `jp.1x1`, `ke.4x3`, `ke.1x1`, `kg.4x3`, `kg.1x1`, `kh.4x3`, `kh.1x1`, `km.4x3`, `km.1x1`, `kn.4x3`, `kn.1x1`, `kp.4x3`, `kp.1x1`, `kr.4x3`, `kr.1x1`, `kw.4x3`, `kw.1x1`, `ky.4x3`, `ky.1x1`, `kz.4x3`, `kz.1x1`, `la.4x3`, `la.1x1`, `lb.4x3`, `lb.1x1`, `lc.4x3`, `lc.1x1`, `li.4x3`, `li.1x1`, `lr.4x3`, `lr.1x1`, `ls.4x3`, `ls.1x1`, `lt.4x3`, `lt.1x1`, `lu.4x3`, `lu.1x1`, `lv.4x3`, `lv.1x1`, `ly.4x3`, `ly.1x1`, `ma.4x3`, `ma.1x1`, `mc.4x3`, `mc.1x1`, `md.4x3`, `md.1x1`, `me.4x3`, `me.1x1`, `mg.4x3`, `mg.1x1`, `mh.4x3`, `mh.1x1`, `mk.4x3`, `mk.1x1`, `ml.4x3`, `ml.1x1`, `mm.4x3`, `mm.1x1`, `mn.4x3`, `mn.1x1`, `mo.4x3`, `mo.1x1`, `mr.4x3`, `mr.1x1`, `ms.4x3`, `ms.1x1`, `mt.4x3`, `mt.1x1`, `mv.4x3`, `mv.1x1`, `mw.4x3`, `mw.1x1`, `mx.4x3`, `mx.1x1`, `my.4x3`, `my.1x1`, `na.4x3`, `na.1x1`, `nc.4x3`, `nc.1x1`, `ne.4x3`, `ne.1x1`, `nf.4x3`, `nf.1x1`, `ng.4x3`, `ng.1x1`, `ni.4x3`, `ni.1x1`, `nl.4x3`, `nl.1x1`, `no.4x3`, `no.1x1`, `np.4x3`, `np.1x1`, `nr.4x3`, `nr.1x1`, `nu.4x3`, `nu.1x1`, `nz.4x3`, `nz.1x1`, `pa.4x3`, `pa.1x1`, `pe.4x3`, `pe.1x1`, `pf.4x3`, `pf.1x1`, `pg.1x1`, `ph.4x3`, `ph.1x1`, `pl.4x3`, `pl.1x1`, `pn.4x3`, `pn.1x1`, `pr.4x3`, `pr.1x1`, `ps.4x3`, `ps.1x1`, `pt.4x3`, `pt.1x1`, `pw.4x3`, `pw.1x1`, `py.4x3`, `py.1x1`, `qa.4x3`, `qa.1x1`, `ro.4x3`, `ro.1x1`, `rs.4x3`, `rs.1x1`, `ru.4x3`, `ru.1x1`, `rw.4x3`, `rw.1x1`, `sa.4x3`, `sa.1x1`, `sc.4x3`, `sc.1x1`, `sd.4x3`, `sd.1x1`, `se.4x3`, `se.1x1`, `sg.4x3`, `sg.1x1`, `si.4x3`, `si.1x1`, `sk.4x3`, `sk.1x1`, `sl.4x3`, `sl.1x1`, `sm.1x1`, `sn.4x3`, `sn.1x1`, `so.4x3`, `so.1x1`, `sr.4x3`, `sr.1x1`, `ss.4x3`, `st.4x3`, `st.1x1`, `sv.4x3`, `sv.1x1`, `sx.4x3`, `sx.1x1`, `sy.4x3`, `sy.1x1`, `sz.4x3`, `sz.1x1`, `tc.4x3`, `tc.1x1`, `td.4x3`, `td.1x1`, `tf.4x3`, `tf.1x1`, `tg.4x3`, `tg.1x1`, `th.4x3`, `th.1x1`, `tj.4x3`, `tj.1x1`, `tk.4x3`, `tk.1x1`, `tm.4x3`, `tm.1x1`, `tn.4x3`, `tn.1x1`, `to.4x3`, `to.1x1`, `tr.4x3`, `tr.1x1`, `tt.4x3`, `tt.1x1`, `tv.4x3`, `tv.1x1`, `tw.4x3`, `tw.1x1`, `tz.4x3`, `tz.1x1`, `ua.4x3`, `ua.1x1`, `ug.4x3`, `ug.1x1`, `us.4x3`, `us.1x1`, `uy.4x3`, `uy.1x1`, `uz.4x3`, `uz.1x1`, `va.4x3`, `vc.4x3`, `vc.1x1`, `ve.4x3`, `ve.1x1`, `vg.4x3`, `vg.1x1`, `vi.4x3`, `vi.1x1`, `vn.4x3`, `vn.1x1`, `vu.4x3`, `vu.1x1`, `ws.4x3`, `ws.1x1`, `xk.4x3`, `xk.1x1`, `za.4x3`, `za.1x1`, `zm.4x3`, `zm.1x1`, `zw.4x3`, `zw.1x1`, `gb-eng.4x3`, `gb-eng.1x1`, `gb-sct.4x3`, `gb-sct.1x1`, `gb-wls.4x3`, `gb-wls.1x1`.

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

## Not carried

Nothing from other flag sets (flag-icons, country-flag-icons, circle-flags): they were measured for comparison
only. No flag under a share-alike licence, and no file from anywhere but Wikimedia Commons.
