import { useMemo, useState } from "react";
import { debounce } from "../utils/debouce";

export const Search = ({ updateSearchParams, currentSearch }) => {
  const [value, setValue] = useState(currentSearch ?? "");

  const debounceSaveSearch = useMemo(
    () =>
      debounce((query: string) => {
        updateSearchParams({ search: query, page: 1 });
      }, 800),
    [updateSearchParams]
  );

  function handleSearch(e: React.FormEvent<HTMLInputElement>): void {
    const {
      currentTarget: { value }
    } = e;
    setValue(value);
    debounceSaveSearch(value);
  }

  return (
    <label className="input input-md input-bordered flex items-center gap-2 my-2 max-w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4 opacity-70">
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>
      <input
        value={value}
        type="text"
        className="grow"
        placeholder="Search"
        onChange={handleSearch}
      />
    </label>
  );
};
