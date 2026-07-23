import LoginForm from "./login-form";

export const metadata = {
  title: "Connexion - MySelfPro",
  description: "Accédez à votre tableau de bord MySelfPro pour gérer vos factures.",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden px-4">
      <LoginForm />
    </div>
  );
}
