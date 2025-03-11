



import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.NEXT_PUBLIC_WAKATIME_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "WakaTime API key is missing" }, { status: 500 });
    }

    try {
        const response = await fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
            headers: {
                Authorization: `Basic ${Buffer.from(apiKey).toString("base64")}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
        }
    }
}
