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
        "name": "end_game",
        "discriminator": [
          224,
          135,
          245,
          99,
          67,
          175,
          121,
          252
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
            "name": "player1",
            "writable": true,
            "signer": true
          },
          {
            "name": "system_program",
            "address": "11111111111111111111111111111111"
          }
        ],
        "args": [
          {
            "name": "player2",
            "type": "pubkey"
          },
          {
            "name": "player3",
            "type": "pubkey"
          },
          {
            "name": "player4",
            "type": "pubkey"
          }
        ]
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
        "name": "PlayerNotInGame",
        "msg": "Player is not part of this game"
      },
      {
        "code": 6001,
        "name": "GameNotInLobby",
        "msg": "Game is not in lobby state"
      },
      {
        "code": 6002,
        "name": "PlayerAlreadyJoined",
        "msg": "Player has already joined"
      },
      {
        "code": 6003,
        "name": "UnauthorizedGameEnd",
        "msg": "Only the host can end the game"
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
              "name": "value",
              "type": {
                "defined": {
                  "name": "CardValue"
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
        "name": "CardValue",
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
              "name": "current_game_id",
              "type": "u64"
            },
            {
              "name": "player1",
              "type": "pubkey"
            },
            {
              "name": "player2",
              "type": "pubkey"
            },
            {
              "name": "player3",
              "type": "pubkey"
            },
            {
              "name": "player4",
              "type": "pubkey"
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
              "name": "current_players",
              "type": "u8"
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
              "name": "InProgress"
            },
            {
              "name": "Ended"
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