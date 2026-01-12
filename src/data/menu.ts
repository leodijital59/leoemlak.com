export default [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Listings",
    subMenu: [
      {
        label: "Grid View",
        subMenu: [
          { label: "Grid Default", path: "/grid-default" },
          { label: "Grid Full Width 3 Cols", path: "/grid-full-3-col" },
          { label: "Grid Full Width 4 Cols", path: "/grid-full-4-col" },
          { label: "Grid Full Width 2 Cols", path: "/grid-full-2-col" },
          {
            label: "Grid Full Width 1 Cols v1",
            path: "/grid-full-1-col-v1",
          },
          {
            label: "Grid Full Width 1 Cols v2",
            path: "/grid-full-1-col-v2",
          },
          { label: "Banner Search v1", path: "/banner-search-v1" },
          { title: "Banner Search v2", path: "/banner-search-v2" },
        ],
      },
      {
        label: "Map Style",
        subMenu: [
          {
            label: "Header Map Style",
            path: "/header-map-style",
          },
          { label: "Map V1", path: "/map-v1" },
          { label: "Map V2", path: "/map-v2" },
          { label: "Map V3", path: "/map-v3" },
          { label: "Map V4", path: "/map-v4" },
        ],
      },
      {
        label: "Listing View",
        subMenu: [
          { label: "List v1", path: "/list-v1" },
          { label: "List All Style", path: "/list-all-style" },
        ],
      },
    ],
  },
  {
    label: "Property",
    subMenu: [
      {
        label: "Agents",
        subMenu: [
          { label: "Agents", path: "/agents" },
          { label: "Agent Single", path: "/agent-single/1" },
          { label: "Agency", path: "/agency" },
          { label: "Agency Single", path: "/agency-single/1" },
        ],
      },

      {
        label: "Single Style",
        subMenu: [
          { label: "Single V1", path: "/single-v1/1" },
          { label: "Single V2", path: "/single-v2/1" },
          { label: "Single V3", path: "/single-v3/1" },
          { label: "Single V4", path: "/single-v4/1" },
          { label: "Single V5", path: "/single-v5/1" },
          { label: "Single V6", path: "/single-v6/1" },
          { label: "Single V7", path: "/single-v7/1" },
          { label: "Single V8", path: "/single-v8/1" },
          { label: "Single V9", path: "/single-v9/1" },
          { label: "Single V10", path: "/single-v10/1" },
        ],
      },
    ],
  },

  {
    label: "Pages",
    subMenu: [
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
      { path: "/compare", label: "Compate" },
      { path: "/pricing", label: "Pricing" },
      { path: "/faq", label: "Faq" },
      { path: "/login", label: "Login" },
      { path: "/register", label: "Register" },
      { path: "/404", label: "404" },
      { path: "/invoice", label: "Invoice" },
    ],
  },
];
