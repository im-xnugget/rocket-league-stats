import type { AllStats, GenericOptions, InitializeOptions, OverviewStats, Platform, PlaylistStats, TPlaylists, Userinfo } from './types/internal';
import type { SegmentOverviewStats, SegmentPlaylistStats, Segments, SegmentsPlaylist, TrackerResponse } from './types/tracker';

export type { AllStats, GenericOptions, InitializeOptions, OverviewStats, Platform, PlaylistStats, TPlaylists, Userinfo };

export const PLATFORM = {
    Steam: 'steam',
    Epic: 'epic',
    Playstation: 'psn',
    Xbox: 'xbl',
} as const;

const BASE_URL = `https://api.tracker.gg/api/v2/rocket-league/standard/profile/`;

/**
 * Get the roman numeral of the division number
 * @param num - The number to convert to roman numeral
 * @returns The roman numeral of the number
 * @example
 * getRomanNumeral(1) // 'I'
 * getRomanNumeral(2) // 'II'
 */
export const getRomanNumeral = (num: number): string => {
    if (num > 4 || num < 1) return '';
    const roman = ['I', 'II', 'III', 'IV'];
    return roman[num - 1];
};

/**
 * Fetch data from the tracker network
 * @param url - The url to fetch the data from tracker network
 * @returns The user data from the tracker network
 * @example
 * fetchData('https://api.tracker.gg/api/v2/rocket-league/standard/profile/steam/76561198126577610')
 */
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

/**
 * Rocket League Stats API
 * @param platform - The platform of the user
 * @param username - The username of the user
 * @param options - The options for the API
 * @example
 * const api = new API(PLATFORM.EPIC, 'lil McNugget')
 * const data = await api.fetchUser()
 * console.log(data)
 * @throws {Error} - If the user is not found
 * @throws {Error} - If the user data is not found
 */
export class API {
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

    /**
     * Fetch the user data from the tracker network
     * @returns The user data from the tracker network
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.fetchUser()
     * console.log(data)
     * @throws {Error} - If the user is not found
     * @throws {Error} - If the user data is not found
     *
     */
    public async fetchUser() {
        this.raw = await fetchData(`${BASE_URL}${this.platform}/${this.username}`);
        if ((this.raw.errors?.length ?? 0) > 0) throw new Error(this.raw?.errors?.[0]?.message);
        this.lastFetch = Date.now();
        return this.raw;
    }
    /**
     * Get the overview stats of the user
     * @returns The overview stats of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.overview()
     * console.log(data)
     * @throws {Error} - If the overview data is not found
     * @throws {Error} - If the user data is not found
     */
    public async overview(options?: GenericOptions): Promise<OverviewStats> {
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

    /**
     * Return the stats of the user formatted
     * @private
     * @param stats - The stats of the user
     * @returns The formatted stats of the user
     */
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

    /**
     * Get the rank data of the user
     * @private
     * @param playlistName - The name of the playlist
     * @param options - The options for the API
     * @returns The rank data of the user
     */
    private async getRankData(playlistName: TPlaylists, options?: GenericOptions) {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();

        const data = this.raw.data.segments.find((x) => x?.metadata?.name === playlistName);
        if (!data) throw new Error(`No ${playlistName} data found`);
        const stats = data.stats as SegmentPlaylistStats;

        return this.returnStats(stats);
    }

    /**
     * Get the 1v1 rank data of the user
     * @param options - The options for the API
     * @returns The 1v1 rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.get1v1()
     * console.log(data)
     * @throws {Error} - If the 1v1 data is not found
     * @throws {Error} - If the user data is not found
     */
    public get1v1(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Duel 1v1', options);
    }

    /**
     * Get the 2v2 rank data of the user
     * @param options - The options for the API
     * @returns The 2v2 rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.get2v2()
     * console.log(data)
     * @throws {Error} - If the 2v2 data is not found
     * @throws {Error} - If the user data is not found
     */
    public get2v2(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Doubles 2v2', options);
    }

    /**
     * Get the 3v3 rank data of the user
     * @param options - The options for the API
     * @returns The 3v3 rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.get3v3()
     * console.log(data)
     * @throws {Error} - If the 3v3 data is not found
     * @throws {Error} - If the user data is not found
     */
    public get3v3(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Ranked Standard 3v3', options);
    }

    /**
     * Get the Hoops rank data of the user
     * @param options - The options for the API
     * @returns The Hoops rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getHoops()
     * console.log(data)
     * @throws {Error} - If the Hoops data is not found
     * @throws {Error} - If the user data is not found
     */
    public getHoops(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Hoops', options);
    }

    /**
     * Get the Rumble rank data of the user
     * @param options - The options for the API
     * @returns The Rumble rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getRumble()
     * console.log(data)
     * @throws {Error} - If the Rumble data is not found
     * @throws {Error} - If the user data is not found
     */
    public getRumble(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Rumble', options);
    }

    /**
     * Get the Dropshot rank data of the user
     * @param options - The options for the API
     * @returns The Dropshot rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getDropshot()
     * console.log(data)
     * @throws {Error} - If the Dropshot data is not found
     * @throws {Error} - If the user data is not found
     */
    public getDropshot(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Dropshot', options);
    }

    /**
     * Get the Snowday rank data of the user
     * @param options - The options for the API
     * @returns The Snowday rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getSnowday()
     * console.log(data)
     * @throws {Error} - If the Snowday data is not found
     * @throws {Error} - If the user data is not found
     */
    public getSnowday(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Snowday', options);
    }

    /**
     * Get the Tournament rank data of the user
     * @param options - The options for the API
     * @returns The Tournament rank data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getTournament()
     * console.log(data)
     * @throws {Error} - If the Tournament data is not found
     * @throws {Error} - If the user data is not found
     */
    public getTournament(options?: GenericOptions): Promise<PlaylistStats> {
        return this.getRankData('Tournament Matches', options);
    }

    /**
     * Get the user data
     * @description Get all ranks and overview data for the user
     * @param options - The options for the API
     * @returns The user data
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getData()
     * console.log(data)
     * @throws {Error} - If the user data is not found
     * @throws {Error} - If the overview data is not found
     */
    public async getData(options?: GenericOptions) {
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
    /**
     * Get the userinfo of the user
     * @param options - The options for the API
     * @returns The userinfo of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getUserinfo()
     * console.log(data)
     * @throws {Error} - If the user data is not found
     * @throws {Error} - If the userinfo data is not found
     */
    public async getUserinfo(options?: GenericOptions): Promise<Userinfo> {
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
    /**
     * Get the raw data of the user
     * @param options - The options for the API
     * @returns The raw data of the user
     * @example
     * const api = new API(PLATFORM.EPIC, 'lil McNugget')
     * const data = await api.getRaw()
     * console.log(data)
     * @throws {Error} - If the user data is not found
     * @throws {Error} - If the raw data is not found
     */
    public async getRaw(options?: GenericOptions): Promise<TrackerResponse> {
        if (!this.raw) await this.fetchUser();
        if (!this.raw) throw new Error('No data found');
        if (this.lastFetch + this.expiresAfter < Date.now() || options?.fresh) await this.fetchUser();
        return this.raw;
    }
}
