import { getIconUrl } from "@/common/helper/guess.helper";
import { ActionError, CompletedAction, createActionHeaders } from "@solana/actions";

const headers = createActionHeaders();

export const GET = async (req: Request) => {
  return Response.json({ message: "Method not supported" } as ActionError, {
    status: 403,
    headers,
  });
};

export const OPTIONS = async () => Response.json(null, { headers });

export const POST = async (req: Request) => {
  const baseUrl = new URL(req.url);

  const challengeId = baseUrl.searchParams.get("challenge-id");
  const href = new URL(
    `/api/actions/guess?challenge-id=${challengeId}&cluster=devnet`,
    process.env.ENV === "prod"
      ? "https://blinks-game.onrender.com/api/actions/create-guess-challange"
      : "http://localhost:3000",
  ).toString();
  const description = `Visit https://dial.to/?action=solana-action:${href} to participate in the challenge!`;
  const payload: CompletedAction = {
    type: "completed",
    title: "Guess Challenge Created Successfully!",
    icon: await getIconUrl(),
    label: "Challenge Created",
    description: description,
  };

  return Response.json(payload, { headers });
};
