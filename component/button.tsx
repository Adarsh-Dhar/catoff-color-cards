"use client";

import { useEffect, useState } from "react";

export const Button = () => {
    const [blinkURLState, setBlinkUrlState] = useState<string>("");

    useEffect(() => {
        setBlinkUrlState(`https://dial.to/?action=solana-action:${window.location.origin}/api/actions/create-color-cards&cluster=devnet`);
    }, []);

    return (
        <button
            className="text-black"
            onClick={() => {
                window.location.href = blinkURLState;
            }}
        >
            create a card game
        </button>
    );
}