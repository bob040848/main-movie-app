import SearchPage from "@/components/common/SeachPage";
import { Suspense } from "react";

const Search = () => {
  return (
    <Suspense>
      <SearchPage />;
    </Suspense>
  );
};

export default Search;
