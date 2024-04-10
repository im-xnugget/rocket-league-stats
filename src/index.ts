import type { AllStats, GenericOptions, InitializeOptions, OverviewStats, Platform, PlaylistStats, TPlaylists, Userinfo } from './types/internal';
import type { SegmentOverviewStats, SegmentPlaylistStats, Segments, SegmentsPlaylist, TrackerResponse } from './types/tracker';

const PLATFORM = {
    Steam: 'steam',
    Epic: 'epic',
    Playstation: 'psn',
    Xbox: 'xbl',
} as const;

const BASE_URL = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/`;

const fetchData = (url: string): Promise<TrackerResponse> =>
    new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                Origin: 'https://rocketleague.tracker.network',
                Referer: 'https://rocketleague.tracker.network/',
            },
        })
            .then((res) => res.json())
            .then((json) => resolve(json))
            .catch((err) => reject(err));
    });

class API {
    private platform: Platform;
    private username: string;
    private raw: TrackerResponse | undefined = undefined;
    private expiresAfter: number = 1000 * 60; // 1 minute
    private lastFetch: number = 0;

    constructor(platform: Platform, username: string, options?: InitializeOptions) {
        this.platform = platform;
        this.username = username;
        if (options?.expiresAfter) this.expiresAfter = options.expiresAfter;
    }

    async fetchUser() {
        this.raw = await fetchData(`${BASE_URL}${this.platform}/${this.username}`);
        if ((this.raw.errors?.length ?? 0) > 0) throw new Error(this.raw?.errors?.[0]?.message);
        this.lastFetch = Date.now();
        return this.raw;
    }

    async overview(options?: GenericOptions): Promise<OverviewStats> {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();

        const data = this.raw.data.segments.find((x) => x.type === 'overview');
        if (!data) throw new Error('No overview data found');

        const stats = data.stats as SegmentOverviewStats;

        return {
            assists: stats.assists.value,
            goals: stats.goals.value,
            goalShotRatio: stats.goalShotRatio.value,
            mVPs: stats.mVPs.value,
            saves: stats.saves.value,
            score: stats.score.value,
            seasonRewardLevel: stats.seasonRewardLevel.value,
            seasonRewardWins: stats.seasonRewardWins.value,
            shots: stats.shots.value,
            tRNRating: stats.tRNRating.value,
            wins: stats.wins.value,
        };
    }

    private returnStats(stats: SegmentPlaylistStats): PlaylistStats {
        return {
            division: stats.division.value,
            deltaUp: stats.division.metadata.deltaUp ?? null,
            deltaDown: stats.division.metadata.deltaDown ?? null,
            matchesPlayed: stats.matchesPlayed.value,
            peakRating: stats.peakRating.value,
            rank: stats.tier.metadata.name,
            rating: stats.rating.value,
            tier: stats.tier.value,
            winStreak: stats.winStreak.displayValue === '0' ? 0 : parseInt(stats.winStreak.displayValue, 10),
        };
    }

    private async getRankData(playlistName: TPlaylists, options?: GenericOptions) {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();

        const data = this.raw.data.segments.find((x) => x?.metadata?.name === playlistName);
        if (!data) throw new Error(`No ${playlistName} data found`);
        const stats = data.stats as SegmentPlaylistStats;

        return this.returnStats(stats);
    }
    get1v1(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Duel 1v1', options);
    }

    get2v2(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Doubles 2v2', options);
    }

    get3v3(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Standard 3v3', options);
    }

    getHoops(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Hoops', options);
    }

    getRumble(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Rumble', options);
    }

    getDropshot(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Dropshot', options);
    }

    getSnowday(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Snowday', options);
    }

    async getData(options?: GenericOptions) {
        const result = {} as AllStats;
        result.overview = await this.overview(options);
        result.gamemodes = {} as AllStats['gamemodes'];
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');

        const playlists = this.raw.data.segments.filter((x) => x.type === 'playlist') as (SegmentsPlaylist & Segments)[];
        for (const playlist of playlists) {
            if (playlist) {
                const stats = playlist.stats as SegmentPlaylistStats;
                result.gamemodes[playlist.metadata.name] = {} as PlaylistStats;
                result.gamemodes[playlist.metadata.name]['rank'] = stats.tier.metadata.name;
                result.gamemodes[playlist.metadata.name] = this.returnStats(stats);
            }
        }

        return result;
    }

    async getUserinfo(options?: GenericOptions): Promise<Userinfo> {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();

        const platform = this.raw.data.platformInfo;

        return {
            platform: platform.platformSlug,
            uuid: platform.platformUserId,
            name: platform.platformUserHandle,
            userid: platform.platformUserIdentifier,
            avatar: platform.avatarUrl,
        };
    }

    async getRaw(options?: GenericOptions): Promise<TrackerResponse> {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();
        return this.raw;
    }
}

export { API, PLATFORM };
