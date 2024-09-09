# Access8mathweb

## Sites

- Production: https://access8mathweb.coseeing.org/
- Staging: https://access8math-stg.coseeing.org

## Prerequisites

- Node.js >= 18
- NPM >= 9

## Coseeing Github Packages

To install the coseeing packages, please refer to [Github Doc](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

## Develop with Coseeing Packages

You can use `npm link` to link the local module as you want.
https://docs.npmjs.com/cli/v10/commands/npm-link

### Example

Let's say it is your directory structure.

```
workspace/
├── access8math-web-template/ <- @coseeing/access8math-web-lib
└── Access8MathWeb/ <- you are developing application here
```

```sh
# you are at workspace
# move to package repository
cd access8math-web-template/

# register the package in your local npm system
npm link

# move to application repository
cd ../Access8MathWeb/
# link package
npm link @coseeing/access8math-web-lib
```

## Project setup

```
npm install
```

### Development

```
npm runs start
```

### Build for Production

```
npm run build
```

### Lint

```
npm run lint
```

### Test

```
npm run test
```

### Format

```
npm run format
```

### Demo Content

```
## Question 1

1. \({{\left( -3 \right)}^{3}}\)之值為何？
(A) \(-27\)
(B) \(-9\)
(C) \(9\)
(D) \(27\)
```
