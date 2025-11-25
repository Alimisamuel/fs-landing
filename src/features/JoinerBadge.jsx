"use client";

export default function JoinersBadge() {
  return (
    <div className="flex items-center justify-center gap-x-4 mt-10">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-[url('/assets/a1.png')] bg-center bg-cover border-3 border-black" />
        <div
          className="w-8 h-8 rounded-full bg-[url('/assets/a2.png')] bg-center bg-cover border-3 border-black"
          style={{ marginLeft: "-12px" }}
        />
        <div
          className="w-8 h-8 rounded-full bg-[url('/assets/a3.png')] bg-center bg-cover border-3 border-black"
          style={{ marginLeft: "-12px" }}
        />
      </div>
      <p className="text-[14px]">Join 10,000+ already onboard</p>
    </div>
  );
}
