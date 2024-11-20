Cypress.Commands.add("login", ({ username, password }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/login",
    body: {
      username,
      password,
    },
    failOnStatusCode: false,
  }).then(({ status, body }) => {
    if (status === 401) {
      cy.log("Login failed: Unauthorized");
    } else {
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(body));
      cy.visit("");
    }
  });
});

Cypress.Commands.add("createBlog", ({ title, author, url, likes = 0 }) => {
  cy.request({
    method: "POST",
    url: "http://localhost:3003/api/blogs",
    body: { title, author, url, likes },
    headers: {
      Authorization: `Bearer ${
        JSON.parse(localStorage.getItem("loggedBlogAppUser")).token
      }`,
    },
  }).then(({ body }) => {
    cy.visit("http://localhost:5173");
  });
});
