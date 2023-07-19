import { Wrapper } from "@/components/local/container";

import { AuthController } from "@/components/local/auth-controller";
import Image from "next/image";
import { Tab } from "./tab";

const HeaderBrand = () => {
        return (
                <div className="flex gap-[82px] w-full justify-between sm:justify-start">
                        <Image
                                src="/ig_news.svg"
                                alt="ig.news"
                                width="100"
                                height="100"
                        />
                        <div className="flex gap-8">
                                <Tab active={true} label="Home" />
                                <Tab active={false} label="Posts" />
                        </div>
                        <AuthController />
                </div>
        );
};

export const Header = () => {
        return (
                <header className="w-full flex bg-brand-background border-b-brand-shape border-b-4 ">
                        <Wrapper className="h-20 max-h-[80px]">
                                <HeaderBrand />
                        </Wrapper>
                </header>
        );
};
