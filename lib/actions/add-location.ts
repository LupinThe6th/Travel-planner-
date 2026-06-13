"use server";

import { auth } from "@/auth";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";


async function geocodeaddress(address: string) {
    const apiKey= process.env.LOCATIONIQ_MAPS_API_KEY!;
    const response = await fetch(  
        `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(
        address
        )}&format=json`
    );

  const data = await response.json();
  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  
  return {lat,lng};
}

export async function addLocation(formData :FormData, tripid:string) {
    const session = auth()
    if (!session) {
        throw new Error("Not authenticated")
    }
    const address = formData.get("address")?.toString()
    if (!address) {
        throw new Error("Missing address")
    }

    const {lat,lng} = await geocodeaddress(address)

    const count = await prisma.location.count({
        where : {tripid},
    });

    await prisma.location.create({
        data : {
            locationTitle: address,
            lat,
            lng,
            tripid,
            order: count,
        }
    });

    redirect(`/trips/${tripid}`);
}