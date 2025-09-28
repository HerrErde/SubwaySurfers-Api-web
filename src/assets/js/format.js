endpointsList = [
  {
    name: "UpdatePlayer",
    endpoint: "/rpc/player.ext.v1.PrivateService/UpdatePlayer",
    params: {
      name: {
        name: "name",
        regex: "^[a-zA-Z]{2,15}$",
        type: "string",
        example: "StylingeDino",
        desc: "No spaces and 2-15 only alphabet letters"
      },
      level: {
        name: "level",
        regex: "^(0|100|[1-9][0-9]?)$",
        type: "int",
        example: "1",
        desc: "The limit is 0-100"
      },
      highscore: {
        name: "highscore",
        regex: "^(0|[1-9][0-9]{0,8})$",
        type: "int",
        example: "100",
        desc: "The limit is 0-999999999"
      }
    },
    request: "UpdatePlayerRequest",
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
