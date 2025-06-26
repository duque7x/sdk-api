const { User } = require("./src/structures/User");
const { REST } = require("./src/rest/REST");
const UserManager = require("./src/managers/users/UsersManager");
const MatchesManager = require("./src/managers/matches/MatchesManager");
const GuildsManager = require("./src/managers/guilds/GuildsManager");
const { Bet } = require("./src/structures/Bet");
const { Guild } = require("./src/structures/Guild");
const { Match } = require("./src/structures/Match");
const { BetUser } = require("./src/structures/BetUser");
const { Collection } = require("./src/structures/Collection");

const MATCHTYPES = {
  OneVOne: "1v1",
  TwoVTwo: "2v2",
  ThreeVThree: "3v3",
  FourVFour: "4v4",
  FiveVFive: "5v5",
  SixVSix: "6v6",
}
const BETTYPES = {
  OneVOne: "1v1",
  TwoVTwo: "2v2",
  ThreeVThree: "3v3",
  FourVFour: "4v4",
  FiveVFive: "5v5",
  SixVSix: "6v6",
}
const STATES = {
  ON: "on",
  OFF: "off",
  CREATED: "created",
  SHUTTED: "shutted",
  WAITING: "waiting",
}

const BASESTATUS = {
  ON: "on",
  OFF: "off",
}

const MATCHSTATUS = {
  ON: "on",
  OFF: "off",
  CREATED: "created", // Match was created but not started
  SHUTTED: "shutted"  // Match was forcefully closed
}
const GUILDSTATUS = {
  bets: "on" || "off",
  matches: "on" || "off",
  dailyRank: "on" || "off",
}

exports.REST = REST;

exports.MatchesManager;
exports.UserManager = UserManager;
exports.GuildsManager = GuildsManager;
exports.MatchesManager = MatchesManager;

exports.Bet = Bet;
exports.Guild = Guild;
exports.Match = Match;
exports.User = User;
exports.BetUser = BetUser;

exports.STATES = STATES;
exports.BASESTATUS = BASESTATUS;
exports.MATCHTYPES = MATCHTYPES;
exports.MATCHSTATUS = MATCHSTATUS;
exports.BETTYPES = BETTYPES;
exports.GUILDSTATUS = GUILDSTATUS;
exports.Collection = Collection;
exports.Routes = require("./src/rest/Routes");