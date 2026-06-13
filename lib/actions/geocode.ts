
interface GeoCodeResult {
    country: string,
    formattedAddress:string
}

export async function getCountryFromCoordinates(lat:number, lng:number): Promise<GeoCodeResult> {
    const apiKey= process.env.LOCATIONIQ_MAPS_API_KEY!;
    const response = await fetch(  
        `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`
    );
    
    const data = await response.json();

    const countryComponent = {
        long_name: data.address?.country,
    };

    return {
        country: countryComponent.long_name || "Unknown",
        formattedAddress: data.display_name || "Unknown Address",
    };
}