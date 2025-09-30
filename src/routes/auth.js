describe("Authentication Endpoints", () => {
  it("should successfully register a user when valid details are provided", async () => {
    const payload = {
      name: "Harshil Goti",
      username: "hgoti",
      email: "harshilg01@gmail.com",
      password: "H@rshil9900",
    };

    const res = await request(app).post("/api/auth/signup").send(payload);
    expect(res.statusCode).toEqual(201);
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(["id", "name", "username", "email"])
    );
    expect(res.body).toMatchObject({
      name: "Harshil Goti",
      username: "harshilgoti01@gmail.com",
      email: "hg01@gmail.com",
    });
    expect(res.body.passwordHash).toBeUndefined();
  });

  afterAll(async () => {
    await User.deleteOne({ username: "hgoti" });
  });
});
