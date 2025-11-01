import { Bell, User } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold">AURÉVO EVENT MANAGEMENT</h1>
        <p className="text-xs text-gray-300">NAPOCOR, TAGOLOAN, MISAMIS ORIENTAL</p>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-6 h-6" />
        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <span className="font-semibold">ADMIN</span>
        </div>
      </div>
    </header>
  );
}
