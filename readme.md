<div align="center">
    <h1>Rocket League Stats</h1>
    <a href="https://www.codefactor.io/repository/github/im-xnugget/rocket-league-stats"><img src="https://www.codefactor.io/repository/github/im-xnugget/rocket-league-stats/badge" alt="CodeFactor" /></a>
    <a href="https://www.npmjs.com/package/rocket-league-stats"><img src="https://badgen.net/npm/v/rocket-league-stats?color=blue" alt="NPM-Version"/></a>
    <a href="https://www.npmjs.com/package/rocket-league-stats"><img src="https://badgen.net/npm/dt/rocket-league-stats?color=blue" alt="NPM-Downloads"/></a>
    <a href="https://github.com/im-xnugget/rocket-league-stats"><img src="https://badgen.net/github/stars/im-xnugget/rocket-league-stats?color=yellow" alt="Github Stars"/></a>
    <a href="https://github.com/im-xnugget/rocket-league-stats/issues"><img src="https://badgen.net/github/open-issues/im-xnugget/rocket-league-stats?color=green" alt="Issues"/></a>
    <h2>This a wrapper/scrapper of the TRNetwork site with <b>Rocket League</b> stats.</h2>
    <h3>There are no dependencies nor API key required.</h3>
<i>This project is built upon <a href="https://github.com/iFraan/rocketleague.js" alt="rocketleague.js Link">rocketleague.js</a></i>
</div>

To install use:

```shell
npm i rocket-league-stats
```

```shell
pnpm add rocket-league-stats
```

```shell
bun a rocket-league-stats
```

Example code:

```js
import { API, PLATFORM } from 'rocket-league-stats';

async function main() {
	const api = new API(PLATFORM.Epic, 'lil McNugget');
	const data1s = await api.get1v1();
	console.log(data1s);
	const data2s = await api.get2v2();
	console.log(data2s);
	const data3s = await api.get3v3();
	console.log(data3s);
	const dataHS = await api.getDropshot();
	console.log(dataHS);
	const dataH = await api.getHoops();
	console.log(dataH);
	const dataR = await api.getRumble();
	console.log(dataR);
	const dataS = await api.getSnowday();
	console.log(dataS);
	const dataAll = await api.getData();
	console.log(dataAll);
	const dataRaw = await api.getRaw();
	console.log(dataRaw);

	const data1sFresh = await api.get1v1({
		fresh: true,
	});
	console.log(data1sFresh);
}

main().catch((err) => {
	console.log(err);
});
```

# Disclaimer

This project is fully for educational purposes and if you want to use the rocketleague api in a production/commertial enviroment you should ask for one at [Rocket League Support](https://support.rocketleague.com/hc/en-us) or email the guys at [TRNetwork](https://tracker.gg/).
