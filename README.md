# Chakra theme for [Metapages](https://metapage.io/)

## Getting started

Run code: `just dev`
Publish: `just publish`

## About

Created to simplify the styling of metaframes using Chakra UI.

Target audience: developers building [metaframes](https://metapage.io/) or any static website where having the core tools of development, building and publishing are packaged and require a small number of commands.

This library consolidates styles used throughout different frontend applications and should help developers build components consistent with Metapage's visual design system.

## Host requirements

- [just](https://github.com/casey/just)
- [docker](https://docs.docker.com/get-started/)
- [deno](https://deno.land/manual/getting_started/installation)
- [mkcert](https://github.com/FiloSottile/mkcert#installation)

That's it. Commands are self-documenting: just type `just`

## Features

- automatic https certificate generation
- single command development (`just dev`)
- single command publishing to [npm](https://www.npmjs.com/)
- single command publishing to [github pages](https://pages.github.com/)
- `vite` for fast building
- `typescript` for type checking
- `chakra-ui.com` for the UI framework
- `just` for a single method to build/test/deploy/publish
- [Github Pages](https://pages.github.com/) publishing
  - automatic versioning:
    - `/`: latest
    - `/v1.5.2/`: that version tag (so all published versions are available forever)
- Common UI elements
  - Help button showing the (rendered) local `./Readme.md` file
  - Options (configurable) stored encoded in the URL hash params
- Metaframe outputs updated below, when connected.
- `just`file powered, dockerized, automated with dual human/CI controls

## Assumptions:

- `just` will be the command runner, not `npm` (directly) or `make` or any other underlying tech specific command runner. `just` is the main entry point to control all aspects of the software lifecycle.
  - Prefer contextual error messages with calls to action over documentation that is not as close as possible to the code or commands. Distance creates indirection and staleness and barriers to keep updated.
- You are building to publish at github pages with the url: `https://<user_org>.github.io/<repo-name>/`
  - github pages 👆 comes with limited options for some config:
    - we build browser assets in `./docs` instead of `./dist` (typical default) so that publishing to github pages is less configuration
- Operating this repository should be "easy" and enjoyable. It's a product of love and passion, I am hoping that you enjoy using at least just a little bit.
