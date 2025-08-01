### server

This is a graphql server that serves a deep learning model for crop recommendation.

### Request to the server

All the request are served at this path: `/api/v1/graphql`

1. `Meta Query`

To query the meta data you run the query that looks as follows

```shell
fragment MetaFragment on Meta {
  main
  description
  language
  libraries
}

query Meta {
  meta {
    ...MetaFragment
  }
}
```

2. Crop Recommendation mutation

To get crop recommendations you run a mutation that looks as follows:

```shell
fragment ErrorFragment on Error {
  field
  message
}

fragment PredictionFragment on Prediction {
  crop
  label
  probability
}

mutation RecommendCrop($input: RecommendCropInput!) {
  recommendCrop(input: $input) {
    error {
      ...ErrorFragment
    }
    success
    prediction {
      predictions {
        ...PredictionFragment
      }
      top {
        ...PredictionFragment
      }
    }
  }
}

```

With the input that looks as follows:

```json
{
  "input": {
    "features": {
      "N": 11,
      "P": 23,
      "K": 32,
      "temperature": 29.14305,
      "humidity": 49.409833,
      "ph": 6.831707,
      "rainfall": 97.551555
    },
    "top": 5
  }
}
```

> Note that `top` property allows us to get the best to `n` recommended crops.

3. The server also exposes a translation POST route at `/api/v1/translate` which is served as a `REST` endpoint and it expect the following json body:

```json
{
  "text": "Hello, How are you?",
  "to": "xh"
}
```

and this will yield the following response:

```json
{
  "success": true,
  "translation": "Molo unjani?"
}
```

4. You can also query the weather by sending query to the graphql server that looks like:

```shell
fragment ErrorFragment on Error {
  field
  message
}

fragment CurrentWeatherFragment on Current {
  temperature
  weather_icons
  weather_descriptions
  wind_speed
  cloudcover
  wind_dir
  visibility
  feelslike
  pressure
  observation_time
}

fragment LocationFragment on Location {
  timezone_id
  country
  name
  region
}

query WeatherQuery($input: WeatherInput!) {
  weather(input: $input) {
    success
    error {
      ...ErrorFragment
    }
    weather {
      current {
        ...CurrentWeatherFragment
      }
      location {
        ...LocationFragment
      }
    }
  }
}
```

With variables that contains geo coordinates like this:

```json
{
  "input": {
    "lat": -32.789532,
    "lon": 26.833347
  }
}
```
