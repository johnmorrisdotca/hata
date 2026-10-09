**What this changes**

**How it was checked**

- [ ] `pnpm check` passes (lint, types, build, the documentation of every export, tests, the packed package)
- [ ] `pnpm test:demo` passes, if the demo changed
- [ ] `pnpm data` leaves the tree unchanged, or the change to the flags is the point and is named in `CHANGELOG.md`
- [ ] A changed or new flag: `pnpm data:choose <code>` and `pnpm data:compare <code>` run, and any place `docs/compared.md` lists has a line in `REVIEWED`
