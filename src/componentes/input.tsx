import { useContext } from "react";
import { CategoryContext } from "../context/contextCategory";

export const Input = () => {
  const { handleSearchInput } = useContext(CategoryContext);

  return (
    <div className="relative p-5">
      <label htmlFor="Search" className="sr-only">
        Search
      </label>
      <input
        onChange={handleSearchInput}
        type="text"
        id="Search"
        placeholder="Search for..."
        className="placeholder:italic placeholder:text-zinc-800  h-full w-full rounded-md py-2.5 pe-10 bg-zinc-300 text-zinc-800 shadow-sm sm:text-sm outline-none"
      />
    </div>
  );
};
