import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "../ui/Button";
import { Alert } from "../ui/Alert";
import { LucideGithub, LucideGoogle, LucideTwitter } from "lucide-react";

interface SocialLoginProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({
  redirectTo = "/dashboard",
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSocialLogin = async (
    provider: "google" | "github" | "twitter"
  ) => {
    setLoading(provider);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
        },
      });

      if (error) {
        throw error;
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      if (onError) {
        onError(err);
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <Alert
          type="error"
          title="Authentication Error"
          message={error}
          className="mb-4"
        />
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin("google")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center"
      >
        <LucideGoogle className="w-5 h-5 mr-2" />
        {loading === "google" ? "Connecting..." : "Continue with Google"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin("github")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center"
      >
        <LucideGithub className="w-5 h-5 mr-2" />
        {loading === "github" ? "Connecting..." : "Continue with GitHub"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => handleSocialLogin("twitter")}
        disabled={loading !== null}
        className="w-full flex items-center justify-center"
      >
        <LucideTwitter className="w-5 h-5 mr-2" />
        {loading === "twitter" ? "Connecting..." : "Continue with Twitter"}
      </Button>
    </div>
  );
};

export default SocialLogin;
