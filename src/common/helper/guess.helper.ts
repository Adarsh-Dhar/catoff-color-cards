import { BN, Program } from "@coral-xyz/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { ColorCards } from "../color_card";
import idl from "@/common/idl/uno_game.json";

export const deriveChallangePda = async (program: Program<ColorCards>) => {
  const [stateAccountPda, _] = await PublicKey.findProgramAddressSync(
    [Buffer.from("guess_state")],
    new PublicKey(idl.address),
  );

  const stateAccount = await program.account.GameState.fetch(stateAccountPda);

  const [pda] = await PublicKey.findProgramAddressSync(
    [
      Buffer.from("guess_challenge"),
      new BN(await stateAccount.current_game_id).toBuffer("le", 8),
      Buffer.alloc(7),
    ],
    new PublicKey(idl.address),
  );
  return { stateAccount, pdaAccount: pda };
};

export const deriveGamePdaById = async (
  challangeId: string,
): Promise<{ pdaAccount: PublicKey }> => {
  const [pdaAccount, _] = await PublicKey.findProgramAddressSync(
    [Buffer.from("guess_challenge"), new BN(challangeId).toBuffer("le", 8), Buffer.alloc(7)],
    new PublicKey(idl.address),
  );
  return { pdaAccount };
};

export const initGuessingGame = async (): Promise<{
  program: Program<ColorCards>;
  connection: Connection;
}> => {
  const connection = new Connection(process.env.SOLANA_RPC || clusterApiUrl("devnet"), "confirmed");
  const program: Program<ColorCards> = new Program(idl as ColorCards, { connection });
  return { program, connection };
};

export const getIconUrl = async (): Promise<string> => {
  const baseUrl =
    process.env.ENV === "prod" ? "https://blinks-game.onrender.com" : "http://localhost:3000";

  return new URL("/guess-game-icon.png", baseUrl).toString();
};
