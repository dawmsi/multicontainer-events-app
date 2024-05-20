function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center items-center h-screen ${className}`}>
      <span className="loading loading-ring loading-lg text-warning" />
    </div>
  );
}

export default Loader;
