import { ReplaceAll, Image as ImageLucide } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

export default function ReplicateAd() {
  return (
    <div className="absolute flex bottom-10 right-1/2 transform translate-x-1/2 bg-white border border-gray-200 w-fit max-w-[500px] overflow-x-auto rounded-md shadow-md p-1.5 items-center gap-4">
      <div className="rounded overflow-hidden">
        <Image
          src="/test-img.png"
          alt="test-image"
          width={80}
          height={20}
          className="object-cover p-1"
        />
      </div>

      <Button variant="outline" className="cursor-pointer">
        <ReplaceAll className="size-4" />
        <p>Replicate</p>
      </Button>

      <Button className=" bg-gray-300 px-4 py-2 rounded size-16 flex items-center justify-center transition cursor-pointer">
        <ImageLucide className="text-gray-400 size-7" />
      </Button>
    </div>
  );
}
