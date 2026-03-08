# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.1.1](https://github.com/Danielsio/tichel-co/compare/v0.1.0...v0.1.1) (2026-03-08)

### Features

- add brand assets (favicon, apple icon, OG image, PWA icons) ([f32c1a4](https://github.com/Danielsio/tichel-co/commit/f32c1a4ce082ddd5d40fd47e1ef5aeb3c34f051e))
- add production health monitoring (health endpoint, smoke tests, uptime checks) ([5462bfc](https://github.com/Danielsio/tichel-co/commit/5462bfc1df738afec61d9ff7f0b7a5fc964c9dd2))
- redesign home, collection, footer, account, and search UI ([db4b12a](https://github.com/Danielsio/tichel-co/commit/db4b12a25466450d5b3f46d288c1f9a5099f8e33))
- upgrade product card, header, and auth pages ([dace220](https://github.com/Danielsio/tichel-co/commit/dace220e5c47217d31b76bf5ab75db483fca5ac3))
- upgrade product page, cart drawer, and checkout UX ([25ed944](https://github.com/Danielsio/tichel-co/commit/25ed944ab059cb830929e4bbf6f937c6db8cd57b))

### Bug Fixes

- add packageManager field for pnpm/action-setup@v4 ([0d7dec6](https://github.com/Danielsio/tichel-co/commit/0d7dec6f737ec3a0e1712864447a7bb9405c4b6c))
- approve trusted pnpm build scripts ([88b35f0](https://github.com/Danielsio/tichel-co/commit/88b35f09c2b8cb1b30bb96bd1f9d0867ea0990e0))
- correct cart aria-labels and remove pointer-events-none from variants ([d86d05f](https://github.com/Danielsio/tichel-co/commit/d86d05fd1bb83e1333f44d5c4c8e37c0abe590ee))
- defer Stripe and Resend secrets in apphosting.yaml ([4604eb3](https://github.com/Danielsio/tichel-co/commit/4604eb31f818b5d51c0bda7b5ae9b5cb03f295b1))
- disable Husky pre-push hook in release workflow ([5db9f5b](https://github.com/Danielsio/tichel-co/commit/5db9f5b87e18b95d32e3a43b056288ce36c61e22))
- resolve TS2532 errors in web-vitals-reporter tests ([25f7a33](https://github.com/Danielsio/tichel-co/commit/25f7a3341f5f917837f5c31127d33db8ad2f4e9e))
- update all Firestore defaults from tichel-co-db to tichel-co-db-eu ([0690f8a](https://github.com/Danielsio/tichel-co/commit/0690f8a660562620561a8ef36ffbf18776919933))

### Performance

- configurable Firestore region for EU co-location test ([5eac771](https://github.com/Danielsio/tichel-co/commit/5eac7710e5c0192d2d4ed2078b41385779c1a721))
- optimize brand assets to correct dimensions ([e8229cf](https://github.com/Danielsio/tichel-co/commit/e8229cf36f42dbda0373211f3849025c8c8d8295))

### Documentation

- add experiment results to performance audit ([2d6272d](https://github.com/Danielsio/tichel-co/commit/2d6272d1718e14d355a41001c2e4eb03fd65aaac))
- rewrite README to reflect current stack ([e5e4bc1](https://github.com/Danielsio/tichel-co/commit/e5e4bc106529b1c054e7262f3af6691268d9453e))
