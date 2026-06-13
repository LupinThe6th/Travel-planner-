import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user?.id) {
            return new NextResponse("Not authenticated", {status:401});
        }

        const locations = await prisma.location.findMany({
            where: {
                trip: {
                    userId: session.user?.id
                },
            },
            select: {
                locationTitle: true,
                lat: true,
                lng: true,
                trip: {
                    select: {
                        title: true,
                    }
                }
            }
        });

        const transformedLocations = [];

        for (const loc of locations) {
        // safety check
        if (!loc.lat || !loc.lng) continue;

        const geocodeResult = await getCountryFromCoordinates(
            loc.lat,
            loc.lng
        );

        transformedLocations.push({
            name: `${loc.trip.title} - ${geocodeResult.formattedAddress}`,
            lat: loc.lat,
            lng: loc.lng,
            country: geocodeResult.country,
        });

        // respect LocationIQ rate limit (2 requests/sec)
        await sleep(600);
        }

        return NextResponse.json(transformedLocations);
    } catch(err) {
        return new NextResponse("Internal Error", {status:500});
    }
}