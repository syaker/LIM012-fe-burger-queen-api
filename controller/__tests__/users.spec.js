const { createAnUser } = require("../../controller/users");

const resp = {
  status: (state) => ({
    send: (json) => json,
  }),
};
const next = (data) => data;

describe("createAnUser", () => {
  it.only("Deberia poder crear un usuario", async (done) => {
    const req = {
      body: {
        email: "zucaritas@gmail.com",
        password: "sweet",
      },
    };
    const response = await createAnUser(req, resp, next);
    expect(response).toBe("zucaritas@gmail.com");
  });

















  it("Deberia responder 400 si no se provee email o password", async () => {
    const req = {
      body: {
        password: "sweet",
      },
    };
    const req2 = {
      body: {
        email: "sara@local.com",
      },
    };
    const response = await createAnUser(req, obj.resp, obj.next);
    const response2 = await createAnUser(req2, obj.resp, obj.next);
    expect(response).toBe(400);
    expect(response2).toBe(400);
  });

  it("Deberia retornar 403 si el usuario ya existe", async () => {
    const req = {
      body: {
        email: "samara@gmail.com",
        password: "123456",
      },
    };
    await createAnUser(req, obj.resp, obj.next);
    const response = await createAnUser(req, obj.resp, obj.next);
    expect(response).toBe(403);
  });
});
// describe("updateAnUser", () => {
//   it("", (done) => {
//     done();
//   });
// });
// describe("deleteAnUser", () => {
//   it("should get users collection", (done) => {
//     done();
//   });
// });
