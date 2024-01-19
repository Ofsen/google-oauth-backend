# Auth ExpressJS server with Google

Works with the OIDC Strategy and sessions

### Frontend Example

**Required** - install `react-router-dom`

```js
import { useEffect, useState } from "react";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/success",
    Component: Success,
  },
  {
    path: "*",
    Component: Home,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export function Home() {
  return (
    <div>
      <h1>OpenID Connect avec Google</h1>
      <a href="http://localhost:3000/login">Se connecter avec Google</a>
    </div>
  );
}

export function Success() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <div>
      <Link to="/">Retour</Link>
      <h1>Connexion réussi</h1>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
}

export default App;
```
