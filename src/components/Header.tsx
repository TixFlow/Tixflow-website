import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 px-6">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My App</h1>
        <ul className="flex gap-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}
