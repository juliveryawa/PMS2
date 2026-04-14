/**
 * logout()
 * Clears the auth token from both storage locations and redirects to /login.
 * Call this from the sidebar or any page that has a logout button.
 *
 * Usage:
 *   import logout from "./logout";
 *   <button onClick={() => logout(navigate)}>Sign out</button>
 */
export default function logout(navigate) {
  localStorage.removeItem("pms_token");
  localStorage.removeItem("pms_user");
  sessionStorage.removeItem("pms_token");
  sessionStorage.removeItem("pms_user");
  navigate("/login", { replace: true });
}
