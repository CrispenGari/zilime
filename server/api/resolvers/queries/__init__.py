from ariadne import QueryType
from api.types import Meta, Error
import requests
import os

query = QueryType()


@query.field("meta")
def meta_resolver(obj, info):
    return Meta(
        main="Crop Recommendation AI",
        description="This is a python graphql server for serving crop recommendation model.",
        language="python",
        libraries=["pytorch", "pandas", "googletrans"],
    ).to_json()


@query.field("weather")
def weather_resolver(obj, info, input):
    try:
        api_key = os.getenv("WEATHER_STACK_API_KEY")
        #   res = requests.get(
        #       f"https://api.weatherstack.com/current?access_key={api_key}&query={input['lat']},{input['lon']}"
        #   ).json()
        res = {
            "request": {
                "type": "LatLon",
                "query": "Lat -32.79 and Lon 26.83",
                "language": "en",
                "unit": "m",
            },
            "location": {
                "name": "Alice",
                "country": "South Africa",
                "region": "Eastern Cape",
                "lat": "-32.783",
                "lon": "26.833",
                "timezone_id": "Africa/Johannesburg",
                "localtime": "2025-07-30 07:46",
                "localtime_epoch": 1753861560,
                "utc_offset": "2.0",
            },
            "current": {
                "observation_time": "05:46 AM",
                "temperature": 16,
                "weather_code": 113,
                "weather_icons": [
                    "https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png"
                ],
                "weather_descriptions": ["Clear "],
                "astro": {
                    "sunrise": "07:05 AM",
                    "sunset": "05:34 PM",
                    "moonrise": "10:07 AM",
                    "moonset": "11:13 PM",
                    "moon_phase": "Waxing Crescent",
                    "moon_illumination": 27,
                },
                "air_quality": {
                    "co": "220.15",
                    "no2": "2.775",
                    "o3": "71",
                    "so2": "7.585",
                    "pm2_5": "11.84",
                    "pm10": "11.84",
                    "us-epa-index": "1",
                    "gb-defra-index": "1",
                },
                "wind_speed": 18,
                "wind_degree": 351,
                "wind_dir": "N",
                "pressure": 1021,
                "precip": 0,
                "humidity": 27,
                "cloudcover": 5,
                "feelslike": 16,
                "uv_index": 0,
                "visibility": 10,
                "is_day": "yes",
            },
        }
        return {"success": True, "weather": res}
    except Exception:
        return {
            "error": Error(
                "server", "There was something wrong on the server."
            ).to_json(),
            "success": False,
        }
