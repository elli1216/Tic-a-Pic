import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("photobooth", "routes/photobooth.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("dashboard/photoStrips", "routes/dashboard.photoStrips.tsx"),
] satisfies RouteConfig;
