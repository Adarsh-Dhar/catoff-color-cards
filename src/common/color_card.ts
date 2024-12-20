export type ColorCards ={
    "address": "CcavjFofgadiL2GH4pPHpXzXQMHbMMcdivofwuZGypoR",
    "metadata": {
      "name": "uno_game",
      "version": "0.1.0",
      "spec": "0.1.0",
      "description": "Created with Anchor"
    },
    "instructions": [
      {
        "name": "get_player_card_count",
        "discriminator": [
          90,
          192,
          218,
          70,
          56,
          246,
          211,
          86
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
        "name": "get_player_cards",
        "discriminator": [
          30,
          234,
          121,
          210,
          174,
          219,
          32,
          100
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
          }
        ]
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
            "writable": true,
            "signer": true
          }
        ],
        "args": [
          {
            "name": "card_to_play",
            "type": "string"
          }
        ]
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
      },
      {
        "code": 6004,
        "name": "InvalidPlayer",
        "msg": "Invalid player"
      },
      {
        "code": 6005,
        "name": "InvalidCardPlay",
        "msg": "Invalid card play"
      },
      {
        "code": 6006,
        "name": "NoCardsAvailable",
        "msg": "No cards are available"
      },
      {
        "code": 6007,
        "name": "GameNotInProgress",
        "msg": "Game is not in progress"
      },
      {
        "code": 6008,
        "name": "NotYourTurn",
        "msg": "Please wait for the other player to play"
      }
    ],
    "types": [
      {
        "name": "Direction",
        "type": {
          "kind": "enum",
          "variants": [
            {
              "name": "Clockwise"
            },
            {
              "name": "AntiClockwise"
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
              "name": "game_state",
              "type": {
                "defined": {
                  "name": "GameStateOptions"
                }
              }
            },
            {
              "name": "total_play",
              "type": "u8"
            },
            {
              "name": "current_turn",
              "type": "string"
            },
            {
              "name": "direction",
              "type": {
                "defined": {
                  "name": "Direction"
                }
              }
            },
            {
              "name": "current_card",
              "type": "string"
            },
            {
              "name": "draw_deck",
              "type": {
                "vec": "string"
              }
            },
            {
              "name": "player1_deck",
              "type": {
                "vec": "string"
              }
            },
            {
              "name": "player2_deck",
              "type": {
                "vec": "string"
              }
            },
            {
              "name": "played_deck",
              "type": {
                "vec": "string"
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
      }
    ]
  }