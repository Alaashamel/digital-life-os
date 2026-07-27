const WeatherApp = {
    weather: null,
    window: null,
    
    init(window) {
        this.window = window;
        this.loadWeather();
        this.render();
        Notifications.success('Weather', 'Weather launched');
    },
    
    loadWeather() {
        this.weather = Storage.get('dlos_weather_data') || {
            city: 'Cairo',
            country: 'EG',
            temperature: 28,
            humidity: 45,
            windSpeed: 12,
            condition: 'Partly Cloudy',
            icon: '⛅',
            forecast: [
                { day: 'Mon', high: 30, low: 22, condition: 'Sunny', icon: '☀️' },
                { day: 'Tue', high: 28, low: 20, condition: 'Cloudy', icon: '☁️' },
                { day: 'Wed', high: 25, low: 18, condition: 'Rainy', icon: '🌧️' },
                { day: 'Thu', high: 27, low: 19, condition: 'Sunny', icon: '☀️' },
                { day: 'Fri', high: 29, low: 21, condition: 'Sunny', icon: '☀️' },
            ]
        };
    },
    
    render() {
        const content = this.window.getContent();
        content.innerHTML = `<div class="weather-app"><div class="weather-current"><div class="weather-icon">${this.weather.icon}</div><div class="weather-temp">${this.weather.temperature}°C</div><div class="weather-city">${this.weather.city}, ${this.weather.country}</div><div class="weather-condition">${this.weather.condition}</div><div class="weather-details"><div>💧 ${this.weather.humidity}%</div><div>💨 ${this.weather.windSpeed} km/h</div></div></div><div class="weather-forecast"><h3>5-Day Forecast</h3><div class="forecast-grid">${this.weather.forecast.map(day => `<div class="forecast-day"><div class="forecast-day-name">${day.day}</div><div class="forecast-icon">${day.icon}</div><div class="forecast-temps">${day.high}°/${day.low}°</div><div class="forecast-condition">${day.condition}</div></div>`).join('')}</div></div><button class="btn" onclick="WeatherApp.loadWeather(); WeatherApp.render();" style="width:100%;margin-top:15px">🔄 Refresh</button><style>.weather-app{display:flex;flex-direction:column;height:100%;padding:15px}.weather-current{text-align:center;background:linear-gradient(135deg,var(--accent-color),#00b4d8);color:#fff;padding:30px;border-radius:12px;margin-bottom:20px}.weather-icon{font-size:64px;margin-bottom:10px}.weather-temp{font-size:32px;font-weight:600}.weather-city{font-size:16px;opacity:.9}.weather-condition{font-size:14px;opacity:.8}.weather-details{display:flex;justify-content:center;gap:20px;margin-top:15px;font-size:14px}.weather-forecast{flex:1;overflow-y:auto}.weather-forecast h3{margin-bottom:10px;font-size:14px}.forecast-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:10px}.forecast-day{background:var(--bg-tertiary);padding:12px;border-radius:8px;text-align:center;border:1px solid var(--border-color)}.forecast-day-name{font-weight:600;font-size:12px;margin-bottom:5px}.forecast-icon{font-size:24px;margin:5px 0}.forecast-temps{font-size:11px;font-weight:500;margin-bottom:3px}.forecast-condition{font-size:10px;color:var(--text-secondary)}</style></div>`;
    }
};