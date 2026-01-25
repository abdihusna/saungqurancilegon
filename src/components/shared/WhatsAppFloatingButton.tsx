import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "6285187855124";

export function WhatsAppFloatingButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Hubungi via WhatsApp"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" />
    </button>
  );
}
