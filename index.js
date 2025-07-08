const { LogsManager } = require("./src/managers/logs/LogsManager");
const { ChannelManager } = require("./src/managers/channel/ChannelManager");
const { UsersManager } = require("./src/managers/users/UsersManager");
const { BetsManager } = require("./src/managers/bets/BetsManager");
const { MatchesManager } = require("./src/managers/matches/MatchesManager");
const { MediatorsManager } = require("./src/managers/mediators/MediatorsManager");
const { GuildsManager } = require("./src/managers/guilds/GuildsManager");

const { User } = require("./src/structures/User");
const { REST } = require("./src/rest/REST");
const { Bet } = require("./src/structures/Bet");
const { Guild } = require("./src/structures/Guild");
const { Match } = require("./src/structures/Match");
const { BetUser } = require("./src/structures/BetUser");
const { Collection } = require("./src/structures/Collection");
const { Mediator } = require("./src/structures/Mediator");
const { Channel } = require("./src/structures/Channel");
const { Product } = require("./src/structures/Product");
const { ProductsManager } = require("./src/managers/products/ProductsManager");
const { Shop } = require("./src/structures/Shop");
const { TicketsManager } = require("./src/managers/tickets/TicketsManager");
const { Ticket } = require("./src/structures/Ticket");


const STATES = {
  ON: "on",
  OFF: "off",
  CREATED: "created",
  SHUTTED: "shutted",
  WAITING: "waiting",
};

const MATCHTYPES = {
  OneVOne: "1v1",
  TwoVTwo: "2v2",
  ThreeVThree: "3v3",
  FourVFour: "4v4",
  FiveVFive: "5v5",
  SixVSix: "6v6",
};
const BETTYPES = {
  OneVOne: "1v1",
  TwoVTwo: "2v2",
  ThreeVThree: "3v3",
  FourVFour: "4v4",
  FiveVFive: "5v5",
  SixVSix: "6v6",
};

const BASESTATUS = {
  ON: "on",
  OFF: "off",
};

const MATCHSTATUS = {
  ON: "on",
  OFF: "off",
  CREATED: "created", // Match was created but not started
  SHUTTED: "shutted"  // Match was forcefully closed
};
const GUILDSTATUS = {
  bets: "on",
  matches: "on",
  dailyRank: "on",
};

/**
 * Represents a protection type that can be applied to a user,
 * such as immunity, point protection, or double points bonus.
 * Contains details about duration and who added it.
 */
const UserProtection = {
  type: '',
  longevity: 0,
  addedBy: '',
  when: Date,
};
/**
 * Represents a role within the guild.
 */
const Role = {
  ids: [''],
  type: '',
}

/**
 * Represents an association between a user and the original match channel.
 * Useful for tracking voice or text channels per match.
 */
const UserOriginalChannel = {
  channelId: '',
  matchId: '',
};

/**
 * Defines the basic numeric and status fields for a user,
 * such as wins, points, and blacklist status.
 */
const BaseUserNumericFields = {
  wins: 0,
  points: 0,
  mvps: 0,
  losses: 0,
  gamesPlayed: [''],
  blacklisted: false,
};

/**
 * Optional fields that can be stored for a bet user record in the database.
 */
const BetUserKeys = {
  /**
   * The amount of credit the player has.
   * @default 0
   */
  credit: 0,

  /**
   * The 0 of MVPs achieved by the player.
   * @default 0
   */
  mvps: 0,

  /**
   * The 0 of losses the player has.
   * @default 0
   */
  losses: 0,

  /**
   * Indicates if the player is blacklisted.
   * @default false
   */
  blacklisted: false,
};

/**
 * Defines the shape of event types emitted by the system,
 * mapping event names to their payload types.
 */
const EventMap = {
  userCreate: User,
  betUserCreate: BetUser,
  betUpdate: Bet,
  guildDelete: Guild,
  matchEnd: Match,
};

/**
 * Represents a confirmation object holding IDs and count
 * for confirmed entities such as players or bets.
 */
const Confirmed = {
  ids: [''],
  type: '',
  count: 0,
};

/**
 * Represents a basic channel structure
 * with ID and type information.
 */
const GroupedChannelData = {
  ids: [''],
  type: '',
};

/**
 * Represents a basic message structure
 * with ID and type information.
 */
const NormalMessage = {
  id: '',
  type: '',
};


/**
 * Represents the tracking of a player's daily wins,
 * with date information.
 */
const DailyWins = {
  amount: 0,
  date: Date,
}

/**
 * Defines the full data shape for a bet user,
 * including optional profile and stats fields.
 */
const BetUserData = {
  name: '',
  id: '',

  /**
   * Credit balance.
   * @default 0
   */
  credit: 0,

  /**
   * Number of MVP awards.
   * @default 0
   */
  mvps: 0,

  /**
   * Number of losses.
   * @default 0
   */
  losses: 0,

  /**
   * Indicates if the user is blacklisted.
   * @default false
   */
  blacklist: false,

  wins: 0,
  betsPlayed: [''],

  type: "add" | "remove" | '',

  createdAt: Date,
  updatedAt: Date,
  coins: 0,
  dailyWins: DailyWins,

  profileCard: {
    description: '',
    banner: {
      equipped: 0,
      allowed: [0],
    }
  }
};

/**
 * Represents a blacklisted user entry with
 * details about who added them and when.
 */
const BlackListed = {
  id: '',
  addedBy: '',
  when: Date,
}
/**
 * Holds configuration and resources available in a guild,
 * including channels, roles, prices, and mediators.
 */
const NormalGuildKeys = {
  blacklist: BlackListed,
  prefix: '',
  pricesOn: 0,
  pricesAvailable: 0,
  status: GUILDSTATUS,
  seasonId: '',
  mediators: [Mediator],

  channels: {
    dailyRank: GroupedChannelData,
    blacklist: GroupedChannelData,
  },

  categories: {
    bets: GroupedChannelData,
    betsChannel: GroupedChannelData,
  },

  roles: [Role],
}

/**
 * Represents an emoji used in the system,
 * with animation status.
 */
const Emoji = {
  id: '',
  type: '',
  animated: false,
}



/**
 * Defines the database-stored structure of a guild.
 */
const GuildData = {
  prefix: '',
  id: '',
  name: '',
  _id: '',
  pricesOn: [0],
  pricesAvailable: [0],
  status: GUILDSTATUS,
  seasonId: '',
  betsChannelId: '',
  mediators: MediatorsManager,
}

/**
 * Represents the configuration for a single channel.
 */
const BasicChannelData = {
  id: '',
  type: '',
}

/**
 * Interface representing an individual player.
 */
const Player = {
  /**
   * The unique Discord user ID of the player.
   */
  id: '',

  /**
   * The display name of the player.
   */
  name: '',
}

/**
 * Type alias for an array of Player objects.
 */
const Players = [Player];

/**
 * Interface for a confirmed player record,
 * including confirmation type and setup status.
 */
const ConfirmedPlayer = {
  id: '',
  name: '',
  typeConfirm: '',
  setted: false,
}

/**
 * Defines the shape of a mediator record
 * with ID, name, and payment details.
 */
const MediatorData = {
  id: '',
  name: '',
  paymentLinks: [''],
  createdAt: Date,
  updatedAt: Date,
}

/**
 * Represents a channel with its ID and name.
 */
const ChannelInfo = {
  id: '',
  name: '',
}

/**
 * Interface representing the data for a single bet.
 */
const BetData = {
  type: BETTYPES,
  price: 0,
  payedBy: '',
  mediatorId: '',
  confirmed: [Confirmed],
  channels: [Channel],
  messages: [NormalMessage],
  status: STATES,
  embedMessageId: '',
  winner: '',
  loser: '',
  teamA: '',
  teamB: '',
  creatorId: '',
  adminId: '',
  _id: '',
}

/**
 * Defines the structure of a log message,
 * including content, user ID, type, and timestamps.
 */
const LogMessage = {
  content: '' | { data: ArrayBuffer, type: '' },
  userId: '',
  type: '',
  createdAt: Date,
  updatedAt: Date,
}

const ProductData = {
  /**
   * The name of the product
   */
  name: '',

  /**
  * Brief description of the product
  */
  description: '',

  /**
  * The product id
  */
  id: '',

  /**
   * The price of the product
   */
  price: 0,

  /**
   * THe buyers of the product
   */
  buyers: [Player]
}
const ShopData = {
  /**
   * An array of products within a guild
   */
  products: [ProductData],

  /**
   * Number of players that bought a products this does not decrease
   */
  boughtCount: 0
}

const TicketCategory = {
  type: '',
  description: '',
  alias: '',
  emoji: '',
}

const TicketsConfiguration = {
  categories: [TicketCategory],
}

exports.UsersManager = UsersManager;
exports.GuildsManager = GuildsManager;
exports.MatchesManager = MatchesManager;
exports.LogsManager = LogsManager;
exports.ChannelManager = ChannelManager;
exports.BetsManager = BetsManager;
exports.MediatorsManager = MediatorsManager;
exports.TicketsManager = TicketsManager;

exports.Collection = Collection;
exports.Routes = require("./src/rest/Routes");
exports.Mediator = Mediator;
exports.Channel = Channel;
exports.Bet = Bet;
exports.Guild = Guild;
exports.Match = Match;
exports.User = User;
exports.BetUser = BetUser;
exports.Product = Product;
exports.ProductsManager = ProductsManager;
exports.Shop = Shop;
exports.Ticket = Ticket;

exports.UserProtection = UserProtection;
exports.BaseUserNumericFields = BaseUserNumericFields;
exports.UserOriginalChannel = UserOriginalChannel;
exports.BetUserKeys = BetUserKeys;
exports.EventMap = EventMap;
exports.BetUserData = BetUserData;
exports.NormalGuildKeys = NormalGuildKeys;
exports.Emoji = Emoji;
exports.GuildData = GuildData;
exports.BasicChannelData = BasicChannelData;
exports.Players = Players;
exports.ConfirmedPlayer = ConfirmedPlayer;
exports.MediatorData = MediatorData;
exports.ChannelInfo = ChannelInfo;
exports.BetData = BetData;
exports.LogMessage = LogMessage;
exports.ProductData = ProductData;
exports.ShopData = ShopData;
exports.TicketCategory = TicketCategory;
exports.TicketsConfiguration = TicketsConfiguration;

exports.STATES = STATES;
exports.BASESTATUS = BASESTATUS;
exports.MATCHTYPES = MATCHTYPES;
exports.MATCHSTATUS = MATCHSTATUS;
exports.BETTYPES = BETTYPES;
exports.GUILDSTATUS = GUILDSTATUS;

exports.REST = REST;