import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
//  output: "export",
   images: {
    domains: ["faithstream.s3.us-east-1.amazonaws.com", "d3jaci99bhbzji.cloudfront.net", ],
  },
};

export default nextConfig;
