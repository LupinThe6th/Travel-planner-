"use client";

import { useEffect, useRef, useTransition, useState} from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";

type Suggestion = {
  display_name: string;
};

export default function NewLocationClient({tripid} : {tripid:string}) {
    const [isPending,startTransition] = useTransition();

    const inputRef = useRef<HTMLInputElement>(null);

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);


    useEffect(() => {
        if (!query || query.length < 3) {
        setSuggestions([]);
        return;
        }

        const delay = setTimeout(async () => {
            const res = await fetch(
                `https://api.locationiq.com/v1/autocomplete?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_MAPS_API_KEY}&q=${encodeURIComponent(
                query
                )}&format=json`
            );

            const data = await res.json();
            setSuggestions(data || []);
            setShowDropdown(true);
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    const selectPlace = (place: Suggestion) => {
        setQuery(place.display_name);
        setShowDropdown(false);
        setSuggestions([]);

        setTimeout(() => {
            setIsSelecting(false);
        }, 200);
    };
    
    return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center mb-6">Add New Location</h1>
                <form className="space-y-6" 
                action={(formData: FormData) =>
                     {startTransition(() => {
                        addLocation(formData, tripid);
                    });
                }}
                >
                    <div className="relative w-full">
                        <label className="bloxk text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input 
                        name="address" 
                        type="text" 
                        required 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {if (!isSelecting) setShowDropdown(true);}}
                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                        {showDropdown && suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full mt-1 rounded-md shadow-md max-h-60 overflow-y-auto">
                                {suggestions.map((item, idx) => (
                                    <li
                                    key={idx}
                                    onClick={() => selectPlace(item)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                        {item.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Button type="submit" className="w-full">{isPending ? "Adding..." : "Add Location"}</Button>
                </form>
            </div>
        </div>

    </div>

    )
}