export type ColorCards = {
    "address": "CcavjFofgadiL2GH4pPHpXzXQMHbMMcdivofwuZGypoR",
    "metadata": {
      "name": "uno_game",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "declare_uno",
        "discriminator": [
          61,
          124,
          190,
          179,
          139,
          171,
          213,
          42
        ],
        "accounts": [
          {
            "name": "game",
            "writable": true
          },
          {
            "name": "player",
            "signer": true
          }
        ],
        "args": []
      },
      {
        "name": "initialize_game",
        "discriminator": [
          44,
          62,
          102,
          247,
          126,
          208,
          130,
          215
        ],
        "accounts": [
          {
            "name": "game",
            "writable": true,
            "signer": true
          },
          {
            "name": "host",
            "writable": true,
            "signer": true
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": []
      },
      {
        "name": "join_game",
        "discriminator": [
          107,
          112,
          18,
          38,
          56,
          173,
          60,
          128
        ],
        "accounts": [
          {
            "name": "game",
            "writable": true
          },
          {
            "name": "player",
            "writable": true,
            "signer": true
          }
        ],
        "args": []
      },
      {
        "name": "play_card",
        "discriminator": [
          63,
          150,
          161,
          24,
          68,
          231,
          108,
          9
        ],
        "accounts": [
          {
            "name": "game",
            "writable": true
          },
          {
            "name": "player",
            "signer": true
          }
        ],
        "args": [
          {
            "name": "card_code",
            "type": "string"
          }
        ]
      },
      {
        "name": "start_game",
        "discriminator": [
          249,
          47,
          252,
          172,
          184,
          162,
          245,
          14
        ],
        "accounts": [
          {
            "name": "game",
            "writable": true
          },
          {
            "name": "host",
            "signer": true
          }
        ],
        "args": []
      }
    ],
    "accounts": [
      {
        "name": "GameState",
        "discriminator": [
          144,
          94,
          208,
          172,
          248,
          99,
          134,
          120
        ]
      }
    ],
    "errors": [
      {
        "code": 6000,
        "name": "GameFull",
        "msg": "Game is full"
      },
      {
        "code": 6001,
        "name": "GameNotInLobby",
        "msg": "Game is not in lobby state"
      },
      {
        "code": 6002,
        "name": "NeedFourPlayers",
        "msg": "Need exactly 4 players to start"
      },
      {
        "code": 6003,
        "name": "NotGameHost",
        "msg": "Only the host can perform this action"
      },
      {
        "code": 6004,
        "name": "GameNotActive",
        "msg": "Game is not active"
      },
      {
        "code": 6005,
        "name": "NotPlayerTurn",
        "msg": "Not player's turn"
      },
      {
        "code": 6006,
        "name": "InvalidCard",
        "msg": "Invalid card played"
      },
      {
        "code": 6007,
        "name": "InvalidCardCode",
        "msg": "Invalid card code format"
      },
      {
        "code": 6008,
        "name": "TooManyCards",
        "msg": "Too many cards to declare UNO"
      },
      {
        "code": 6009,
        "name": "InvalidCardCount",
        "msg": "Invalid card count"
      },
      {
        "code": 6010,
        "name": "PlayerAlreadyJoined",
        "msg": "Player has already joined"
      }
    ],
    "types": [
      {
        "name": "Card",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "color",
              "type": {
                "defined": {
                  "name": "CardColor"
                }
              }
            },
            {
              "name": "card_type",
              "type": {
                "defined": {
                  "name": "CardType"
                }
              }
            }
          ]
        }
      },
      {
        "name": "CardColor",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Red"
            },
            {
              "name": "Blue"
            },
            {
              "name": "Green"
            },
            {
              "name": "Yellow"
            },
            {
              "name": "Wild"
            }
          ]
        }
      },
      {
        "name": "CardType",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Number",
              "fields": [
                "u8"
              ]
            },
            {
              "name": "Skip"
            },
            {
              "name": "Reverse"
            },
            {
              "name": "DrawTwo"
            },
            {
              "name": "Wild"
            },
            {
              "name": "WildDrawFour"
            }
          ]
        }
      },
      {
        "name": "GameState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "host",
              "type": "pubkey"
            },
            {
              "name": "current_players",
              "type": "u8"
            },
            {
              "name": "game_state",
              "type": {
                "defined": {
                  "name": "GameStateOptions"
                }
              }
            },
            {
              "name": "current_turn",
              "type": "u8"
            },
            {
              "name": "direction",
              "type": "bool"
            },
            {
              "name": "current_card",
              "type": {
                "option": {
                  "defined": {
                    "name": "Card"
                  }
                }
              }
            },
            {
              "name": "players",
              "type": {
                "array": [
                  {
                    "option": {
                      "defined": {
                        "name": "PlayerState"
                      }
                    }
                  },
                  4
                ]
              }
            }
          ]
        }
      },
      {
        "name": "GameStateOptions",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Lobby"
            },
            {
              "name": "Active"
            },
            {
              "name": "Finished"
            }
          ]
        }
      },
      {
        "name": "PlayerState",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "player_pubkey",
              "type": "pubkey"
            },
            {
              "name": "cards_count",
              "type": "u8"
            },
            {
              "name": "has_uno",
              "type": "bool"
            }
          ]
        }
      }
    ]
  }