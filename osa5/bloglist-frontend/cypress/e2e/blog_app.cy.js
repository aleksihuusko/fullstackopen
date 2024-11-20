describe("blog app", () => {
  beforeEach(() => {
    cy.request("POST", `${Cypress.env("backend")}/testing/reset`);
    const user = {
      username: "aleksihuusko",
      name: "Aleksi Huusko",
      password: "salasana123",
    };
    cy.request("POST", `${Cypress.env("backend")}/users/`, user);
    cy.visit("");
  });

  it("front page can be opened", () => {
    cy.visit("");
    cy.contains("Log in to application");
  });

  it("login form is shown", () => {
    cy.contains("Log in to application").click();
    cy.get("#login-form").should("be.visible");
  });

  describe("login", () => {
    it("succeeds with correct credentials", () => {
      cy.login({
        username: "aleksihuusko",
        password: "salasana123",
      });
    });

    it("fails with wrong credentials", () => {
      cy.get("#username").type("aleksihuusko");
      cy.get("#password").type("wrong-password");
      cy.get("#login-button").click();
      cy.contains("Wrong username or password");
    });
  });

  describe("when logged in", () => {
    beforeEach(() => {
      cy.login({
        username: "aleksihuusko",
        password: "salasana123",
      });
    });

    it("a blog can be created", () => {
      cy.contains("new blog").click();
      cy.createBlog({
        title: "test title",
        author: "test author",
        url: "test url",
      });
      cy.contains("test title test author");
    });

    describe("and a blog exists", () => {
      beforeEach(() => {
        cy.createBlog({
          title: "test title",
          author: "test author",
          url: "test url",
        });
      });

      it("a blog can be liked", () => {
        cy.contains("test title test author").find("#view-button").click();
        cy.contains("likes 0");
        cy.contains("like").click();
        cy.contains("likes 1");
      });

      it("a blog can be deleted", () => {
        cy.contains("test title test author").find("#view-button").click();
        cy.contains("remove").click();
        cy.contains("test title test author").should("not.exist");
      });

      it("only the user who added the blog can see the delete button", () => {
        cy.contains("logout").click();
        const anotherUser = {
          username: "anotheruser",
          name: "Another User",
          password: "anotherpassword",
        };
        cy.request("POST", `${Cypress.env("backend")}/users/`, anotherUser);
        cy.login({
          username: "anotheruser",
          password: "anotherpassword",
        });
        cy.contains("test title test author").find("#view-button").click();
        cy.contains("remove").should("not.exist");
      });

      it("blogs are ordered by likes", () => {
        cy.createBlog({
          title: "test title 2",
          author: "test author 2",
          url: "test url 2",
          likes: 2,
        });
        cy.contains("test title 2 test author 2").should("exist");
        cy.get(".blog").first().should("contain", "test title 2 test author 2");
        cy.get(".blog").last().should("contain", "test title test author");
        cy.createBlog({
          title: "test title 3",
          author: "test author 3",
          url: "test url 3",
          likes: 3,
        });
        cy.get(".blog").first().should("contain", "test title 3 test author 3");
        cy.get(".blog").last().should("contain", "test title test author");
        cy.get(".blog").last().contains("view").click();
        cy.contains("like").click();
        cy.contains("like").click();
        cy.contains("like").click();
        cy.contains("like").click();
        cy.contains("like").click();
        cy.get(".blog").first().should("contain", "test title test author");
      });
    });
  });
});
