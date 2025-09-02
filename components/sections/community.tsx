import DiscordIcon from "@/components/icons/discord-icon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cardDiscord";

export const CommunitySection = () => {
  return (
    <section id="community" className="py-12 ">
      <hr className="border-secondary" />
      <div className="container py-20 sm:py-20">
        <div className="lg:w-[60%] mx-auto">
          <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center relative left-[20%]">
            <CardHeader>
              <CardTitle className="text-4xl sm:text-5xl md:text-6xl tracking-tight flex flex-col items-center">
                <DiscordIcon />
                <div>
                  Ready to enter the 
                  <span className="text-transparent pl-2 bg-gradient-to-r from-[#0099FF] to-primary bg-clip-text">
                    community?
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="lg:w-[80%] text-xl text-muted-foreground">
              Zerlo community of programmers, designers, and builders
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href="https://discord.gg/KyHjB6zc" target="_blank">
                  Join Discord
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};