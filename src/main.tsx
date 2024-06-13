import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RealTalk from "./components/RealTalk/Realtalk";
import Homepage from "./components/HomePage/Homepage";
import AboutUs from "./components/AboutUs/AboutUs";
import App from "./App";
import TestComponent from "./components/testcomponent/test_component";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "realtalk", Component: RealTalk },
      { path: "about-us", Component: AboutUs },
      { path: "test-component", Component: TestComponent },
      { path: "", Component: Homepage },
    ],
  },
  {
    path: "/realtalk",
    element: <RealTalk />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/test-component",
    element: <TestComponent />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
