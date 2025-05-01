export default function GenresLayout({
  children,
  genres,
  movies,
}: {
  children: React.ReactNode;
  genres: React.ReactNode;
  movies: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      {children}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="md:border-r md:pr-6 dark:border-neutral-800">
          {genres}
        </div>
        <div>{movies}</div>
      </div>
    </div>
  );
}
