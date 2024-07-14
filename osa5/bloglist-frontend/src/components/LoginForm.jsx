// components/LoginForm.jsx
const LoginForm = ({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
  errorMessage,
}) => (
  <div>
    <h2>Log in to application</h2>
    {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        Password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);

export default LoginForm;
