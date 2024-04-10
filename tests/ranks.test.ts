import { expect, test } from 'bun:test';
import { API, PLATFORM } from '../src';

test('1v1', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.get1v1();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('2v2', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.get2v2();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('3v3', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.get3v3();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Hoops', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getHoops();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Rumble', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getRumble();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Dropshot', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getDropshot();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Snowday', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getSnowday();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Tournament Matches', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getTournament();

    expect(result).toHaveProperty('rank');
    expect(result).toHaveProperty('tier');
    expect(result).toHaveProperty('division');
    expect(result).toHaveProperty('deltaUp');
    expect(result).toHaveProperty('deltaDown');
    expect(result).toHaveProperty('matchesPlayed');
    expect(result).toHaveProperty('winStreak');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('peakRating');
});

test('Overview', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.overview();

    expect(result).toHaveProperty('wins');
    expect(result).toHaveProperty('goals');
    expect(result).toHaveProperty('mVPs');
    expect(result).toHaveProperty('saves');
    expect(result).toHaveProperty('assists');
    expect(result).toHaveProperty('shots');
    expect(result).toHaveProperty('goalShotRatio');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('seasonRewardLevel');
    expect(result).toHaveProperty('seasonRewardWins');
    expect(result).toHaveProperty('tRNRating');
});

test('All', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getData();

    expect(result).toHaveProperty('overview');
    expect(result).toHaveProperty('gamemodes');
    expect(result.gamemodes).toHaveProperty('Ranked Duel 1v1');
    expect(result.gamemodes).toHaveProperty('Ranked Doubles 2v2');
    expect(result.gamemodes).toHaveProperty('Ranked Standard 3v3');
    expect(result.gamemodes).toHaveProperty('Hoops');
    expect(result.gamemodes).toHaveProperty('Rumble');
    expect(result.gamemodes).toHaveProperty('Dropshot');
    expect(result.gamemodes).toHaveProperty('Snowday');
});

test('UserInfo', async () => {
    const api = new API(PLATFORM.Epic, 'lil McNugget');
    const result = await api.getUserinfo();

    expect(result).toHaveProperty('platform');
    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('userid');
    expect(result).toHaveProperty('avatar');
});

test('Invalid user', async () => {
    const api = new API(PLATFORM.Epic, 'iojherogiuhoighjneriopghjnerg0ipe');
    try {
        await api.fetchUser();
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
    }
});
