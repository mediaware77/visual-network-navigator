
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="text-9xl font-bold text-network-lightBlue">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          We couldn't find the page you're looking for. The link might be incorrect or the page may have been moved.
        </p>
        <Button asChild>
          <a href="/">
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
