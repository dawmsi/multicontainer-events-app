import { Link, useRouteError } from "react-router-dom";

interface ErrorType {
  statusText?: string;
  data?: string;
  message: string;
}

const ErrorPage: React.FC = () => {
  const error: ErrorType = useRouteError() as ErrorType;
  console.log(error);

  return (
    <div
      className="p-3 flex w-full flex-col text-center min-h-screen gap-2 justify-center items-center"
      id="error-page"
    >
      <h1 className="font-bold text-error text-xl">Oops!</h1>
      <p className="text-warning">{error.data}</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Link className="btn" to="/">
        Home
      </Link>
    </div>
  );
};

export default ErrorPage;
