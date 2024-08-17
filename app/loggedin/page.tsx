import UserProfile from "@/components/convex/user-profile";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1>Todost</h1>
        <p>This is AI Based Task Management App</p>

        <UserProfile />

        <Button>Hey</Button>
      </div>
    </main>
  );
}
