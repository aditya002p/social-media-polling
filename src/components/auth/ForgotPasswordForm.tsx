import React, { useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import { Input } from "../ui/FormElements/Input";
import { Alert } from "../ui/Alert";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Password reset instructions have been sent to your email",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to send password reset email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Reset Your Password
      </h1>

      {message && (
        <Alert
          type={message.type === "error" ? "error" : "success"}
          title={message.type === "error" ? "Error" : "Success"}
          message={message.text}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send Reset Instructions"}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push("/login")}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
