endpointsList = [
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
            regex:"^(?:ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw)$",
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
            regex: "^[1-2147483647]+$",
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
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|40)$",
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
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|40)$",
            type: "string",
            example: "achievement_03"
          },
          equipped_badge_tier_2: {
            name: "equipped_badge_tier_2",
            regex: "^[0-4]+$",
            type: "int",
            example: "1"
          },
          equipped_badge_3: {
            name: "badge 3",
            regex:
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|40)$",
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
              "^achievement_(0(3|4|6|7|8)|11|17|18|21|24|28|29|30|31|32|33|34|35|36|37|40)$",
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
    request: "UpdatePlayerRequest",
    response: "PlayerResponse",
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
      selected_board: {
        name: "selected_board",
        type: "string",
        example: "default"
      },
      selected_board_upgrades: {
        name: "selected_board_upgrades",
        type: "string",
        example: "default"
      },
      selected_character: {
        name: "selected_character",
        type: "string",
        example: "default"
      },
      selected_country: {
        name: "selected_country",
        type: "string",
        example: "us",
        regex:
          "^ad|ae|af|ag|ai|al|am|ao|aq|ar|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bj|bn|bo|br|bs|by|bz|ca|cf|ch|ci|cl|cn|co|cr|cu|cy|cz|de|dk|do|dz|ec|ee|eg|er|es|et|fi|fj|fr|gb|ge|gh|gr|gt|gy|hk|hn|hr|ht|hu|id|ie|il|in|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|kn|kp|kr|kw|kz|la|lb|lc|li|lk|lt|lu|lv|ly|ma|md|me|mk|ml|mm|mn|mr|mt|mu|mv|mx|my|mz|na|ng|ni|nl|no|np|nr|nz|om|pa|pe|ph|pk|pl|ps|pt|py|qa|ro|rs|ru|sa|sd|se|sg|si|sk|sn|sr|ss|sv|sy|th|tj|tm|tn|tr|tt|tv|tw|tz|ua|ug|us|uy|uz|vc|ve|vn|ye|za|zm|zw$"
      },
      selected_background: {
        name: "selected_background",
        type: "string",
        example: "default_background"
      },
      selected_frame: {
        name: "selected_frame",
        type: "string",
        example: "default_frame"
      },
      selected_portrait: {
        name: "selected_portrait",
        type: "string",
        example: "jake_portrait"
      },
      stat_total_visited_destinations: {
        name: "stat_total_visited_destinations",
        type: "int",
        example: "1"
      },
      stat_total_games: {
        name: "stat_total_games",
        type: "int",
        example: "1"
      }
    },
    request: "CreatePlayerRequest",
    response: "PlayerResponse",
    type: "rpc"
  },
  {
    name: "GetPlayer",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayer",
    params: null,
    request: "Empty",
    response: "PlayerResponse",
    type: "rpc"
  },
  {
    name: "GetPlayerByTag",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayerByTag",
    params: {
      player: {
        name: "playertag",
        regex: "^[A-Z0-9]{14}$",
        type: "string",
        required: true,
        example: "BY1BJH84CVHHIX"
      }
    },
    request: "PlayerRequest",
    response: "PlayerResponse",
    type: "rpc"
  },
  {
    name: "GetPlayerById",
    endpoint: "/rpc/player.ext.v1.PrivateService/GetPlayerById",
    params: {
      player: {
        name: "playeruuid",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    request: "PlayerRequest",
    response: "PlayerResponse",
    type: "rpc"
  },
  {
    name: "GetFriends",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetFriends",
    params: null,
    request: "Empty",
    response: "GetFriendsResponse",
    type: "rpc"
  },
  {
    name: "GetInvites",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetInvites",
    params: null,
    request: "Empty",
    response: "GetInvitesResponse",
    type: "rpc"
  },
  {
    name: "GetFriendsAndInvites",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetFriendsAndInvites",
    params: null,
    request: "Empty",
    response: "GetFriendAndInvitesResponse",
    type: "rpc"
  },
  {
    name: "SendInvite",
    endpoint: "/rpc/friends.ext.v1.PrivateService/SendInvite",
    params: {
      player: {
        value: "playeruuid",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    request: "PlayerRequest",
    response: "SendInviteResponse",
    type: "rpc"
  },
  {
    name: "GetRelationship",
    endpoint: "/rpc/friends.ext.v1.PrivateService/GetRelationship",
    params: {
      player: {
        name: "playeruuid",
        regex: "^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$",
        type: "string",
        required: true,
        example: "0197351b-ae06-7a3f-8576-0e3d5b95a280"
      }
    },
    request: "PlayerRequest",
    response: "StatusResponse",
    type: "rpc"
  },
  {
    name: "GetWallet",
    endpoint: "/rpc/wallet.ext.v1.PrivateService/GetWallet",
    params: null,
    request: "Empty",
    response: "GetWalletResponse",
    type: "rpc"
  },
  {
    name: "Match",
    endpoint: "/rpc/player.ext.v1.PrivateService/Match",
    params: null,
    request: "Empty",
    response: "MatchPlayerResponse",
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
    request: null,
    response: null,
    type: "json"
  },
  {
    name: "GetEnergies",
    endpoint: "/rpc/energy.ext.v1.PrivateService/GetEnergies",
    params: null,
    request: null,
    response: null,
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
    request: null,
    response: null,
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
    request: null,
    response: null,
    type: "json"
  }
];
