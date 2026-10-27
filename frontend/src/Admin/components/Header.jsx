import { Search, Bell, Menu, ChevronDown } from "lucide-react";

export default function Header({ title, searchQuery, setSearchQuery, onMenuClick }) {
  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  return (
   <></>
  );
}