export interface UserUpdatePayload {
  /**
   * Player's information.
   */
  player?: {
    name?: string; // The player's name
    id?: string; // The player's ID
  };

  /**
   * The number of points the player has.
   * Default: 0
   */
  points?: number;

  /**
   * The number of wins the player has.
   * Default: 0
   */
  wins?: number;

  /**
   * The number of MVPs the player has achieved.
   * Default: 0
   */
  mvps?: number;

  /**
   * The number of losses the player has suffered.
   * Default: 0
   */
  losses?: number;

  /**
   * Array of games played by the player.
   * Default: []
   */
  gamesPlayed?: string[];

  /**
   * Indicates whether the player is blacklisted.
   * Default: false
   */
  blacklisted?: boolean;

  /**
   * List of protections the player has.
   * Default: Contains a "point_protect" protection added by the specified user.
   */
  protections?: Protection[];

  /**
   * List of channels that were originally associated with the player.
   * Default: Contains a channel and match ID pair.
   */
  originalChannels?: OriginalChannel[];
}
