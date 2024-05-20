function createPages(pagesCount: number, currentPage: number) {
  const arrr = [];
  if (pagesCount > 8) {
    if (currentPage > 4 && currentPage <= pagesCount) {
      for (let i = currentPage - 3; i <= currentPage + 3; i++) {
        arrr.push(i);
        if (i >= pagesCount) break;
      }
    } else {
      for (let i = 1; i <= 8; i++) {
        arrr.push(i);
        if (i >= pagesCount) break;
      }
    }
  } else {
    for (let i = 1; i <= pagesCount; i++) {
      arrr.push(i);
    }
  }
  return arrr;
}

export const ControlPages = ({
  pagesCount,
  updateSearchParams,
  currentPage = "1",
}) => {
  const page = currentPage ? +currentPage : 1;

  const btnsArr = createPages(pagesCount, page);

  return (
    <div className="flex justify-center items-center my-6">
      {pagesCount > 1 &&
        btnsArr.map((currBtn) => {
          return (
            <button
              onClick={() => {
                updateSearchParams({ page: currBtn });
              }}
              className={`${
                page === currBtn && "bg-base-content text-base-100"
              } p-1 mx-2 transition-all rounded-[4px]`}
              type="button"
              key={`p${currBtn}`}
            >
              {currBtn}
            </button>
          );
        })}
    </div>
  );
};
