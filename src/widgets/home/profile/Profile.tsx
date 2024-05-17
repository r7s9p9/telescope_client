export function Profile() {
  return (
    <div className="flex flex-row items-center justify-center w-full h-full">
      <div className="w-1/2 h-1/2 flex flex-col justify-center items-center">
        <p className="mb-4 font-thin tracking-widest uppercase text-4xl">
          Account
        </p>
        <div className="w-1/2 h-1/2 p-4 bg-slate-100 shadow-xl rounded-xl">
          <p className="text-xl font-light">Username:</p>
          <p className="text-xl font-light">Name:</p>
          <p className="text-xl font-light">Bio:</p>
        </div>
      </div>

      <div className="w-1/2 h-1/2 flex flex-col justify-center items-center">
        <p className="mb-4 font-thin tracking-widest uppercase text-4xl">
          Sessions
        </p>
        <div className="w-1/2 h-1/2 p-4 bg-slate-100 shadow-xl rounded-xl">
          <p className="text-xl font-light">sampletext</p>
        </div>
      </div>
    </div>
  );
}
