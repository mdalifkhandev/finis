export function getRoleHomeRoute(role?: string | null) {
  switch (role) {
    case "admin":
      return "/(tab)/home";
    case "worker":
      return "/worker/home";
    case "manager":
      return "/manager/home";
    default:
      return "/screens/auth/roleselect";
  }
}
