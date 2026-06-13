"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/cards";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/util";
import Image from "next/image";
import { useState, useTransition } from "react";

export default function NewTrip() {
    const [isPending,startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    return (
        <div className = "w-full max-w-lg mx-auto mt-10">
            <Card>
                <CardHeader> New Trip</CardHeader>
                <CardContent>
                    <form className = "space-y-6" action={(formData: FormData) => {
                        if (imageUrl) {
                            formData.append("imageUrl", imageUrl);
                        }
                        startTransition(() => {
                            createTrip(formData);
                        });
                    }}>
                        <div>
                            <label className = "block text-sm font-medium text-gray-700 mb-1">
                                Trip Title
                            </label>
                            <input type="text" name="title" 
                            placeholder="Enter trip title ..."
                            className = {cn("w-full border border-gray-300 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500")}
                            required/>
                        </div>
                        <div>
                            <label className = "block text-sm font-medium text-gray-700 mb-1">
                                Description 
                            </label>
                            <textarea  name="description"  rows={5}
                            className = {cn("w-full border border-gray-300 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500  resize-none ")}
                            placeholder="Enter trip description..."
                            required/>
                        </div>

                        <div className = "grid grid-cols-2 gap-4">
                        <div>
                            <label className = "block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input type="date" name="startDate" 
                            className = {cn("w-full border border-gray-300 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500")}/>
                        </div>
                        <div>
                            <label className = "block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input type="date" name="endDate" 
                            className = {cn("w-full border border-gray-300 px-3 py-2",
                            "rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500")}/>
                        </div>
                        </div>
                        
                        <div>
                        <label >Trip Image</label>
                        {imageUrl && (
                            <Image src={imageUrl} alt="Trip Preview" width={300} height={100}className = "w-full mb-4 rounded-md max-h-48 object-cover" />
                        )}
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                if (res && res[0].ufsUrl) {
                                    setImageUrl(res[0].ufsUrl);
                                }
                            }}
                            onUploadError = {(error: Error) => {
                                console.error("Upload error:", error);
                            }}
                        />
                        </div>

                        <Button type="submit" disabled={isPending} className = "w-full">
                            {isPending ? "Creating..." : "Create Trip"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}