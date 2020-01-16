export default {
  movies: {
    data: {
      url: "https://vega.github.io/vega-datasets/data/movies.json",
    },
    dataMethod: "url",
    columns: {
      IMDB_Rating: { type: "quantitative", scale: { domain: [0, 10] } },
      US_Gross: { type: "quantitative" },
      Worldwide_Gross: { type: "quantitative" },
      Production_Budget: { type: "quantitative" },
      MPAA_Rating: { type: "nominal" },
      Title: { type: "nominal" },
    },
    layersBase: [
      {
        name: "Bar",
        main: {
          mark: { type: "bar" },
          encoding: {
            x: "MPAA_Rating",
            y: "IMDB_Rating",
            color: "IMDB_Rating",
          },
        },
        config: {
          encoding: {
            y: {
              aggregate: "average",
            },
            color: {
              aggregate: "average",
            },
          },
        },
      },
    ],
  },
}
