import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get("name");
        const franchise = searchParams.get("franchise");

        const extensions = ["jpg", "jpeg", "png", "webp"];

        let imageUrl = null;
        for (const ext of extensions) {
            const fileName = `${name}${franchise}CastMug.${ext}`;

            const apiRes = await fetch(
                `https://rupaulsdragrace.fandom.com/api.php?action=query&titles=File:${fileName}&prop=imageinfo&iiprop=url&format=json&formatversion=2`
            );

            const data = await apiRes.json();

            const page = data?.query?.pages?.[0];

            if (page?.imageinfo?.[0]?.url) {
                imageUrl = page.imageinfo[0].url;
                break;
            }
        }
        const imageRes = await fetch(imageUrl);

        if (!imageRes.ok) {
            return NextResponse.json(
                { error: "Error fetching image" },
                { status: 500 }
            );
        }
        
        const buffer = await imageRes.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                "Content-Type":
                    imageRes.headers.get("content-type") ||
                    "image/jpeg",
            },
        });
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        );
    }
}