import { describe, it, expect } from "vitest";
import { createPoll } from "../../services/pollService.js";

describe("Poll Creation", () => {
  it("should create a poll with valid data", async () => {
    const poll = await createPoll({
      title: "Best programming language?",
      options: ["Python", "JavaScript"],
      creatorId: "user123",
    });

    expect(poll).toHaveProperty("id");
    expect(poll.options.length).toBe(2);
  });
});
