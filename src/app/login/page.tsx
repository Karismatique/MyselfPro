import LoginForm from "./login-form";

export const metadata = {
  title: "Connexion - MySelfPro",
  description: "Accédez à votre tableau de bord MySelfPro pour gérer vos factures.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-950 overflow-hidden px-4">
      {/* Cercles de fond pour effet de flou/lumière moderne */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <LoginForm />
    </div>
  );
}
