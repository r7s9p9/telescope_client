export const HomeHeader = ({ username }: { username?: string }) => {
  const linkItem = (str: string) => (
    <li>
      <a
        href="/"
        aria-label={str}
        title={str}
        className="hover:text-black hover:bg-slate-100 rounded-xl py-2 px-2 cursor-pointer font-medium tracking-wide  transition-colors duration-200 hover:text-deep-purple-accent-400"
      >
        {str}
      </a>
    </li>
  );

  return (
    <div className="flex flex-row items-center justify-between p-2 ml-2 mr-2 text-slate-600 bg-slate-300 rounded-b-xl cursor-default select-none">
      <p className="text-2xl font-thin tracking-widest uppercase ">Telescope</p>
      <div className="flex flex-col items-center">
        <p className="text-xs">Logged in as:</p>
        <p className="text-xs text-bold">{username}</p>
      </div>

      <ul className="flex items-center space-x-8 lg:flex">
        {linkItem("Features")}
        {linkItem("About")}
        {linkItem("Logout")}
      </ul>
    </div>
  );
};
