const path = require("path");
const asyncRequest = require('async-request');
const express = require('express');

const port = 7000;
const pathPublic = path.join(__dirname, "./public"); //Static files in Express
const app = express();

const getWeather = async (location) => {
    const access_key = "*********************";
    const url = `http://api.weatherapi.com/v1/current.json?key=${access_key}&q=${location}&aqi=no`;

    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        const weather = {
            isSuccess: true,
            region: data.location?.region,
            country: data.location?.country,
            temperature: data.current?.temp_c,
            wind_speed: data.current?.wind_mph,
            precip: data.current?.precip_mm,
            cloudcover: data.current?.cloud
        };
        return weather;
    } catch (error) {
        return {
            isSuccess: false,
            error
        };
    };
};


app.use(express.static(pathPublic));
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
    const params = req.query;
    const location = params.address;

    const weather = await getWeather(location);

    if (location) {
        res.render('weather', {
            status: true,
            region: weather.region,
            country: weather.country,
            temperature: weather.temperature,
            wind_speed: weather.wind_speed,
            precip: weather.precip,
            cloudcover: weather.cloudcover
        });
    } else {
        res.render('weather', {
            status: false
        });
    }
});

app.listen(port, () => {
    console.log(`app run on port 7000 http://localhost:${port}`);
});

