# Chart builder

Easily build custom charts for Power BI.

### Motivation

Tableau's chart builder is fantastic, and it's a shame Power BI has nothing similar.
Vega and Vega-Lite dramatically simplify the process of building custom charts as you build a declarative spec instead of stringing together hundreds of lines of d3.
This project wraps a UI over generating a Vega-Lite spec, and then lets you export that spec - primary use-case is with [the custom visual for Power BI](https://github.com/SamWoolerton/pbi-custom-visual), where you can use the generated spec with your own data.

## Command line

### Project setup

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```

#### Run your tests

```
npm run test
```

#### Lints and fixes files

```
npm run lint
```

#### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
