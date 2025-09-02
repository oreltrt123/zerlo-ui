export function SexyBoarder({
  children,
  offset = 10,
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { offset?: number }) {
  return (
    <div className="relative flex overflow-hidden rounded-md p-[2px]">
      <div className='relative z-10 w-full'>{children}</div>
      <div
        style={{
          bottom: `-${offset}px`,
          left: `-${offset}px`,
          right: `-${offset}px`,
          top: `-${offset}px`,
        }}
        className={`absolute m-auto aspect-square animate-spin-slow rounded-full bg-gradient-to-r from-[#5ED4FF] via-[#D13C5F] to-[#F98324]`}
      />
    </div>
  );
}
