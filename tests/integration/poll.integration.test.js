import request from "supertest";
import app from "../../app";

describe("Poll API", () => {
  it("should create a poll via API", async () => {
    const response = await request(app)
      .post("/api/polls")
      .send({
        title: "Favorite framework?",
        options: ["React", "Vue"],
        creatorId: "user123",
      });

    expect(response.status).toBe(201);
    expect(response.body.poll).toHaveProperty("id");
  });
});
