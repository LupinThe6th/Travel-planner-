"use client";

import Globe, { GlobeMethods } from "react-globe.gl";
import { useEffect, useRef } from "react";

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

interface GlobeClientProps {
  locations: TransformedLocation[];
}

export default function GlobeClient({ locations }: GlobeClientProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      backgroundColor="rgba(0,0,0,0)"
      pointColor={() => "#FF5733"}
      pointLabel="name" 
      pointsData={locations}        
      pointRadius={0.5}
      pointAltitude={0.1}
      pointsMerge={true}
      width={800}
      height={600}
/>
  );
}