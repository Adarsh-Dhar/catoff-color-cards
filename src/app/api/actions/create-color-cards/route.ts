import {
  createPostResponse,
  ActionGetResponse,
  ActionPostRequest,
  createActionHeaders,
  NextAction
} from "@solana/actions";
import { clusterApiUrl, Connection, PublicKey, Transaction } from "@solana/web3.js";
import { BN, Program } from "@coral-xyz/anchor";
import { ColorCards } from "@/common/color_card";
import idl from "@/common/idl/uno_game.json";
import { deriveChallangePda, getIconUrl } from "@/common/helper/guess.helper";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    title: "Create a Uno Game",
    icon: await getIconUrl(),
    description: "Create an uno game where 4 player compete within themself to see who uno's the other",
    label: "Create Uno Game",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Create an Uno Game",
          href: "/api/actions/create-color-cards",
          parameters: [
            {
              name: "player-2",
              label: "Enter the wallet address of player2",
              required: true,
              type: "text",
            },
           
          ],
        },
      ],
    },
  };

  return Response.json(payload, { headers });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  try {
    console.log("Received POST request");

    const url = new URL(req.url);
    const player2Address = url.searchParams.get("player2");
    console.log("Address of player2:", player2Address);

    // const secretNumberStr = url.searchParams.get("secret-number");
    // console.log("Secret number:", secretNumberStr);

    // if (!secretNumberStr || isNaN(Number(secretNumberStr))) {
    //   console.error("Invalid secret number provided");
    //   return new Response(JSON.stringify({ error: "Invalid secret number provided" }), {
    //     status: 400,
    //     headers,
    //   });
    // }

    const body: ActionPostRequest = await req.json();
    console.log("Request body:", body);

    if (!body.account) {
      console.error("No account provided");
      return new Response(JSON.stringify({ error: "No account provided" }), {
        status: 400,
        headers,
      });
    }

    const userAccount = new PublicKey(body.account);
    console.log("Player1 account is ", userAccount.toString());

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    console.log("Connection established");

    const program = new Program(idl as ColorCards, { connection });
    console.log("Program initialized");

    const { stateAccount, pdaAccount } = await deriveChallangePda(program);
    console.log("pda account", pdaAccount.toJSON());
    
    if (!player2Address ) {
      alert("addresses of all the players are necessary")
      return;
    }

    const player2PublicKey = new PublicKey(player2Address);
  

    const instruction = await program.methods
      .initialize_game(
        player2PublicKey,

      )
      .accounts({
        player1: userAccount, 
      })
      .instruction();
    console.log("Game created");

    const blockhash = await connection.getLatestBlockhash();
    console.log("Blockhash:", blockhash);

    const transaction = new Transaction({
      feePayer: userAccount,
      blockhash: blockhash.blockhash,
      lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(instruction);
    console.log("Transaction created");

    const response = await createPostResponse({
      fields: {
        type: "transaction",
        transaction: transaction,
        message: "created an uno game",
        links: {
          next: {
            type: "post",
            href: `/api/actions/create-color-cards/next?player-2=${player2Address}&game-id=${stateAccount.current_game_id}`, //need to change the currentChallengeId
          },
        },
      },
    });
    console.log("Response created");

    return Response.json(response, { headers });
  } catch (error) {
    console.error("Failed to process request:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers,
      },
    );
  }
};
