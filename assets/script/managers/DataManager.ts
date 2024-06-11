/**
 * This class is to Manage overall game data
 * @author : @chandankrishn
 * Add functions and variable according
 */

import * as Response from "../constants/Response";

export class DataManager {
    private static _instance: DataManager = null!;
    public static get Instance() {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }

    private _userProfile: Response.Lobby = {};
    public get UserProfile(): Response.Lobby {
        return this._userProfile;
    }
    public set UserProfile(userData: Response.Lobby) {
        this._userProfile = userData;
    }
}
