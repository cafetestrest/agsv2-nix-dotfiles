import GLib from 'types/@girs/glib-2.0/glib-2.0';

export const uptime = Variable(0, {
	poll: [60_000, 'cat /proc/uptime', (line) => Number.parseInt(line.split('.')[0])],
});

export const clock = Variable(GLib.DateTime.new_now_local(), {
	poll: [1000, () => GLib.DateTime.new_now_local()],
});

const getWeather = async () => {
	const result = await Utils.fetch(
		'https://api.weatherapi.com/v1/forecast.json?key=caefc3e178484e2da38112101240404&q=Perm&days=1&aqi=no&alerts=no',
	).then((res) => res.json());
	return result;
};

export const weather = Variable(
	{},
	{
		poll: [30000, getWeather],
	},
);

export const WEATHER_SYMBOL = {
	default: '✨',
	Sunny: '🌞',
	Clear: '🌞',
	Cloudy: '☁️',
	Mist: '🌫️',
	Fog: '🌫',
	Blizard: '❄️',
	'Partly cloudy': '⛅️',
	Overcast: '⛅️',
	HeavyRain: '🌧',
	HeavyShowers: '🌧',
	HeavySnow: '❄️',
	HeavySnowShowers: '❄️',
	LightRain: '🌦',
	LightShowers: '🌦',
	LightSleet: '🌧',
	LightSleetShowers: '🌧',
	LightSnow: '🌨',
	LightSnowShowers: '🌨',
	ThunderyHeavyRain: '🌩',
	ThunderyShowers: '⛈',
	ThunderySnowShowers: '⛈',
	VeryCloudy: '☁️',
};
