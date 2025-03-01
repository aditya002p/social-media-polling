import { Suspense } from "react";
import Link from "next/link";
import TrendingPolls from "@/components/polls/TrendingPolls";
import FeaturedOpinions from "@/components/opinions/FeaturedOpinions";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to PollingSocial</h1>
        <p className="mb-6 text-xl">
          Create polls, share opinions, and get answers from people around the
          world
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/polls/create">
            <Button size="lg">Create a Poll</Button>
          </Link>
          <Link href="/opinions/create">
            <Button variant="outline" size="lg">
              Share an Opinion
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Trending Polls</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <TrendingPolls />
        </Suspense>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-semibold">Featured Opinions</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <FeaturedOpinions />
        </Suspense>
      </section>

      <section className="rounded-lg bg-gray-50 p-8 dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-semibold">Join the Conversation</h2>
        <p className="mb-6">
          Connect with like-minded individuals, join groups based on your
          interests, and participate in forums to discuss the topics that matter
          to you.
        </p>
        <div className="flex gap-4">
          <Link href="/forums">
            <Button variant="secondary">Explore Forums</Button>
          </Link>
          <Link href="/groups">
            <Button variant="secondary">Discover Groups</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
