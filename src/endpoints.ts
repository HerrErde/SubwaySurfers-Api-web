import type { Endpoint } from "./stores/app";

export const endpointsList: Endpoint[] = [
  {
    name: "UpdatePlayer",
    endpoint: "/rpc/player.ext.v1.PrivateService/UpdatePlayer",
    params: {
      name: {
        name: "name",
        regex: "^[a-zA-Z]{2,15}$",
        type: "string",
        required: true,
        example: "StylingeDino",
        desc: "No spaces and 2-15 only alphabet letters"
      },
      level: {
        name: "level",
        regex: "^(0|100|[1-9][0-9]?)$",
        type: "int",
        example: "1",
        default: "",
        desc: "The limit is 0-100 When empty default is 0"
      },
      highscore: {
        name: "highscore",
        regex: "^(0|[1-9][0-9]{0,9})$",
        type: "int",
        example: "100",
        desc: "The limit is 0-2500000000 When empty default is 0"
      },
      metadata: {
        name: "metadata",
        type: "list",
        metadata: {
          selected_country: {
            name: "country",
            type: "string",
            example: "us",
            regex:
              "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
            desc: "A Country code like us,nl,de"
          },
          selected_character: {
            name: "character",
            regex: "^[^.]+.[^.]+$",
            type: "string",
            example: "jake.default",
            desc: "The selected character with name and outfit (jake.default)"
          },
          selected_board: {
            name: "board",
            type: "string",
            example: "default"
          },
          selected_board_upgrades: {
            name: "board_upgrades",
            type: "string",
            example: "default,trail",
            desc: "A comma seperated list of board upgrades (default,trail)"
          },
          selected_portrait: {
            name: "portrait",
            type: "string",
            example: "boombox_graffiti_portrait"
          },
          selected_frame: {
            name: "frame",
            type: "string",
            example: "jake_portrait"
          },
          selected_background: {
            name: "background",
            type: "string",
            example: "default_background"
          },
          highscore_default: {
            name: "highscore_default",
            regex:
              "([0-9]|[1-9][0-9]{1,8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-3][0-9]|214748364[0-7])",
            type: "int",
            example: "1",
            desc: "0-214748364"
          },
          stat_total_visited_destinations: {
            name: "total_visited_destinations",
            type: "int",
            example: "1"
          },
          stat_total_games: {
            name: "total_games",
            type: "int",
            example: "1"
          },
          stat_owned_characters: {
            name: "owned_characters",
            type: "int",
            example: "1"
          },
          stat_owned_characters_outfits: {
            name: "owned_characters_outfits",
            type: "int",
            example: "1"
          },
          stat_owned_boards: {
            name: "owned_boards",
            type: "int",
            example: "1"
          },
          stat_owned_boards_upgrades: {
            name: "owned_boards_upgrades",
            type: "int",
            example: "1"
          },
          stat_achievements: {
            name: "achievements",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_bronze: {
            name: "total_top_run_medals_bronze",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_silver: {
            name: "total_top_run_medals_silver",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_gold: {
            name: "total_top_run_medals_gold",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_diamond: {
            name: "total_top_run_medals_diamond",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_champion: {
            name: "total_top_run_medals_champion",
            type: "int",
            example: "1"
          },
          equipped_badge_tier_1: {
            name: "equipped_badge_tier_1",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_1: {
            name: "badge 1",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_2: {
            name: "equipped_badge_tier_2",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_2: {
            name: "badge 2",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_3: {
            name: "equipped_badge_tier_3",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_3: {
            name: "badge 3",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_4: {
            name: "equipped_badge_tier_4",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_4: {
            name: "badge 4",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          }
        }
      }
    },
    request: "player.ext.v1.UpdatePlayerRequest",
    response: "player.ext.v1.UpdatePlayerResponse",
    type: "rpc"
  },
  {
    name: "CreatePlayer",
    endpoint: "/rpc/player.ext.v1.PrivateService/CreatePlayer",
    desc: "This endpoint will not work with a existing account, only a new one.",
    params: {
      name: {
        name: "name",
        regex: "^[a-zA-Z]{2,15}$",
        type: "string",
        required: true,
        example: "StylingeDino",
        desc: "No spaces and 2-15 only alphabet letters"
      },
      level: {
        name: "level",
        regex: "^(0|100|[1-9][0-9]?)$",
        type: "int",
        example: "1",
        default: "",
        desc: "The limit is 0-100 When empty default is 0"
      },
      highscore: {
        name: "highscore",
        regex: "^(0|[1-9][0-9]{0,9})$",
        type: "int",
        example: "100",
        desc: "The limit is 0-2500000000 When empty default is 0"
      },
      metadata: {
        name: "metadata",
        type: "list",
        metadata: {
          selected_country: {
            name: "country",
            type: "string",
            example: "us",
            regex:
              "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
            desc: "A Country code like us,nl,de"
          },
          selected_character: {
            name: "character",
            regex: "^[^.]+.[^.]+$",
            type: "string",
            example: "jake.default",
            desc: "The selected character with name and outfit (jake.default)"
          },
          selected_board: {
            name: "board",
            type: "string",
            example: "default"
          },
          selected_board_upgrades: {
            name: "board_upgrades",
            type: "string",
            example: "default,trail",
            desc: "A comma seperated list of board upgrades (default,trail)"
          },
          selected_portrait: {
            name: "portrait",
            type: "string",
            example: "boombox_graffiti_portrait"
          },
          selected_frame: {
            name: "frame",
            type: "string",
            example: "jake_portrait"
          },
          selected_background: {
            name: "background",
            type: "string",
            example: "default_background"
          },
          highscore_default: {
            name: "highscore_default",
            regex:
              "([0-9]|[1-9][0-9]{1,8}|1[0-9]{9}|20[0-9]{8}|21[0-3][0-9]{7}|214[0-6][0-9]{6}|2147[0-3][0-9]{5}|21474[0-7][0-9]{4}|214748[0-2][0-9]{3}|2147483[0-5][0-9]{2}|21474836[0-3][0-9]|214748364[0-7])",
            type: "int",
            example: "1",
            desc: "0-214748364"
          },
          stat_total_visited_destinations: {
            name: "total_visited_destinations",
            type: "int",
            example: "1"
          },
          stat_total_games: {
            name: "total_games",
            type: "int",
            example: "1"
          },
          stat_owned_characters: {
            name: "owned_characters",
            type: "int",
            example: "1"
          },
          stat_owned_characters_outfits: {
            name: "owned_characters_outfits",
            type: "int",
            example: "1"
          },
          stat_owned_boards: {
            name: "owned_boards",
            type: "int",
            example: "1"
          },
          stat_owned_boards_upgrades: {
            name: "owned_boards_upgrades",
            type: "int",
            example: "1"
          },
          stat_achievements: {
            name: "achievements",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_bronze: {
            name: "total_top_run_medals_bronze",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_silver: {
            name: "total_top_run_medals_silver",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_gold: {
            name: "total_top_run_medals_gold",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_diamond: {
            name: "total_top_run_medals_diamond",
            type: "int",
            example: "1"
          },
          stat_total_top_run_medals_champion: {
            name: "total_top_run_medals_champion",
            type: "int",
            example: "1"
          },
          equipped_badge_tier_1: {
            name: "equipped_badge_tier_1",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_1: {
            name: "badge 1",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_2: {
            name: "equipped_badge_tier_2",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_2: {
            name: "badge 2",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_3: {
            name: "badge 3",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_3: {
            name: "equipped_badge_tier_3",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_4: {
            name: "badge 4",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|38|39|40|41)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_4: {
            name: "equipped_badge_tier_4",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          }
        }
      }
    },
    request: "player.ext.v1.CreatePlayerRequest",
    response: "player.ext.v1.CreatePlayerResponse",
    type: "rpc"
  },
  {
    name: "GetPlayer",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayer",
    desc: "Retrieve the authenticated player's profile.",
    params: {},
    request: "player.ext.v1.GetPlayerRequest",
    response: "player.ext.v1.GetPlayerResponse",
    type: "rpc"
  },
  {
    name: "GetPlayerByTag",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayerByTag",
    params: {
      tag: {
        name: "playertag",
        regex: "^[A-Z0-9]{14}$",
        type: "string",
        required: true,
        example: "BY1BJH84CVHHIX"
      }
    },
    desc: "Retrieve a player by their public playertag.",
    request: "player.ext.v1.GetPlayerByTagRequest",
    response: "player.ext.v1.GetPlayerByTagResponse",
    type: "rpc"
  },
  {
    name: "GetPlayerById",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayerById",
    params: {
      uid: {
        name: "playeruuid",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Retrieve a player by their UUID.",
    request: "player.ext.v1.GetPlayerByIdRequest",
    response: "player.ext.v1.GetPlayerByIdResponse",
    type: "rpc"
  },
  {
    name: "GetWallet",
    endpoint: "/rpc/wallet.ext.v1.PrivateService/GetWallet",
    desc: "Retrieve the authenticated player's wallet balances.",
    params: {},
    request: "wallet.ext.v1.GetWalletRequest",
    response: "wallet.ext.v1.GetWalletResponse",
    type: "rpc"
  },
  {
    name: "Match",
    endpoint: "/rpc/player.ext.v1.PrivateService/Match",
    desc: "Request matchmaking or retrieve current match info.",
    params: {},
    request: "player.ext.v1.MatchRequest",
    response: "player.ext.v1.MatchResponse",
    type: "rpc"
  },
  {
    name: "GetFriends",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetFriends",
    desc: "List the current player's friends.",
    params: {},
    request: "friends.ext.v1.GetFriendsRequest",
    response: "friends.ext.v1.GetFriendsResponse",
    type: "rpc"
  },
  {
    name: "GetInvites",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetInvites",
    desc: "List pending friend invites for the player.",
    params: {},
    request: "friends.ext.v1.GetInvitesRequest",
    response: "friends.ext.v1.GetInvitesResponse",
    type: "rpc"
  },
  {
    name: "GetFriendsAndInvites",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetFriendsAndInvites",
    desc: "List friends and incoming invites in a single response.",
    params: {},
    request: "friends.ext.v1.GetFriendAndInvitesRequest",
    response: "friends.ext.v1.GetFriendAndInvitesResponse",
    type: "rpc"
  },
  {
    name: "SendInvite",
    endpoint: "/rpc/friends.ext.v1.PrivateService/SendInvite",
    params: {
      userId: {
        value: "userId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Send a friend invite to the specified user UUID.",
    request: "friends.ext.v1.SendInviteRequest",
    response: "friends.ext.v1.SendInviteResponse",
    type: "rpc"
  },
  {
    name: "AcceptInvite",
    endpoint: "/rpc/friends.ext.v1.PrivateService/AcceptInvite",
    params: {
      inviteId: {
        value: "inviteId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Accept a friend invite identified by invite UUID.",
    request: "friends.ext.v1.AcceptInviteRequest",
    response: "friends.ext.v1.AcceptInviteResponse",
    type: "rpc"
  },
  {
    name: "CancelInvite",
    endpoint: "/rpc/friends.ext.v1.PrivateService/CancelInvite",
    params: {
      inviteId: {
        value: "inviteId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Cancel an outgoing friend invite by invite UUID.",
    request: "friends.ext.v1.CancelInviteRequest",
    response: "friends.ext.v1.CancelInviteResponse",
    type: "rpc"
  },
  {
    name: "DeclineInvite",
    endpoint: "/rpc/friends.ext.v1.PrivateService/DeclineInvite",
    params: {
      inviteId: {
        value: "inviteId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Decline an incoming friend invite by invite UUID.",
    request: "friends.ext.v1.DeclineInviteRequest",
    response: "friends.ext.v1.DeclineInviteResponse",
    type: "rpc"
  },
  {
    name: "RemoveFriend",
    endpoint: "/rpc/friends.ext.v1.PrivateService/RemoveFriend",
    params: {
      inviteId: {
        value: "inviteId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Remove a friend relationship (provide the invite or relation id).",
    request: "friends.ext.v1.RemoveFriendRequest",
    response: "friends.ext.v1.RemoveFriendResponse",
    type: "rpc"
  },
  {
    name: "GetRelationship",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetRelationship",
    params: {
      userId: {
        name: "userId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    desc: "Get relationship status with another player.",
    request: "friends.ext.v1.GetRelationshipRequest",
    response: "friends.ext.v1.GetRelationshipResponse",
    type: "rpc"
  },
  {
    name: "InitializeEnergy",
    endpoint: "/rpc/energy.ext.v1.PrivateService/InitializeEnergy",
    params: {
      kindId: {
        name: "kindId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197780a-77bc-7bb8-bf9b-687fa58a53c0"
      }
    },
    desc: "Initialize or register an energy kind for the player.",
    request: "",
    response: "",
    type: "json"
  },
  {
    name: "GetEnergies",
    endpoint: "/rpc/energy.ext.v1.PrivateService/GetEnergies",
    desc: "List all energy kinds and the player's current balances.",
    params: {},
    request: "",
    response: "",
    type: "json"
  },
  {
    name: "AddEnergy",
    endpoint: "/rpc/energy.ext.v1.PrivateService/AddEnergy",
    params: {
      kindId: {
        name: "kindId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197780a-77bc-7bb8-bf9b-687fa58a53c0"
      },
      value: {
        name: "value",
        type: "int",
        example: 100
      }
    },
    body: {
      energyDiff: {
        kindId: "$kindId",
        value: "$value"
      }
    },
    desc: "Add energy amount to the specified kind for the player.",
    request: "",
    response: "",
    type: "json"
  },
  {
    name: "UseEnergy",
    endpoint: "/rpc/energy.ext.v1.PrivateService/UseEnergy",
    params: {
      kindId: {
        name: "kindId",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197780a-77bc-7bb8-bf9b-687fa58a53c0"
      },
      value: {
        name: "value",
        type: "int",
        example: 100
      }
    },
    body: {
      energyDiff: {
        kindId: "$kindId",
        value: "$value"
      }
    },
    desc: "Consume a quantity of energy from the specified kind.",
    request: "",
    response: "",
    type: "json"
  },
  {
    name: "GetTournamentInfo",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/GetTournamentInfo",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      },
      "pool.partitionKey": {
        name: "Pool Partition Key",
        type: "string",
        required: true,
        example: "default",
        desc: "Pool partition key (e.g., default)."
      },
      "pool.countryCodePartitionKey": {
        name: "Country Code Partition Key",
        type: "string",
        required: false,
        example: "us",
        regex:
          "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
        desc: "Country code partition key (e.g., us)."
      }
    },
    desc: "Retrieve tournament info.",
    request: "tournament.ext.v2.GetTournamentInfoRequest",
    response: "tournament.ext.v2.GetTournamentInfoResponse",
    type: "rpc"
  },
  {
    name: "JoinTournament",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/JoinTournament",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      },
      "pool.partitionKey": {
        name: "Pool Partition Key",
        type: "string",
        required: true,
        example: "default",
        desc: "Pool partition key (e.g., default)."
      },
      "pool.countryCodePartitionKey": {
        name: "Country Code Partition Key",
        type: "string",
        required: false,
        example: "us",
        regex:
          "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
        desc: "Ccountry code partition key (e.g., us)."
      }
    },
    desc: "Join the specified tournament.",
    request: "tournament.ext.v2.JoinTournamentRequest",
    response: "tournament.ext.v2.JoinTournamentResponse",
    type: "rpc"
  },
  {
    name: "SubmitScore",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/SubmitScore",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      },
      "pool.partitionKey": {
        name: "Pool Partition Key",
        type: "string",
        required: true,
        example: "default",
        desc: "Pool partition key (e.g., default)."
      },
      "pool.countryCodePartitionKey": {
        name: "Country Code Partition Key",
        type: "string",
        required: false,
        example: "us",
        regex:
          "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
        desc: "Country code partition key (e.g., us)."
      },
      "score.value": {
        name: "Score Value",
        regex: "^([0-9]|[1-8][0-9]|90)$",
        type: "int",
        required: false,
        example: 50,
        desc: "The limit is 0-90"
      },
      "score.gameplayDuration.seconds": {
        name: "gameplayDuration.seconds",
        type: "int",
        required: false,
        example: 100
      },
      "score.gameplayDuration.nanos": {
        name: "gameplayDuration.nanos",
        type: "int",
        required: false,
        example: 100
      },
      "score.scoredAt.seconds": {
        name: "scoredAt.seconds",
        type: "int",
        required: false,
        example: 100
      },
      "score.scoredAt.nanos": {
        name: "scoredAt.nanos",
        type: "int",
        required: false,
        example: 100
      }
    },
    desc: "Submit a player's score to the tournament leaderboard.",
    request: "tournament.ext.v2.SubmitScoreRequest",
    response: "tournament.ext.v2.SubmitScoreResponse",
    type: "rpc"
  },
  {
    name: "GetScores",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/GetScores",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      },
      "pool.partitionKey": {
        name: "Pool Partition Key",
        type: "string",
        required: true,
        example: "default",
        desc: "Pool partition key (e.g., default)."
      },
      "pool.countryCodePartitionKey": {
        name: "Country Code Partition Key",
        type: "string",
        required: false,
        example: "us",
        regex:
          "^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
        desc: "Country code partition key (e.g., us)."
      }
    },
    desc: "Retrieve leaderboard scores for a tournament.",
    request: "tournament.ext.v2.GetScoresRequest",
    response: "tournament.ext.v2.GetScoresResponse",
    type: "rpc"
  },
  {
    name: "GetResults",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/GetResults",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      }
    },
    desc: "Retrieve leaderboard scores for a tournament.",
    request: "tournament.ext.v2.GetResultsRequest",
    response: "tournament.ext.v2.GetResultsResponse",
    type: "rpc"
  },
  {
    name: "ClaimRewards",
    endpoint: "/rpc/tournament.ext.v2.PrivateService/ClaimRewards",
    params: {
      "tournament.id": {
        name: "Tournament ID",
        type: "string",
        required: true,
        example: "top_run_v1",
        desc: "Tournament identifier (e.g., top_run_v1)."
      }
    },
    desc: "Claim earned rewards for the tournament.",
    request: "tournament.ext.v2.ClaimRewardsRequest",
    response: "tournament.ext.v2.ClaimRewardsResponse",
    type: "rpc"
  }
];
