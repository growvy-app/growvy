import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Home</h1>
      <Link href="/login">login</Link>
      <Link href="/signup">get started</Link>
    </div>
  );
}
