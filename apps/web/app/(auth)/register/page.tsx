import { RegisterForm } from "./form";

export default async function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-[350px] rounded-lg border bg-white shadow-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
