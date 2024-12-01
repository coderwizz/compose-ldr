import Image from "next/image";
import { BorderBeam } from "@/components/ui/border-beam";

const Intro = () => {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-9/12">
                <BorderBeam />
                <h1 className="text-4xl font-bold">Hi! I'm Ethan.</h1>
                <p className="text-base text-gray-500">
                I'm a skilled, hands-on problem solver with a knack for optimizing and innovating complex 
                systems—whether it's fine-tuning model routers, diving deep into quant strategies, or tackling 
                brainy puzzles. My work spans from collaborative tech projects, where he boosts model intelligence, 
                to creative pursuits like flash fiction. With a competitive math background, coding prowess, and 
                thoughtful career vision, I tackle challenges with precision and creativity.</p>
            </div>

            <div className="flex-1 w-3/12">
                <Image src="/images/main.png" 
                alt="Ethan"
                width={160}
                height={160}
                className="rounded-full border border-gray-100 object-cover object-center w-40 h-40" />
            </div>
        </div>
    );
};

export default Intro;